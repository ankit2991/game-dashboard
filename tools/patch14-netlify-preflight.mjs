import { readFileSync } from 'node:fs';
const rule = readFileSync('dist/_redirects', 'utf8');
if (!rule.split(/\r?\n/).some(line => /^\/\*\s+\/index\.html\s+200(?:\s+.*)?$/.test(line.trim()))) {
  throw new Error('Netlify SPA redirect missing from dist');
}
console.log('Netlify SPA redirect present.');
