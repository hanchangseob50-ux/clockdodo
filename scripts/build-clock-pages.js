'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { languageNames } = require('../js/locale.js');
const { featureSeoCopy } = require('../js/seo-copy.js');

const root = path.resolve(__dirname, '..');
const origin = 'https://clockdodo.com';
const slugs = { ko: 'kr', pt: 'pt-br' };
const styleRoutes = [
  { slug: 'digital-clock', key: 'digital' },
  { slug: 'analog-clock', key: 'analog' },
  { slug: 'flip-clock', key: 'flip' },
];
const titleSets = {
  ko: [
    '디지털 시계·현재시간 실시간 표시 | ClockDodo',
    '아날로그 시계·온라인 바늘 시계 | ClockDodo',
    '플립 시계·감성적인 온라인 디지털 시계 | ClockDodo',
  ],
  en: ['Digital Clock · Current Time to the Second | ClockDodo', 'Analog Clock · Online Hands Clock | ClockDodo', 'Flip Clock · Stylish Online Digital Clock | ClockDodo'],
  ja: ['デジタル時計・秒単位の現在時刻 | ClockDodo', 'アナログ時計・オンライン針時計 | ClockDodo', 'フリップ時計・オンラインデジタル時計 | ClockDodo'],
  zh: ['数字时钟·精确到秒的当前时间 | ClockDodo', '模拟时钟·在线指针时钟 | ClockDodo', '翻页时钟·在线数字时钟 | ClockDodo'],
  es: ['Reloj digital · Hora actual al segundo | ClockDodo', 'Reloj analógico · Reloj de agujas online | ClockDodo', 'Reloj de flip · Reloj digital online | ClockDodo'],
  fr: ['Horloge numérique · Heure actuelle à la seconde | ClockDodo', 'Horloge analogique · Horloge à aiguilles en ligne | ClockDodo', 'Horloge à volets · Horloge numérique en ligne | ClockDodo'],
  pt: ['Relógio digital · Hora atual ao segundo | ClockDodo', 'Relógio analógico · Relógio de ponteiros online | ClockDodo', 'Relógio flip · Relógio digital online | ClockDodo'],
  de: ['Digitale Uhr · Aktuelle Uhrzeit auf die Sekunde | ClockDodo', 'Analoge Uhr · Online-Zeigeruhr | ClockDodo', 'Flip-Uhr · Stilvolle digitale Online-Uhr | ClockDodo'],
  hi: ['डिजिटल घड़ी · सेकंड तक वर्तमान समय | ClockDodo', 'एनालॉग घड़ी · ऑनलाइन सुई वाली घड़ी | ClockDodo', 'फ्लिप घड़ी · ऑनलाइन डिजिटल घड़ी | ClockDodo'],
  ru: ['Цифровые часы · Текущее время до секунды | ClockDodo', 'Аналоговые часы · Онлайн часы со стрелками | ClockDodo', 'Перекидные часы · Онлайн цифровые часы | ClockDodo'],
  cs: ['Digitální hodiny · Aktuální čas na sekundy | ClockDodo', 'Analogové hodiny · Online hodiny s ručičkami | ClockDodo', 'Překlápěcí hodiny · Online digitální hodiny | ClockDodo'],
};
const labels = {
  ko: ['시계 도구', '도구 열기', '활용 예시', '디지털 시계', '아날로그 시계', '플립 시계'],
  en: ['Clock tools', 'Open tool', 'Use cases', 'Digital Clock', 'Analog Clock', 'Flip Clock'],
  ja: ['時計ツール', 'ツールを開く', '活用例', 'デジタル時計', 'アナログ時計', 'フリップ時計'],
  zh: ['时钟工具', '打开工具', '使用场景', '数字时钟', '模拟时钟', '翻页时钟'],
  es: ['Herramientas de reloj', 'Abrir herramienta', 'Ejemplos de uso', 'Reloj digital', 'Reloj analógico', 'Reloj de flip'],
  fr: ['Outils d’horloge', 'Ouvrir l’outil', 'Exemples d’utilisation', 'Horloge numérique', 'Horloge analogique', 'Horloge à volets'],
  pt: ['Ferramentas de relógio', 'Abrir ferramenta', 'Exemplos de uso', 'Relógio digital', 'Relógio analógico', 'Relógio flip'],
  de: ['Uhrwerkzeuge', 'Werkzeug öffnen', 'Anwendungsbeispiele', 'Digitale Uhr', 'Analoge Uhr', 'Flip-Uhr'],
  hi: ['घड़ी टूल', 'टूल खोलें', 'उपयोग के उदाहरण', 'डिजिटल घड़ी', 'एनालॉग घड़ी', 'फ्लिप घड़ी'],
  ru: ['Инструменты часов', 'Открыть инструмент', 'Примеры использования', 'Цифровые часы', 'Аналоговые часы', 'Перекидные часы'],
  cs: ['Nástroje hodin', 'Otevřít nástroj', 'Příklady použití', 'Digitální hodiny', 'Analogové hodiny', 'Překlápěcí hodiny'],
};
const html = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const plain = value => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const copyEntries = code => [...featureSeoCopy[code].matchAll(/<article><h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p><\/article>/g)]
  .slice(0, 3).map(match => ({ heading: plain(match[1]), description: plain(match[2]) }));

