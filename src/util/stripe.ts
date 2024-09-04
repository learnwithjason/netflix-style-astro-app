import type { User } from 'astro-clerk-auth/server';

export async function getSubscriptionStatus(user: User | null) {
	if (!user) {
		return null;
	}

	const stripe = user.publicMetadata.stripe;

	if (!stripe || !stripe.status) {
		return null;
	}

	return stripe.status;
}
