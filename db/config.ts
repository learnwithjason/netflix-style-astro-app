import { column, defineDb, defineTable, NOW } from 'astro:db';

const Resource = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		type: column.text(),
		createdById: column.text({ references: () => User.columns.id }),
		fields: column.json(),
		createdAt: column.date({ default: NOW }),
		updatedAt: column.date({ default: NOW }),
		deletedAt: column.date({ optional: true }),
		resources: column.json({
			default: [],
		}),
	},
});

const ResourceRelationships = defineTable({
	columns: {
		childId: column.text({ references: () => Resource.columns.id }),
		parentId: column.text({ references: () => Resource.columns.id }),
		position: column.number({ default: 0 }),
		metadata: column.json({ default: {} }),
		createdAt: column.date({ default: NOW }),
		updatedAt: column.date({ default: NOW }),
		deletedAt: column.date({ optional: true }),
	},
});

const User = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		username: column.text({ unique: true }),
		display_name: column.text({}),
		bio: column.text({ multiline: true }),
		avatar_url: column.text({ optional: true }),
		twitter_url: column.text({ optional: true }),
		instagram_url: column.text({ optional: true }),
		youtube_url: column.text({ optional: true }),
		linkedin_url: column.text({ optional: true }),
		github_url: column.text({ optional: true }),
		website_url: column.text({ optional: true }),
	},
});

const UserResource = defineTable({
	columns: {
		resourceId: column.text({ references: () => Resource.columns.id }),
		userId: column.text({ references: () => User.columns.id }),
	},
});

export default defineDb({
	tables: {
		Resource,
		ResourceRelationships,
		User,
		UserResource,
	},
});
