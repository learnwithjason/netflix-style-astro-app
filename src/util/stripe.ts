import Stripe from 'stripe';
import type { User } from '@clerk/astro/server';
import { STRIPE_SECRET_KEY } from 'astro:env/server';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const STRIPE_SUBSCRIPTION_TYPES = [
	{
		name: 'Silver',
		description:
			'Get early access to new episodes, and directly fund the creation of new content.',
		prices: [
			{
				period: 'monthly',
				price: 5_00,
				priceId: 'price_1PaiAnJ4VGTQR05OcgOnDj5V',
			},
		],
	},
	{
		name: 'Gold',
		description:
			'All the perks of the silver tier + a 20% discount on courses and workshops.',
		prices: [
			{
				period: 'monthly',
				price: 20_00,
				priceId: 'price_1PaiBLJ4VGTQR05OVmqMyX7O',
			},
		],
	},
	{
		name: 'Platinum',
		description:
			'All the perks of the gold tier + the option to book a 30-minute monthly strategy call.',
		prices: [
			{
				period: 'monthly',
				price: 100_00,
				priceId: '', // TODO create this
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
