import {
	db,
	sql,
	Resource,
	ResourceRelationships,
	eq,
	alias,
	UserResource,
	User,
} from 'astro:db';
import {
	Collection,
	Series,
	CollectionApiResult,
	EpisodeApiResult,
	SeriesApiResult,
	SeriesList,
} from './schema';

// async function getResources(type: 'series' | 'collection') {
// 	const result = await db.run(sql`
//     SELECT
//       r.id,
//       r.type,
//       r.fields,
//       r.createdAt,
//       r.updatedAt,
//       r.deletedAt,
//       r.createdById,

//       -- return child resources as a JSON array
//       -- TODO figure out how to sort this without double-escaping the JSON
//       CASE
//         WHEN child.id IS NOT NULL
//           THEN JSON_GROUP_ARRAY(
//               JSON_OBJECT(
//                 'id', child.id,
//                 'type', child.type,
//                 'fields', JSON(child.fields),
//                 'position', children.position
//               )
//             )
//         ELSE JSON('[]')
//       END AS resources,

//       -- if a parent resource exists, return it as a JSON object (null otherwise)
//       CASE
//         WHEN parent.id IS NOT null
//           THEN JSON_OBJECT(
//             'id', parent.id,
//             'type', parent.type,
//             'fields', JSON(parent.fields)
//           )
//         ELSE null
//       END AS parent

//     FROM "Resource" AS r

//     -- get any child resources
//     LEFT JOIN "ResourceRelationships" AS children
//       ON r.id = children.parentId
//       LEFT JOIN "Resource" AS child
//         ON children.childId = child.id

//     -- get the parent resource, if one is set
//     LEFT JOIN "ResourceRelationships" AS parents
//       ON r.id = parents.childId
//       LEFT JOIN "Resource" AS parent
//         ON parents.parentId = parent.id

//     WHERE r.type = ${type}
//     GROUP BY r.id;
//   `);

// 	const data = result.rows;

// 	return data.map((resource) => {
// 		resource.fields = JSON.parse(resource.fields as string);
// 		resource.parent = JSON.parse(resource.parent as string);
// 		resource.resources = JSON.parse(resource.resources as string).sort(
// 			// manual sort with JS because I can't figure out the SQL ORDER BY
// 			(a: any, b: any) => a.position - b.position,
// 		);

// 		// console.log(JSON.stringify(resource, null, 2));

// 		return resource;
// 	});
// }

// export async function getPeople(episodeId: string) {
// 	const result = await db
// 		.select({
// 			id: User.id,
// 			username: User.username,
// 			display_name: User.display_name,
// 			bio: User.bio,
// 			avatar_url: User.avatar_url,
// 			twitter_url: User.twitter_url,
// 			instagram_url: User.instagram_url,
// 			youtube_url: User.youtube_url,
// 			linkedin_url: User.linkedin_url,
// 			github_url: User.github_url,
// 			website_url: User.website_url,
// 		})
// 		.from(UserResource)
// 		.leftJoin(User, eq(UserResource.userId, User.id))
// 		.where(eq(UserResource.resourceId, episodeId));

// 	return result;
// }

// export async function getSeries() {
// 	const resources = await getResources('series');

// 	return resources.map((resource) => {
// 		const series = Series.parse(resource);

// 		if (series.parent) {
// 			throw new Error(`${series.fields.title} cannot have a parent`);
// 		}

// 		return series;
// 	});
// }

// export async function getCollections() {
// 	const resources = await getResources('collection');

// 	return resources.map((resource) => {
// 		const collection = Collection.parse(resource);

// 		if (!collection.parent || !collection.parent.fields) {
// 			throw new Error(
// 				`Collection ${collection.fields.name} is not connected to a series`,
// 			);
// 		}

// 		return collection;
// 	});
// }

// -----------------------------------------------------------------------------

const series = alias(Resource, 'series');
const collection = alias(Resource, 'collection');
const episode = alias(Resource, 'episode');
const connections = alias(ResourceRelationships, 'connections');
const parents = alias(ResourceRelationships, 'parents');

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
		collections: data.collections.sort((a, b) => a.position - b.position),
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
		.where(
			sql`
				${episode.type} = 'episode' 
				AND ${series.fields}->>'slug' = ${seriesSlug}
				AND ${collection.fields}->>'slug' = ${collectionSlug}
				AND ${episode.fields}->>'slug' = ${episodeSlug}
			`,
		);

	return EpisodeApiResult.parse(result.at(0));
}
