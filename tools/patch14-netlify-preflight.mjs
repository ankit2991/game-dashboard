import { readFileSync } from 'node:fs';
if (!readFileSync('dist/_redirects','utf8').includes('/* /index.html 200')) process.exit(1);
console.log('Netlify SPA redirect present.');
