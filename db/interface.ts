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
import { Collection, Series } from './schema';

async function getResources(type: 'series' | 'collection') {
	const result = await db.run(sql`
    SELECT
      r.id,
      r.type,
      r.fields,
      r.createdAt,
      r.updatedAt,
      r.deletedAt,
      r.createdById,

      -- return child resources as a JSON array
      -- TODO figure out how to sort this without double-escaping the JSON
      CASE 
        WHEN child.id IS NOT NULL
          THEN JSON_GROUP_ARRAY(
              JSON_OBJECT(
                'id', child.id,
                'type', child.type,
                'fields', JSON(child.fields),
                'position', children.position
              )
            )
        ELSE JSON('[]')
      END AS resources,

      -- if a parent resource exists, return it as a JSON object (null otherwise)
      CASE 
        WHEN parent.id IS NOT null
          THEN JSON_OBJECT(
            'id', parent.id,
            'type', parent.type,
            'fields', JSON(parent.fields)
          )
        ELSE null
      END AS parent

    FROM "Resource" AS r

    -- get any child resources
    LEFT JOIN "ResourceRelationships" AS children
      ON r.id = children.parentId
      LEFT JOIN "Resource" AS child
        ON children.childId = child.id

    -- get the parent resource, if one is set
    LEFT JOIN "ResourceRelationships" AS parents
      ON r.id = parents.childId
      LEFT JOIN "Resource" AS parent
        ON parents.parentId = parent.id
        
    WHERE r.type = ${type}
    GROUP BY r.id;
  `);

	const data = result.rows;

	return data.map((resource) => {
		resource.fields = JSON.parse(resource.fields as string);
		resource.parent = JSON.parse(resource.parent as string);
		resource.resources = JSON.parse(resource.resources as string).sort(
			// manual sort with JS because I can't figure out the SQL ORDER BY
			(a: any, b: any) => a.position - b.position,
		);

		// console.log(JSON.stringify(resource, null, 2));

		return resource;
	});
}

export async function getPeople(episodeId: string) {
	const result = await db
		.select({
			id: User.id,
			username: User.username,
			display_name: User.display_name,
			bio: User.bio,
			avatar_url: User.avatar_url,
			twitter_url: User.twitter_url,
			instagram_url: User.instagram_url,
			youtube_url: User.youtube_url,
			linkedin_url: User.linkedin_url,
			github_url: User.github_url,
			website_url: User.website_url,
		})
		.from(UserResource)
		.leftJoin(User, eq(UserResource.userId, User.id))
		.where(eq(UserResource.resourceId, episodeId));

	return result;
}

export async function getSeries() {
	const resources = await getResources('series');

	return resources.map((resource) => {
		const series = Series.parse(resource);

		if (series.parent) {
			throw new Error(`${series.fields.title} cannot have a parent`);
		}

		return series;
	});
}

export async function getCollections() {
	const resources = await getResources('collection');

	return resources.map((resource) => {
		const collection = Collection.parse(resource);

		if (!collection.parent || !collection.parent.fields) {
			throw new Error(
				`Collection ${collection.fields.name} is not connected to a series`,
			);
		}

		return collection;
	});
}

export async function selectTest() {
	const children = alias(Resource, 'children');
	const data = await db
		.select({
			resource: Resource,
			children: children,
		})
		.from(Resource)
		.leftJoin(
			ResourceRelationships,
			eq(ResourceRelationships.parentId, Resource.id),
		)
		.leftJoin(children, eq(ResourceRelationships.childId, children.id))
		.leftJoin(UserResource, eq(children.id, UserResource.resourceId))
		.where(eq(Resource.type, 'collection'))
		.all();

	const result = data.reduce<
		Record<
			string,
			{
				resource: typeof Resource.$inferSelect;
				children: Array<typeof Resource.$inferSelect>;
			}
		>
	>((acc, row) => {
		const resource = row.resource;
		const child = row.children;

		if (!acc[resource.id]) {
			acc[resource.id] = { resource, children: [] };
		}

		if (child) {
			acc[resource.id].children.push(child);
		}

		return acc;
	}, {});

	return result;
}
