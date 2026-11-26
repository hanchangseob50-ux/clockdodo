'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { languageNames } = require('../js/locale.js');
const { localizedHome } = require('../server.js');

const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const slugs = { ko: 'kr', pt: 'pt-br' };

for (const code of Object.keys(languageNames)) {
  const slug = slugs[code] || code;
  const output = path.join(root, slug);
  fs.mkdirSync(output, { recursive: true });
  const html = localizedHome(template, code)
    .replace(/(href|src)="(?!https?:|\/|#)([^"]+)"/g, '$1="/$2"')
    .replace(/\/([a-z]{2}|pt-br)\/app\//g, (_, slug) => `/${slug === 'ko' ? 'kr' : slug === 'pt' ? 'pt-br' : slug}/`);
  fs.writeFileSync(path.join(output, 'index.html'), html.trimEnd() + '\n');
}

// Keep the old generated app paths as redirects for existing links.
for (const code of Object.keys(languageNames)) {
  const oldSlug = code === 'ko' ? 'ko' : code === 'pt' ? 'pt' : code;
  const output = path.join(root, oldSlug, 'app');
  fs.mkdirSync(output, { recursive: true });
  const target = '/' + (slugs[code] || code) + '/';
  fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${target}">`);
}
