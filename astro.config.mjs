// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  fonts: [{
      provider: fontProviders.fontsource(),
      name: "Open Sans",
      cssVariable: "--font-open-sans",
      styles: ["normal"],
      weights: ["100 900"],
  }],
  integrations: [sitemap()],
  markdown: {
      shikiConfig: {
          theme: 'gruvbox-light-hard',
      },
  },
  site: 'https://geoffduso.me',
});