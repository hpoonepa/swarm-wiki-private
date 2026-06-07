import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import gfm from "remark-gfm";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), tailwind()],
  outDir: './dist',
  publicDir: './static',
  base: '/lambert-ga',

  markdown: {
    remarkPlugins: [gfm, remarkMath],
      rehypePlugins: [rehypeKatex],
  }
});
