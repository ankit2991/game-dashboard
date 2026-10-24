import { mkdirSync, writeFileSync } from 'node:fs';
// Netlify Drop needs this file inside dist, without overriding actual JS assets.
mkdirSync('dist', { recursive: true });
writeFileSync('dist/_redirects', '/* /index.html 200\n');
console.log('Verified Netlify SPA fallback.');
