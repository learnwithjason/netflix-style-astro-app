import { type APIRoute } from 'astro';
import Stripe from 'stripe';
import { clerkClient } from 'astro-clerk-auth/server';

// const clerkClient = createClerkClient({
// 	secretKey: import.meta.env.CLERK_SECRET_KEY,
// });

const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!);

export const POST: APIRoute = async (context) => {
	const signature = context.request.headers.get('stripe-signature');

	if (!signature) {
		return new Response(null, {
			status: 400,
		});
	}

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			await context.request.text(),
			signature,
			webhookSecret,
		);
	} catch (error) {
		if (error instanceof Error) {
			return new Response(
				JSON.stringify({
					error: error.message,
				}),
				{
					status: 400,
				},
			);
		}
	}

	if (!event) {
		return new Response(null, {
			status: 400,
		});
	}

	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			const subscriptionId = session.subscription as string;
			const userId = session.metadata?.userId as string;

			if (!subscriptionId || !userId) {
				return new Response(null, {
					status: 500,
					statusText: 'missing required data',
				});
			}

			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
			const productId = subscription.plan.product;
			const product = await stripe.products.retrieve(productId);

			console.log(product);

			// attach the Clerk ID to the Stripe customer
			await stripe.customers.update(subscription.customer as string, {
				metadata: {
					userId: userId,
				},
			});

			// attach the Stripe ID and current plan details to the Clerk user
			await clerkClient(context).users.updateUserMetadata(userId, {
				publicMetadata: {
					stripe: {
						customer: subscription.customer,
						status: subscription.status,
						level: product.name,
					},
				},
			});
			break;

		default:
			console.warn(`Unhandled event type: ${event.type}`);
	}

	return new Response(null, {
		status: 200,
		statusText: 'success',
	});
};
