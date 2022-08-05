import { $ } from 'zx';
await $`concurrently \"unocss \"**/*.tsx\" --out-file \"app/uno.css\" --watch\" \"esbuild app/entry.worker.tsx --outfile=./public/entry.worker.js --bundle --format=esm --define:process.env.NODE_ENV='\"development\"' --watch\" \"cross-env NODE_ENV=development remix watch\" `;
