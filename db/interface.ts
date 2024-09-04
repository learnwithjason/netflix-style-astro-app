import { randomUUID } from 'node:crypto';
import {
	db,
	sql,
	Resource,
	ResourceRelationships,
	User,
	UserResource,
	eq,
	alias,
	asc,
} from 'astro:db';
import {
	CollectionApiResult,
	CollectionFields,
	EpisodeFields,
	EpisodeApiResult,
	SeriesApiResult,
	SeriesList,
	UserList,
} from './schema';

const series = alias(Resource, 'series');
const collection = alias(Resource, 'collection');
const episode = alias(Resource, 'episode');
const connections = alias(ResourceRelationships, 'connections');
const parents = alias(ResourceRelationships, 'parents');
const users = alias(UserResource, 'users');
const user = alias(User, 'user');

export async function selectSeries() {
	const result = await db
		.select({
			id: series.id,
			type: series.type,
			fields: series.fields,
			createdById: series.createdById,
			createdAt: series.createdAt,
			updatedAt: series.updatedAt,
			deletedAt: series.deletedAt,
			collections: sql`JSON_GROUP_ARRAY(JSON_OBJECT(
				'id', ${collection.id},
				'position', ${connections.position},
				'fields', JSON(${collection.fields})
			))`,
		})
		.from(series)
		.leftJoin(connections, eq(connections.parentId, series.id))
		.leftJoin(collection, eq(connections.childId, collection.id))
		.where(eq(series.type, 'series'))
		.groupBy(series.id);

	const data = SeriesList.parse(
		result.map((r: any) => ({
			...r,
			collections: JSON.parse(r.collections),
		})),
	);

	return data.map((s) => ({
		...s,
		collections: s.collections.sort((a, b) => a.position - b.position),
	}));
}

export async function selectSeriesBySlug(slug: string) {
	const result = await db
		.select({
			id: series.id,
			type: series.type,
			createdById: series.createdById,
			fields: series.fields,
			createdAt: series.createdAt,
			updatedAt: series.updatedAt,
			deletedAt: series.deletedAt,
			collections: sql`JSON_GROUP_ARRAY(JSON_OBJECT(
				'id', ${collection.id},
				'position', ${connections.position},
				'fields', JSON(${collection.fields})
			))`,
		})
		.from(series)
		.leftJoin(connections, eq(connections.parentId, series.id))
		.leftJoin(collection, eq(connections.childId, collection.id))
		.where(
			sql`${series.type} = 'series' AND ${series.fields}->>'slug' = ${slug}`,
		)
		.groupBy(series.id);

	const data = SeriesApiResult.parse(
		result
			.map((r: any) => ({
				...r,
				collections: JSON.parse(r.collections),
			}))
			.at(0),
	);

	return {
		...data,
		collections: data.collections.sort(
			(a, b) =>
				a.fields.release_year.valueOf() - b.fields.release_year.valueOf(),
		),
	};
}

export async function selectCollectionBySlug(
	seriesSlug: string,
	collectionSlug: string,
) {
	const result = await db
		.select({
			id: collection.id,
			type: collection.type,
			createdById: collection.createdById,
			fields: collection.fields,
			createdAt: collection.createdAt,
			updatedAt: collection.updatedAt,
			deletedAt: collection.deletedAt,
			series,
			episodes: sql`JSON_GROUP_ARRAY(JSON_OBJECT(
				'id', ${episode.id},
				'position', ${connections.position},
				'fields', JSON(${episode.fields})
			))`,
		})
		.from(collection)
		.leftJoin(connections, eq(collection.id, connections.parentId))
		.leftJoin(parents, eq(collection.id, parents.childId))
		.leftJoin(series, eq(parents.parentId, series.id))
		.leftJoin(episode, eq(connections.childId, episode.id))
		.where(
			sql`
				${collection.type} = 'collection' 
				AND ${series.fields}->>'slug' = ${seriesSlug}
				AND ${collection.fields}->>'slug' = ${collectionSlug}
			`,
		)
		.groupBy(collection.id);

	const data = CollectionApiResult.parse(
		result
			.map((r: any) => ({
				...r,
				episodes: JSON.parse(r.episodes),
			}))
			.at(0),
	);

	return {
		...data,
		episodes: data.episodes.sort((a, b) => a.position - b.position),
	};
}

export async function selectEpisodeBySlug(
	seriesSlug: string,
	collectionSlug: string,
	episodeSlug: string,
) {
	const result = await db
		.select({
			id: episode.id,
			type: episode.type,
			position: connections.position,
			createdById: episode.createdById,
			fields: episode.fields,
			createdAt: episode.createdAt,
			updatedAt: episode.updatedAt,
			deletedAt: episode.deletedAt,
			collection,
			series,
		})
		.from(episode)
		.leftJoin(connections, eq(connections.childId, episode.id))
		.leftJoin(collection, eq(connections.parentId, collection.id))
		.leftJoin(parents, eq(parents.childId, collection.id))
		.leftJoin(series, eq(parents.parentId, series.id))
		.leftJoin(users, eq(episode.id, users.resourceId))
		.leftJoin(user, eq(users.userId, user.id))
		.where(
			sql`
				${episode.type} = 'episode' 
				AND ${series.fields}->>'slug' = ${seriesSlug}
				AND ${collection.fields}->>'slug' = ${collectionSlug}
				AND ${episode.fields}->>'slug' = ${episodeSlug}
			`,
		)
		.groupBy(episode.id);

	return EpisodeApiResult.parse(result.at(0));
}

export async function getRelatedUsers(episodeId: string) {
	const result = await db
		.select({
			id: user.id,
			username: user.username,
			display_name: user.display_name,
			bio: user.bio,
			avatar_url: user.avatar_url,
			twitter_url: user.twitter_url,
			instagram_url: user.instagram_url,
			youtube_url: user.youtube_url,
			linkedin_url: user.linkedin_url,
			github_url: user.github_url,
			website_url: user.website_url,
		})
		.from(users)
		.where(eq(users.resourceId, episodeId))
		.leftJoin(user, eq(users.userId, user.id));

	return UserList.parse(result);
}

export async function createResourceRelationship({
	childId,
	parentId,
}: {
	childId: string;
	parentId: string;
}) {
	console.log({ childId, parentId });

	const res = await db.insert(ResourceRelationships).values({
		parentId,
		childId,
	});

	return res;
}

export async function createCollection(collectionData: CollectionFields) {
	const data = CollectionFields.parse(collectionData);
	const id = randomUUID();

	await db.insert(Resource).values({
		id,
		createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7', // get from user auth object
		fields: data,
		type: 'collection',
	});

	return id;
}

export async function createEpisode(episodeData: EpisodeFields) {
	const data = EpisodeFields.parse(episodeData);
	const id = randomUUID();

	await db.insert(Resource).values({
		id,
		createdById: 'eb6f8307-9b99-4d11-9257-07a8318e01c7', // TODO: get from user auth object
		fields: data,
		type: 'episode',
	});

	return id;
}
