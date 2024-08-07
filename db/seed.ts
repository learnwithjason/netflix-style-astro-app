import { z } from 'zod';
import {
	User,
	ResourceRelationships,
	Resource,
	db,
	UserResource,
} from 'astro:db';
import {
	Collection as CollectionSchema,
	Series as SeriesSchema,
	Episode as EpisodeSchema,
} from './schema';

// https://astro.build/db/seed
export default async function seed() {
	const episodes: Array<z.infer<typeof EpisodeSchema>> = [
		{
			id: 'd5989bab-47bb-42ed-b2da-0e718fc42a62',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-27T21:00:00.000-08:00'),
				title: 'Collaboration',
				description:
					"It's fun to make stuff. It's better to make stuff with friends.",
				youtube_id: 'e8ZgF8_HmAA',
				playback_id: 'X3bY68s1o8Xr8KisYvZi4PfPIbjv14phkPd00NOyJokY',
				slug: 'collaboration',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474595/lwj/series/mar-27-collaboration.jpg',
				resources: [],
			},
		},
		{
			id: 'd64a3d40-960c-430e-9d46-5bcbb6d91cbe',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-25T21:00:00.000-08:00'),
				title: 'Smoothies',
				description:
					"Not every project is a whole meal. Sometimes it's just a smoothie.",
				youtube_id: '8stdjkmewew',
				playback_id: 'osBfvJZ3aAxOlnCUZkx411xeVHEilgfk9qlkQ2aPiow',
				slug: 'smoothies',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474595/lwj/series/mar-25-smoothies.jpg',
				resources: [],
			},
		},
		{
			id: '63e9ba7c-4740-49e7-9007-fa8fe675b279',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-22T21:00:00.000-08:00'),
				title: 'No ragrets',
				description:
					'My whole life philosophy sounds ridiculous when I say it out loud.',
				youtube_id: 'kzBPZ-ZACm4',
				playback_id: 'S01pAoT7ggySqrmIuzSee5f2ttqC5dzXmdGQYGEuMDTY',
				slug: 'no-ragrets',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474843/lwj/series/mar-22-no-ragrets.jpg',
				resources: [],
			},
		},
		{
			id: '36bd74c6-b88a-404d-ad9c-5a1bc70da31c',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-21T21:00:00.000-08:00'),
				title: 'Deliberate practice',
				description:
					'The only way to get better at a thing is to keep doing the thing.',
				youtube_id: 'SYcY0MtGaoc',
				slug: 'deliberate-practice',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1711522522/lwj/series/mar-21-deliberate-practice.jpg',
				resources: [],
			},
		},
		{
			id: '8fcdd8a5-c3a8-4714-91c7-4c048c07b6db',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-20T21:00:00.000-08:00'),
				title: "If you go looking for it, you'll find it",
				description: 'A little thought that changed my whole outlook on life.',
				youtube_id: 'ug7KKn_M1qQ',
				slug: 'if-you-go-looking-for-it-youll-find-it',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522528/lwj/series/mar-20-if-you-go-looking-for-it.jpg',
				resources: [],
			},
		},
		{
			id: 'e30a68aa-eedb-424e-8ece-1a0b5ae944c0',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-19T21:00:00.000-08:00'),
				title: 'Cruel universe',
				description:
					"If you've ever felt like the universe is out to get you, watch this.",
				youtube_id: '4qqqW6oKGQk',
				slug: 'cruel-universe',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522524/lwj/series/mar-19-cruel-universe.jpg',
				resources: [],
			},
		},
		{
			id: '01d02352-0e1a-4912-aef1-60ed3a41e152',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-18T21:00:00.000-08:00'),
				title: 'The good parts',
				description: 'Why is it harder to share the good parts?',
				youtube_id: 'g53WUWvhi_Y',
				slug: 'good-parts',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522525/lwj/series/mar-18-the-good-parts.jpg',
				resources: [],
			},
		},
		{
			id: '6439c27b-f433-4e3c-994f-4a18fe4063cd',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-15T21:00:00.000-08:00'),
				title: 'Quiet days',
				description: 'Not every day needs to be a big day.',
				youtube_id: 'Jt99p1Y_JSM',
				slug: 'quiet-days',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522523/lwj/series/mar-15-quiet-days.jpg',
				resources: [],
			},
		},
		{
			id: 'e55518de-04f9-4c0d-b352-8b4ff1041d0d',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-14T21:00:00.000-08:00'),
				title: 'Isolation',
				description:
					"Indie life can make you feel isolated. Despite that, I'm doing my best to keep human connections strong in my life.",
				youtube_id: 'ZXOZQzApDG4',
				slug: 'isolation',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522524/lwj/series/mar-14-connections.jpg',
				resources: [],
			},
		},
		{
			id: 'e16b1907-7fb3-4dbe-a4bf-b720e5c23861',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-13T21:00:00.000-08:00'),
				title: 'Insecurity',
				description:
					"It might not seem like it, but I have a ton of insecurities. I don't know that I like them, but I try to put them to work.",
				youtube_id: 'zzxsvPAxWDg',
				slug: 'insecurity',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522526/lwj/series/mar-13-insecure.jpg',
				resources: [],
			},
		},
		{
			id: 'ca0f39dd-1dfb-4f43-a2b9-09e34d25b527',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-12T21:00:00.000-08:00'),
				title: 'Don\'t "follow your passion"',
				description:
					'I don\'t love the phrase "follow your passion". Here\'s why.',
				youtube_id: 'tuVMCQO6QEk',
				slug: 'dont-follow-your-passion',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522527/lwj/series/mar-12-not-passion.jpg',
				resources: [],
			},
		},
		{
			id: 'b42c4cdf-8e95-4e5d-9b2b-0d3343360688',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-11T21:00:00.000-08:00'),
				title: "Why my ideas don't get made",
				description:
					'I\'ve been waiting until I have enough time to make videos just for me. But there\'ll never be a "good time" — there\'s just "now" or "later". So... let\'s do it now.',
				youtube_id: 'cL_P3HQOQ8w',
				slug: 'why-my-ideas-dont-get-made',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711522588/lwj/series/mar-11-make-time.jpg',
				resources: [],
			},
		},
		{
			id: '70048c26-37ab-497f-aeeb-cef60bbddb79',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'episode',
			fields: {
				publish_date: new Date('2024-03-22T21:00:00.000-08:00'),
				title: 'Astro DB',
				description: 'Fred teaches Astro',
				youtube_id: 'qquVJ81APEs',
				slug: 'astro-db',
				thumbnail:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474843/lwj/series/mar-22-no-ragrets.jpg',
				resources: [],
			},
		},
	];

	const collections: Array<z.infer<typeof CollectionSchema>> = [
		{
			id: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'collection',
			fields: {
				release_year: new Date('2024-01-01T00:00:00.000-08:00'),
				name: 'Season 1',
				slug: 's1',
			},
		},
		{
			id: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'collection',
			fields: {
				release_year: new Date('2024-01-01T00:00:00.000-08:00'),
				name: '2024',
				slug: '2024',
			},
		},
	];

	const series: Array<z.infer<typeof SeriesSchema>> = [
		{
			id: '177c600c-47bd-4592-8f34-6e4fe8c21821',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'series',
			fields: {
				title: '#DoItAnyways',
				slug: 'doitanyways',
				description:
					"I'm challenging myself to make a video every weekday for at least two weeks to help me get over my perfectionism and just start making stuff.",
				banner_image:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1720411221/lwj/v2/series-do-it-anyways-cover.jpg',
			},
		},
		{
			id: '21cb46ea-b7de-426a-83ee-43ac0a64d776',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'series',
			fields: {
				title: 'Learn With Jason',
				slug: 'learn-with-jason',
				description: 'Learn something new in 90 minutes.',
				banner_image:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1711474384/lwj/series/lwj-banner.jpg',
			},
		},
		{
			id: '295fe650-6927-4d12-83ac-139b7701fc5b',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'series',
			fields: {
				title: 'Web Dev Challenge',
				slug: 'web-dev-challenge',
				description:
					'What could you create if you had 30 minutes to plan and 4 hours to build?',
				banner_image:
					'https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1719209813/wdc/web-dev-challenge-ai-app-not-another-chatbot-v5.jpg',
			},
		},
		{
			id: 'e19012fd-588f-47e7-83dd-ca2fa5e127b9',
			createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			type: 'series',
			fields: {
				title: 'Web Lunch',
				slug: 'web-lunch',
				description:
					'Conversations about building a resilient, successful, happy career in tech — shared over a meal.',
				banner_image:
					'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1720490994/web-lunch/web-lunch-salma-v2.jpg',
			},
		},
	];

	await db.insert(User).values([
		{
			id: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
			username: 'jlengstorf',
			display_name: 'Jason Lengstorf',
			bio: 'Trying his very best.',
		},
	]);

	await db.insert(Resource).values([...episodes, ...collections, ...series]);

	await db.insert(ResourceRelationships).values([
		{
			parentId: '177c600c-47bd-4592-8f34-6e4fe8c21821',
			childId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
		},

		// TODO this is WDC temp using another collection
		{
			parentId: '295fe650-6927-4d12-83ac-139b7701fc5b',
			childId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
		},

		// TODO this is Web Lunch temp using another collection
		{
			parentId: 'e19012fd-588f-47e7-83dd-ca2fa5e127b9',
			childId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
		},
		{
			parentId: '21cb46ea-b7de-426a-83ee-43ac0a64d776',
			childId: '51dfd049-66f5-4090-917d-f8ca93fb7225',
		},
		{
			parentId: '51dfd049-66f5-4090-917d-f8ca93fb7225',
			childId: '70048c26-37ab-497f-aeeb-cef60bbddb79',
			position: 0,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'b42c4cdf-8e95-4e5d-9b2b-0d3343360688',
			position: 0,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'ca0f39dd-1dfb-4f43-a2b9-09e34d25b527',
			position: 1,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'e16b1907-7fb3-4dbe-a4bf-b720e5c23861',
			position: 2,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'e55518de-04f9-4c0d-b352-8b4ff1041d0d',
			position: 3,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: '6439c27b-f433-4e3c-994f-4a18fe4063cd',
			position: 4,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: '01d02352-0e1a-4912-aef1-60ed3a41e152',
			position: 5,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'e30a68aa-eedb-424e-8ece-1a0b5ae944c0',
			position: 6,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: '8fcdd8a5-c3a8-4714-91c7-4c048c07b6db',
			position: 7,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: '36bd74c6-b88a-404d-ad9c-5a1bc70da31c',
			position: 8,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: '63e9ba7c-4740-49e7-9007-fa8fe675b279',
			position: 9,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'd64a3d40-960c-430e-9d46-5bcbb6d91cbe',
			position: 10,
		},
		{
			parentId: '27d86fbe-e27d-4fe5-a4ec-a6134495809b',
			childId: 'd5989bab-47bb-42ed-b2da-0e718fc42a62',
			position: 11,
		},
	]);

	await db.insert(UserResource).values([
		{
			resourceId: 'e30a68aa-eedb-424e-8ece-1a0b5ae944c0',
			userId: 'eb6f8307-9b99-4d11-9257-07a8318e01c7',
		},
	]);
}
