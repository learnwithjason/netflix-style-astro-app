import { defineAction, z } from 'astro:actions';
import { updatePerson } from '../util/sanity';

export const server = {
	profile: defineAction({
		accept: 'form',
		input: z.object({
			id: z.string(),
			display_name: z.string(),
			bio: z.string(),
			link_label: z.array(z.string()),
			link_url: z.array(z.string().url()),
		}),
		handler: async ({ id, display_name, bio, link_label, link_url }) => {
			const result = await updatePerson(id, {
				name: display_name,
				bio,
				links: link_url
					.map((url, i) => {
						if (!url) {
							return false;
						}

						return {
							label: link_label.at(i) ?? '',
							url,
						};
					})
					.filter((val) => val !== false),
			});

			console.log({ result });

			return result;
		},
	}),
};
