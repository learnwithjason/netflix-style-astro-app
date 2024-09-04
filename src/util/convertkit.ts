const ck_api = new URL('https://api.convertkit.com');

ck_api.searchParams.set('api_secret', import.meta.env.CONVERTKIT_SECRET_KEY);

export async function getSubscriberByEmail(email: string) {
	ck_api.pathname = '/v3/subscribers';
	ck_api.searchParams.set('email_address', email);

	const res = await fetch(ck_api);

	if (!res.ok) {
		console.error(res.statusText);
		throw new Error('error loading subscriber');
	}

	const data = await res.json();

	return data.subscribers.at(0);
}
