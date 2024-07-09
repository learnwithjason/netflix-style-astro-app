import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import clerk from 'astro-clerk-auth';
import netlify from '@astrojs/netlify';
import { imageService } from '@unpic/astro/service';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [
		db(),
		clerk({
			afterSignInUrl: '/',
			afterSignUpUrl: '/',
		}),
	],
	image: {
		domains: ['img.clerk.com'],
		service: imageService(),
	},
	adapter: netlify(),
});
