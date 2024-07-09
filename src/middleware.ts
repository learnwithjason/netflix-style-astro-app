import { clerkMiddleware, createRouteMatcher } from 'astro-clerk-auth/server';

const isProtectedPage = createRouteMatcher([
	/^(?!.*\/(?:sign-up|sign-in)\/?$)\/dashboard.*$/,
]);

export const onRequest = clerkMiddleware((auth, context, next) => {
	if (isProtectedPage(context.request) && !auth().userId) {
		return auth().redirectToSignIn();
	}

	return next();
});
