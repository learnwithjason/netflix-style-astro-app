import type { APIRoute } from 'astro';
import { db, sql, eq, Resource, ResourceRelationships, alias } from 'astro:db';

export const GET: APIRoute = async ({ params }) => {
	const { path } = params;
	const [_seriesSlug, collectionSlug] = (path?.split('/') ?? '') as string[];

	// TODO handle series only

	const collection = alias(Resource, 'collection');
	const resources = alias(ResourceRelationships, 'resources');
	const series = alias(Resource, 'series');
	const episode = alias(Resource, 'episode');
	const result = await db
		.select({
			collection,
			series,
			episodes: sql`JSON_GROUP_ARRAY(JSON_OBJECT(
				'id', ${episode.id},
				'position', ${resources.position},
				'fields', JSON(${episode.fields})
			))`,
		})
		.from(collection)
		.leftJoin(resources, eq(collection.id, resources.parentId))
		.leftJoin(series, eq(resources.childId, series.id))
		.leftJoin(episode, eq(resources.childId, episode.id))
		.where(
			sql`${collection.type} = 'collection' AND ${collection.fields}->>'slug' = ${collectionSlug}`,
		)
		.groupBy(collection.id);

	if (!result) {
		return new Response(null, {
			status: 404,
			statusText: 'Not found',
		});
	}

	const cleaned = result.map((r: any) => ({
		...r,
		episodes: JSON.parse(r.episodes).sort((a, b) => a.position - b.position),
	}));

	return new Response(JSON.stringify(cleaned.at(0)), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
