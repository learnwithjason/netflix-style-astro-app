import { Collection, Episode, Series, User, UserEpisode, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Series).values([
		{
			id: '177c600c-47bd-4592-8f34-6e4fe8c21821',
			title: '#DoItAnyways',
			slug: 'doitanyways',
			description:
				"I'm challenging myself to make a video every weekday for at least two weeks to help me get over my perfectionism and just start making stuff.",
			banner_image:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711515349/lwj/series/doitanyways-banner.jpg',
		},
		{
			id: '21cb46ea-b7de-426a-83ee-43ac0a64d776',
			title: 'Learn With Jason',
			slug: 'learn-with-jason',
			description: 'Learn something new in 90 minutes.',
			banner_image:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474384/lwj/series/doitanyways-banner.jpg',
		},
	]);

	await db.insert(Collection).values([
		{
			id: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			series: '177c600c-47bd-4592-8f34-6e4fe8c21821',
			year: new Date('2024-01-01T00:00:00.000-08:00'),
			name: 'Season 1',
			slug: 's1',
		},
		{
			id: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			series: '21cb46ea-b7de-426a-83ee-43ac0a64d776',
			year: new Date('2024-01-01T00:00:00.000-08:00'),
			name: '2024',
			slug: '2024',
		},
	]);

	await db.insert(Episode).values([
		{
			id: 'd5989bab-47bb-42ed-b2da-0e718fc42a62',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-27T21:00:00.000-08:00'),
			title: 'Collaboration',
			description:
				"It's fun to make stuff. It's better to make stuff with friends.",
			youtube_id: 'e8ZgF8_HmAA',
			playback_id: 'X3bY68s1o8Xr8KisYvZi4PfPIbjv14phkPd00NOyJokY',
			slug: 'collaboration',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474595/lwj/series/mar-27-collaboration.jpg',
		},
		{
			id: 'd64a3d40-960c-430e-9d46-5bcbb6d91cbe',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-25T21:00:00.000-08:00'),
			title: 'Smoothies',
			description:
				"Not every project is a whole meal. Sometimes it's just a smoothie.",
			youtube_id: '8stdjkmewew',
			playback_id: 'osBfvJZ3aAxOlnCUZkx411xeVHEilgfk9qlkQ2aPiow',
			slug: 'smoothies',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474595/lwj/series/mar-25-smoothies.jpg',
		},
		{
			id: '63e9ba7c-4740-49e7-9007-fa8fe675b279',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-22T21:00:00.000-08:00'),
			title: 'No ragrets',
			description:
				'My whole life philosophy sounds ridiculous when I say it out loud.',
			youtube_id: 'kzBPZ-ZACm4',
			playback_id: 'S01pAoT7ggySqrmIuzSee5f2ttqC5dzXmdGQYGEuMDTY',
			slug: 'no-ragrets',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474843/lwj/series/mar-22-no-ragrets.jpg',
		},
		{
			id: '36bd74c6-b88a-404d-ad9c-5a1bc70da31c',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-21T21:00:00.000-08:00'),
			title: 'Deliberate practice',
			description:
				'The only way to get better at a thing is to keep doing the thing.',
			youtube_id: 'SYcY0MtGaoc',
			slug: 'deliberate-practice',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1711522522/lwj/series/mar-21-deliberate-practice.jpg',
		},
		{
			id: '8fcdd8a5-c3a8-4714-91c7-4c048c07b6db',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-20T21:00:00.000-08:00'),
			title: "If you go looking for it, you'll find it",
			description: 'A little thought that changed my whole outlook on life.',
			youtube_id: 'ug7KKn_M1qQ',
			slug: 'if-you-go-looking-for-it-youll-find-it',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522528/lwj/series/mar-20-if-you-go-looking-for-it.jpg',
		},
		{
			id: 'e30a68aa-eedb-424e-8ece-1a0b5ae944c0',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-19T21:00:00.000-08:00'),
			title: 'Cruel universe',
			description:
				"If you've ever felt like the universe is out to get you, watch this.",
			youtube_id: '4qqqW6oKGQk',
			slug: 'cruel-universe',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522524/lwj/series/mar-19-cruel-universe.jpg',
		},
		{
			id: '01d02352-0e1a-4912-aef1-60ed3a41e152',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-18T21:00:00.000-08:00'),
			title: 'The good parts',
			description: 'Why is it harder to share the good parts?',
			youtube_id: 'g53WUWvhi_Y',
			slug: 'good-parts',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522525/lwj/series/mar-18-the-good-parts.jpg',
		},
		{
			id: '6439c27b-f433-4e3c-994f-4a18fe4063cd',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-15T21:00:00.000-08:00'),
			title: 'Quiet days',
			description: 'Not every day needs to be a big day.',
			youtube_id: 'Jt99p1Y_JSM',
			slug: 'quiet-days',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522523/lwj/series/mar-15-quiet-days.jpg',
		},
		{
			id: 'e55518de-04f9-4c0d-b352-8b4ff1041d0d',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-14T21:00:00.000-08:00'),
			title: 'Isolation',
			description:
				"Indie life can make you feel isolated. Despite that, I'm doing my best to keep human connections strong in my life.",
			youtube_id: 'ZXOZQzApDG4',
			slug: 'isolation',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522524/lwj/series/mar-14-connections.jpg',
		},
		{
			id: 'e16b1907-7fb3-4dbe-a4bf-b720e5c23861',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-13T21:00:00.000-08:00'),
			title: 'Insecurity',
			description:
				"It might not seem like it, but I have a ton of insecurities. I don't know that I like them, but I try to put them to work.",
			youtube_id: 'zzxsvPAxWDg',
			slug: 'insecurity',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522526/lwj/series/mar-13-insecure.jpg',
		},
		{
			id: 'ca0f39dd-1dfb-4f43-a2b9-09e34d25b527',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-12T21:00:00.000-08:00'),
			title: 'Don\'t "follow your passion"',
			description:
				'I don\'t love the phrase "follow your passion". Here\'s why.',
			youtube_id: 'tuVMCQO6QEk',
			slug: 'dont-follow-your-passion',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522527/lwj/series/mar-12-not-passion.jpg',
		},
		{
			id: 'b42c4cdf-8e95-4e5d-9b2b-0d3343360688',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-11T21:00:00.000-08:00'),
			title: "Why my ideas don't get made",
			description:
				'I\'ve been waiting until I have enough time to make videos just for me. But there\'ll never be a "good time" — there\'s just "now" or "later". So... let\'s do it now.',
			youtube_id: 'cL_P3HQOQ8w',
			slug: 'why-my-ideas-dont-get-made',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522588/lwj/series/mar-11-make-time.jpg',
		},
		{
			id: '70048c26-37ab-497f-aeeb-cef60bbddb79',
			collection: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			publish_date: new Date('2024-03-22T21:00:00.000-08:00'),
			title: 'Astro DB',
			description: 'Fred teaches Astro',
			youtube_id: 'qquVJ81APEs',
			slug: 'astro-db',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474843/lwj/series/mar-22-no-ragrets.jpg',
		},
	]);

	await db.insert(User).values([
		{
			id: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			username: 'jlengstorf',
			display_name: 'Jason Lengstorf',
			bio: 'Trying his very best.',
		},
	]);

	await db.insert(UserEpisode).values([
		{
			user: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			episode: 'd64a3d40-960c-430e-9d46-5bcbb6d91cbe',
		},
		{
			user: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			episode: '63e9ba7c-4740-49e7-9007-fa8fe675b279',
		},
	]);
}
