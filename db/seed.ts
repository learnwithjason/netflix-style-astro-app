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
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474384/lwj/series/doitanyways-banner.jpg',
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
			year: new Date('2024-01-01T00:00:00.000-07:00'),
			name: 'Season 1',
			slug: 's1',
		},
		{
			id: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			series: '21cb46ea-b7de-426a-83ee-43ac0a64d776',
			year: new Date('2024-01-01T00:00:00.000-07:00'),
			name: '2024',
			slug: '2024',
		},
	]);

	await db.insert(Episode).values([
		{
			id: 'd64a3d40-960c-430e-9d46-5bcbb6d91cbe',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-25T21:00:00.000-07:00'),
			title: 'Smoothies',
			description:
				"Not every project is a whole meal. Sometimes it's just a smoothie.",
			youtube_id: '8stdjkmewew',
			slug: 'smoothies',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474595/lwj/series/mar-25-smoothies.jpg',
		},
		{
			id: '63e9ba7c-4740-49e7-9007-fa8fe675b279',
			collection: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			publish_date: new Date('2024-03-22T21:00:00.000-07:00'),
			title: 'No ragrets',
			description:
				'My whole life philosophy sounds ridiculous when I say it out loud.',
			youtube_id: 'kzBPZ-ZACm4',
			slug: 'no-ragrets',
			thumbnail:
				'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474843/lwj/series/mar-22-no-ragrets.jpg',
		},
		{
			id: '70048c26-37ab-497f-aeeb-cef60bbddb79',
			collection: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			publish_date: new Date('2024-03-22T21:00:00.000-07:00'),
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
