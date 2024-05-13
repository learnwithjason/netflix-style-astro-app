import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import react from '@astrojs/react';
import clerk from 'astro-clerk-auth';

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [db(), react(), clerk({
    afterSignInUrl: '/',
    afterSignUpUrl: '/'
  })],
  adapter: netlify()
});