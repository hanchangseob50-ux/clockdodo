'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { languageNames } = require('../js/locale.js');
const { localizedHome } = require('../server.js');

const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const languageUrl = /\/\?lang=([a-z]{2})(?=["<])/g;
const useLanguagePaths = html => html.replace(languageUrl, '/$1/app/');

for (const code of Object.keys(languageNames)) {
  const output = path.join(root, code, 'app');
  const html = useLanguagePaths(localizedHome(template, code))
    .replace(/\b(href|src)="(?!\/|[a-z]+:|#)([^"]+)"/gi, '$1="/$2"');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'index.html'), html.trimEnd() + '\n');
}

const sitemap = path.join(root, 'sitemap.xml');
fs.writeFileSync(sitemap, useLanguagePaths(fs.readFileSync(sitemap, 'utf8')));
