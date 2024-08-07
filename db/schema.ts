import { z } from 'zod';

const Resource = z.object({
	id: z.string(),
	type: z.union(
		[z.literal('series'), z.literal('collection'), z.literal('episode')],
		{ message: 'bad type' },
	),
	createdById: z.string({ message: 'bad createdById' }),
	fields: z.object({}, { message: 'bad fields' }),
	createdAt: z.coerce
		.date({ message: 'bad createdAt' })
		.default(new Date())
		.optional(),
	updatedAt: z.coerce
		.date({ message: 'bad updatedAt' })
		.default(new Date())
		.optional(),
	deletedAt: z.coerce.date({ message: 'bad deletedAt' }).optional(),
});

const slug = z
	.string({ message: 'bad slug' })
	.refine((val) => !!val.match(/^[\w-]+$/), {
		message:
			'slugs can only contain alphanumeric characters, underscores (_), and hyphens (-)',
	});

export const SeriesFields = z.object(
	{
		slug,
		title: z.string({ message: 'bad title' }),
		description: z.string({ message: 'bad description' }),
		banner_image: z.string({ message: 'bad banner_image' }).url(),
	},
	{ message: 'bad series fields' },
);

export const Series = Resource.extend({
	type: z.literal('series', { message: 'bad type' }),
	fields: SeriesFields,
	parent: z.null().optional(),
});

export const CollectionFields = z.object(
	{
		slug,
		name: z.string({ message: 'bad name' }),
		release_year: z.coerce.date({ message: 'bad release_year' }),
	},
	{ message: 'bad collection fields' },
);

export const EpisodeFields = z.object(
	{
		slug,
		title: z.string({ message: 'bad title' }),
		description: z.string({ message: 'bad description' }),
		resources: z.array(
			z.object({
				label: z.string({ message: 'bad label' }),
				url: z.string({ message: 'bad url' }).url(),
			}),
			{ message: 'bad resources' },
		),
		thumbnail: z.string({ message: 'bad thumbnail' }).url(),
		youtube_id: z.string({ message: 'bad youtube_id' }).optional(),
		playback_id: z
			.string({
				description:
					'a Mux playback ID. if supplied, this is prioritized over the YouTube ID',
				message: 'bad playback_id',
			})
			.optional(),
		publish_date: z.coerce.date({ message: 'bad publish_date' }),
	},
	{ message: 'bad episode fields' },
);

export const Episode = Resource.extend({
	type: z.literal('episode', { message: 'bad type' }),
	fields: EpisodeFields,
	parent: CollectionFields.partial().optional(),
});

export const Collection = Resource.extend({
	type: z.literal('collection', { message: 'bad type' }),
	fields: CollectionFields,
	parent: Series.partial().optional(),
});

export const SeriesList = z.array(
	Series.extend({
		collections: z.array(
			Collection.partial({
				createdById: true,
				createdAt: true,
				deletedAt: true,
				updatedAt: true,
				parent: true,
				type: true,
			}).extend({ position: z.number() }),
		),
	}),
);

export const SeriesApiResult = Series.extend({
	collections: z.array(
		Collection.partial({
			createdById: true,
			createdAt: true,
			deletedAt: true,
			updatedAt: true,
			parent: true,
			type: true,
		}).extend({ position: z.number() }),
	),
});

export const CollectionApiResult = Collection.extend({
	series: Series.omit({
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		createdById: true,
		type: true,
		parent: true,
	}),
	episodes: z.array(
		Episode.extend({ position: z.number() }).omit({
			createdById: true,
			createdAt: true,
			deletedAt: true,
			updatedAt: true,
			parent: true,
			type: true,
		}),
	),
});

export const EpisodeApiResult = Episode.extend({
	position: z.number(),
	series: Series.omit({
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		createdById: true,
		type: true,
		parent: true,
	}),
	collection: Collection.omit({
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
		createdById: true,
		type: true,
		parent: true,
	}),
});