for (const code of Object.keys(languageNames)) {
  const slug = slugs[code] || code;
  const lang = languageNames[code];
  const copy = copyEntries(code);
  const altLinks = Object.keys(languageNames).map(other => {
    const otherPrefix = other === 'ko' ? '' : '/' + (slugs[other] || other);
    return `<link rel="alternate" hreflang="${html(languageNames[other])}" href="${origin}${otherPrefix}/__STYLE__/">`;
  }).join('');
  for (let index = 0; index < styleRoutes.length; index++) {
    const route = styleRoutes[index];
    const homePath = code === 'ko' ? '/kr/' : `/${slug}/`;
    const url = `${code === 'ko' ? '' : '/' + slug}/${route.slug}/`;
    const title = titleSets[code][index];
    const entry = copy[index];
    const label = labels[code];
    const alternate = altLinks.replaceAll('__STYLE__', route.slug);
    const page = `<!doctype html>
<html lang="${html(lang)}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow"><title>${html(title)}</title>
<meta name="description" content="${html(entry.description)}"><link rel="canonical" href="${origin}${url}">${alternate}
<link rel="alternate" hreflang="x-default" href="${origin}/en/${route.slug}/">
<meta property="og:type" content="website"><meta property="og:site_name" content="ClockDodo.com"><meta property="og:title" content="${html(title)}"><meta property="og:description" content="${html(entry.description)}"><meta property="og:url" content="${origin}${url}">
<link rel="stylesheet" href="/css/content-pages.css"><link rel="stylesheet" href="/css/brand.css">
</head><body><div class="content-wrap"><header class="content-header"><a class="logo clockdodo-logo" href="${homePath}"><span class="logo-mark" aria-hidden="true"><span class="logo-clock"></span><span class="logo-beak"></span></span><span class="logo-wordmark"><span class="logo-name">ClockDodo<span class="logo-domain">.com</span></span><span class="logo-caption">CLOCK &amp; TIME TOOLS</span></span></a><a class="header-link" href="${homePath}">${html(label[0])}</a></header><main><section class="content-hero"><h1>${html(title.replace(/ \| ClockDodo$/, ''))}</h1><p class="lead">${html(entry.description)}</p><a class="primary-link" href="${homePath}">${html(label[1])}</a></section><section class="content-section"><h2>${html(label[2])}</h2><p>${html(entry.description)}</p></section><section class="content-section"><h2>${html(label[0])}</h2><nav class="related"><a href="${homePath}">${html(label[index + 3])}</a><a href="${homePath}">ClockDodo</a></nav></section></main><footer class="content-footer"><a href="${homePath}">ClockDodo</a><a href="/about.html">About</a></footer></div></body></html>
`;
    const dir = path.join(code === 'ko' ? root : path.join(root, slug), route.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page);
  }
}
