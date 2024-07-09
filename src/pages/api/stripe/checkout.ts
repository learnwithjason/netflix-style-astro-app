import { type APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!);

export const POST: APIRoute = async ({ request, locals }) => {
	const userId = locals.auth().userId;

	if (!userId) {
		return new Response(null, {
			status: 401,
			statusText: 'Not authorized',
		});
	}

	const data = await request.formData();
	const priceId = data.get('priceId') as string;

	if (!priceId) {
		// TODO what's the right HTTP code here?
		return new Response(null, {
			status: 404,
			statusText: 'Not found',
		});
	}

	const url = new URL(request.url);
	url.pathname = '/dashboard';

	const session = await stripe.checkout.sessions.create({
		success_url: url.toString(),
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
		metadata: {
			userId,
		},
		mode: 'subscription',
	});

	return new Response(null, {
		status: 301,
		headers: {
			location: session.url!,
		},
	});
};
