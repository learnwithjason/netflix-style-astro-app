import Stripe from 'stripe';
import type { User } from '@clerk/astro/server';
import { STRIPE_SECRET_KEY } from 'astro:env/server';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const STRIPE_SUBSCRIPTION_TYPES = [
	{
		name: 'Boop Enthusiast',
		description:
			'Show your support, get early access to new episodes, and directly fund the creation of new LWJ content.',
		prices: [
			{
				period: 'monthly',
				price: 500,
				priceId: 'price_1PaiAnJ4VGTQR05OcgOnDj5V',
			},
		],
	},
	{
		name: 'Boop Connoisseur',
		description:
			'Show your support, get early access to new episodes, and directly fund the creation of new LWJ content.',
		prices: [
			{
				period: 'monthly',
				price: 2000,
				priceId: 'price_1PaiBLJ4VGTQR05OVmqMyX7O',
			},
		],
	},
];

export async function getSubscriptionStatus(user: User | null) {
	if (
		!user ||
		!user.publicMetadata.stripe ||
		!user.publicMetadata.stripe.status
	) {
		return null;
	}

	return user.publicMetadata.stripe.status;
}

export async function getSubscriptionDetails(user: User | null) {
	if (
		!user ||
		!user.publicMetadata.stripe ||
		!user.publicMetadata.stripe.customer
	) {
		return null;
	}

	const subList = await stripe.subscriptions.list({
		customer: user.publicMetadata.stripe.customer,
	});

	return subList.data.at(0);
}
