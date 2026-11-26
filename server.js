'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { languageNames, seoText, translate } = require('./js/locale.js');

const origin = 'https://clockdodo.com';
const types = {
  '.html': 'text/html; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json',
};

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  })[char]);
}

function localizedHome(template, code) {
  const seo = seoText[code];
  const locale = languageNames[code];
  const slug = { ko: 'kr', pt: 'pt-br' }[code] || code;
  const guidePrefix = '/' + slug + '/';
  const canonical = origin + guidePrefix;
  const head = template.slice(0, template.indexOf('<body>'))
    .replace('<html lang="ko">', '<html lang="' + locale + '">')
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + escapeHtml(seo.title) + '</title>')
    .replace(/((?:name="description"|property="og:description") content=")[^"]*/g,
      (_, prefix) => prefix + escapeHtml(seo.description))
    .replace(/(property="og:title" content=")[^"]*/, (_, prefix) => prefix + escapeHtml(seo.title))
    .replace(/((?:rel="canonical" href|property="og:url" content)=")[^"]*/g,
      (_, prefix) => prefix + canonical)
    .replaceAll('"url":"' + origin + '/?lang=ko"', '"url":"' + canonical + '"')
    .replace(/https:\/\/clockdodo\.com\/(?:ko|en|ja|zh|es|fr|pt|pt-br|de|hi|ru|cs)\/app\//g, match =>
      match.replace(/\/ko\/app\/$/, '/kr/').replace(/\/pt\/app\/$/, '/pt-br/').replace(/\/([a-z-]+)\/app\/$/, '/$1/'))
    .replace(/https:\/\/clockdodo\.com\/(?:ko|en|ja|zh|es|fr|pt|pt-br|de|hi|ru|cs)\//g, match =>
      match.replace(/\/ko\/$/, '/kr/').replace(/\/pt\/$/, '/pt-br/'))
    .replaceAll(origin + '/ko/app/', origin + '/kr/')
    .replaceAll(origin + '/ko/', origin + '/kr/')
    .replaceAll(origin + '/pt/app/', origin + '/pt-br/')
    .replaceAll(origin + '/' + code + '/app/', canonical)
    .replaceAll(origin + '/' + code + '/', canonical)
    .replaceAll('"url":"' + origin + '/?lang=' + code + '"', '"url":"' + canonical + '"')
    .replace(/"inLanguage":\[[^\]]*\]/, '"inLanguage":"' + locale + '"');

  const body = template.slice(template.indexOf('<body>'))
    .replace('id="toolGuideLinks" aria-label="Tool guides"', 'id="toolGuideLinks" aria-label="도구 안내"')
    .replace(/(<(?:h2|p) id="seoIntro(?:Title|Text)">)[^<]*/g, (match, tag) =>
      tag + escapeHtml(tag.startsWith('<h2') ? seo.introTitle : seo.intro))
    .replace(/<[^>]+>|[^<]+/g, token => {
      if (token.startsWith('<')) {
        return token.replace(/((?:aria-label|alt)=")([^"]*)"/g, (_, prefix, label) =>
          prefix + escapeHtml(translate(label, code)) + '"');
      }
      const translated = translate(token, code);
      return translated === token ? token : escapeHtml(translated);
    })
    .replace('<option value="' + code + '"', '<option value="' + code + '" selected')
    .replaceAll('href="/ko/app/"', 'href="/kr/"')
    .replaceAll('href="/pt/app/"', 'href="/pt-br/"')
    .replace(new RegExp('href="/' + code + '/app/"', 'g'), 'href="' + canonical.replace(origin, '') + '"')
    .replace(/(id="toolGuideLinks"[^>]*>)([\s\S]*?)(<\/nav>)/,
      (_, start, links, end) => start + links.replaceAll('href="/', 'href="' + guidePrefix) + end);
  return head + body;
}

async function start() {
  const korean = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
  const homes = new Map(Object.keys(languageNames).map(code => [code, localizedHome(korean, code)]));
  const server = http.createServer(async (request, response) => {
    try {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
      }

      const url = new URL(origin + request.url);
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.includes(String.fromCharCode(92)) || pathname.startsWith('//')) {
        response.writeHead(400).end();
        return;
      }
      if (pathname === '/' || pathname === '/index.html') {
        const requested = url.searchParams.get('lang');
        const code = homes.has(requested) ? requested : 'ko';
        response.writeHead(301, {
          Location: ({ ko: '/kr/', pt: '/pt-br/' }[code] || '/' + code + '/') + url.search,
          'Content-Language': languageNames[code],
        }).end();
        return;
      }

      const localeRoot = pathname.match(/^\/(kr|ko|en|ja|zh|es|fr|pt-br|pt|de|hi|ru|cs)\/$/);
      if (localeRoot) {
        const slug = localeRoot[1];
        const code = ({ kr: 'ko', 'pt-br': 'pt' }[slug] || slug);
        if (homes.has(code)) {
          const html = homes.get(code);
          response.writeHead(200, {
          'Content-Type': types['.html'],
          'Content-Language': languageNames[code],
          }).end(request.method === 'HEAD' ? undefined : html);
          return;
        }
      }

      if (pathname === '/ko/' || pathname === '/pt/') {
        response.writeHead(301, { Location: pathname === '/ko/' ? '/kr/' : '/pt-br/' }).end();
        return;
      }

      const file = path.resolve(__dirname, '.' + pathname);
      const relative = path.relative(__dirname, file);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative) ||
          relative.split(path.sep).some(part => part.startsWith('.'))) {
        response.writeHead(404).end();
        return;
      }
      const stats = await fs.stat(file);
      if (stats.isDirectory() && !pathname.endsWith('/')) {
        response.writeHead(301, { Location: url.pathname + '/' + url.search }).end();
        return;
      }
      const asset = stats.isDirectory() ? path.join(file, 'index.html') : file;
      const type = types[path.extname(asset)];
      if (!type || relative === 'server.js') {
        response.writeHead(404).end();
        return;
      }
      const content = await fs.readFile(asset);
      response.writeHead(200, { 'Content-Type': type })
        .end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      const status = error instanceof URIError ? 400 :
        ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500;
      if (status === 500) console.error(error);
      response.writeHead(status).end();
    }
  });
  server.listen(Number(process.env.PORT || 8080));
}

module.exports = { localizedHome };

if (require.main === module) {
  start().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
