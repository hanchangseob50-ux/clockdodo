# ClockDodo multilingual SEO management

## Canonical language URLs

| Language | URL | `hreflang` | HTML `lang` |
| --- | --- | --- | --- |
| 한국어 | `/kr/` | `ko-KR` | `ko-KR` |
| English | `/en/` | `en` | `en` |
| 日本語 | `/ja/` | `ja-JP` | `ja-JP` |
| 简体中文 | `/zh/` | `zh-Hans` | `zh-Hans` |
| Español | `/es/` | `es` | `es` |
| Français | `/fr/` | `fr` | `fr` |
| Português (Brasil) | `/pt-br/` | `pt-BR` | `pt-BR` |
| Deutsch | `/de/` | `de` | `de` |
| हिन्दी | `/hi/` | `hi-IN` | `hi-IN` |
| Русский | `/ru/` | `ru` | `ru` |
| Čeština | `/cs/` | `cs-CZ` | `cs-CZ` |

## Release checklist

1. Run `node scripts/build-localized-homes.js` after changing the Korean template or translations.
2. Confirm every language home returns HTTP 200 and has its own self-referencing canonical.
3. Confirm every page lists itself and all alternate language URLs with `hreflang`.
4. Submit `https://clockdodo.com/sitemap.xml` to Google Search Console, Bing Webmaster Tools, Naver Search Advisor, and Yandex Webmaster.
5. Request indexing for new or materially changed language URLs in each service.
6. Check crawl errors, alternate-page reports, and selected canonical reports after recrawling.

## Backlink plan

Technical files cannot create third-party backlinks by themselves. Build legitimate links in each language by:

- Listing the site in relevant developer, productivity, and time-tool directories for that market.
- Publishing useful localized guides that other sites can cite, such as time-zone conversion and study-timer guides.
- Linking from the project's official GitHub README and release notes to the matching language URL.
- Partnering with local education, productivity, and open-source communities for editorial references.
- Avoiding purchased link packages, automated comment links, link exchanges at scale, and keyword-stuffed anchors.

Use descriptive anchors such as “Japanese online clock” or “日本語オンライン時計” and link to the matching language page. Record each placement, source URL, target URL, language, date, and whether the link is still live.

## Search wording guidance

Keep each page's title, H1, description, visible introduction, image alt text, and link text in the same language. Add important phrases naturally; do not repeat keywords to manipulate rankings. Search engines may rewrite snippets and title links after recrawling.
