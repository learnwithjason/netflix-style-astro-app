import { column, defineDb, defineTable } from 'astro:db';

const Series = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		title: column.text(),
		description: column.text({ multiline: true }),
		slug: column.text({ unique: true }),
		banner_image: column.text(),
	},
});

const Collection = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		series: column.text({ references: () => Series.columns.id }),
		year: column.date(),
		name: column.text(),
		slug: column.text(),
		// collection name
		// TODO do we need description, hosts, etc.?
	},
});

const Episode = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		collection: column.text({ references: () => Collection.columns.id }),
		publish_date: column.date(),
		title: column.text(),
		description: column.text({ multiline: true }),
		resources: column.json({ optional: true }),
		slug: column.text({ unique: true }),
		thumbnail: column.text(),
		youtube_id: column.text({ optional: true }),
		media_url: column.text({ optional: true }),
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

const UserEpisode = defineTable({
	columns: {
		user: column.text({ references: () => User.columns.id }),
		episode: column.text({ references: () => Episode.columns.id }),
	},
});

const Sponsor = defineTable({
	columns: {
		id: column.text({ primaryKey: true }),
		name: column.text({}),
		link_url: column.text(),
		logo_url: column.text(),
	},
});

const SponsorSeries = defineTable({
	columns: {
		series: column.text({
			references: () => Series.columns.id,
		}),
		sponsor: column.text({
			references: () => Sponsor.columns.id,
		}),
	},
});

const SponsorEpisode = defineTable({
	columns: {
		episode: column.text({
			references: () => Episode.columns.id,
		}),
		sponsor: column.text({
			references: () => Sponsor.columns.id,
		}),
	},
});

// https://astro.build/db/config
export default defineDb({
	tables: {
		Series,
		Collection,
		Episode,
		User,
		Sponsor,
		UserEpisode,
		SponsorEpisode,
		SponsorSeries,
	},
});
