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
		case 'customer.subscription.updated':
			const session = event.data.object;
			console.log(session);
			// TODO fix
			const productId = session.plan.product;
			const product = await stripe.products.retrieve(productId);
			console.log(JSON.stringify(product.status, null, 2));

			console.log(event.data.object.metadata.userId);

			await clerkClient(context).users.updateUserMetadata(
				event.data.object.metadata.userId,
				{
					publicMetadata: {
						stripe: {
							status: session.status,
							// This is where we get "paid"
							plan: product.metadata.level,
						},
					},
				},
			);
			break;

		default:
			console.warn(`Unhandled event type: ${event.type}`);
	}

	return new Response(null, {
		status: 200,
		statusText: 'success',
	});
};
