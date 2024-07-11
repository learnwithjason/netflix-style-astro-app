import { type APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!);

export const POST: APIRoute = async ({ request, locals }) => {
	const userId = locals.auth().userId;

	console.log({ userId });

	if (!userId) {
		return new Response(null, {
			status: 401,
			statusText: 'Not authorized',
		});
	}

	const data = await request.formData();
	const price = data.get('priceId') as string;

	if (!price) {
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
		line_items: [{ price, quantity: 1 }],
		metadata: { userId, test: 'value' },
		mode: 'subscription',
	});

	return new Response(null, {
		status: 301,
		headers: {
			location: session.url!,
		},
	});
};
