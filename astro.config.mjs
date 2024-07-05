import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});
