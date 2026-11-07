// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sandesykkel.no',
  trailingSlash: 'ignore',
  // trening.html i stedet for trening/index.html: Cloudflare serverer da /trening direkte, uten omdirigering til /trening/
  build: { format: 'file' },
});
