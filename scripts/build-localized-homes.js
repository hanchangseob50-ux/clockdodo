'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { languageNames } = require('../js/locale.js');
const { localizedHome } = require('../server.js');

const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const slugs = { ko: 'kr', pt: 'pt-br' };
const normalizeLinks = html => html
  .replace(/\/ko\/app\//g, '/kr/')
  .replace(/\/pt\/app\//g, '/pt-br/')
  .replace(/\/ko\//g, '/kr/')
  .replace(/\/pt\//g, '/pt-br/');

for (const code of Object.keys(languageNames)) {
  const slug = slugs[code] || code;
  const output = path.join(root, slug);
  fs.mkdirSync(output, { recursive: true });
  const html = normalizeLinks(localizedHome(template, code))
    .replace(/(href|src)="(?!https?:|\/|#)([^"]+)"/g, '$1="/$2"')
    .replace(/\/([a-z]{2}|pt-br)\/app\//g, (_, slug) => `/${slug === 'ko' ? 'kr' : slug === 'pt' ? 'pt-br' : slug}/`);
  fs.writeFileSync(path.join(output, 'index.html'), html.trimEnd() + '\n');
}

// Make the root document safe for static hosts: Korean is the default page,
// while its canonical URL remains /kr/.
const rootHome = normalizeLinks(localizedHome(template, 'ko'))
  .replace(/(href|src)="(?!https?:|\/|#)([^"]+)"/g, '$1="/$2"');
fs.writeFileSync(path.join(root, 'index.html'), rootHome.trimEnd() + '\n');

// Keep every generated HTML alternate link on the canonical path scheme.
for (const file of fs.readdirSync(root, { recursive: true })) {
  if (!String(file).endsWith('.html')) continue;
  const full = path.join(root, file);
  fs.writeFileSync(full, normalizeLinks(fs.readFileSync(full, 'utf8')));
}

const sitemap = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  const today = new Date().toISOString().slice(0, 10);
  const xml = normalizeLinks(fs.readFileSync(sitemap, 'utf8'))
    .replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(sitemap, xml);
}

// Keep the old generated app paths as redirects for existing links.
for (const code of Object.keys(languageNames)) {
  const oldSlug = code === 'ko' ? 'ko' : code === 'pt' ? 'pt' : code;
  const output = path.join(root, oldSlug, 'app');
  fs.mkdirSync(output, { recursive: true });
  const target = '/' + (slugs[code] || code) + '/';
  fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${target}">`);
}
