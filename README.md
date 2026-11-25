# ClockDodo

## 실행과 배포

Node.js 18 이상에서 `node server.js`를 실행합니다. 기본 포트는 8080이며 `PORT` 환경 변수로 바꿀 수 있습니다. 예를 들어 http://localhost:8080/?lang=ja 에서 일본어 응답을 확인할 수 있습니다.

운영 서버는 HTTPS를 통해 Node.js 앱으로 요청을 전달해야 합니다. 프록시와 CDN에서 `lang` 쿼리 파라미터를 원본 서버에 전달하고 캐시 키에도 포함하세요. 정적 파일 호스팅에서는 `?lang=` 값에 따라 최초 HTML을 바꿀 수 없습니다. 정적 호스팅을 교체하는 경우 사이트 소유권 확인 파일과 메타 태그가 계속 제공되는지도 함께 확인하세요.

## 언어 URL

| 언어 | HTML 및 hreflang | 홈페이지 |
| --- | --- | --- |
| 한국어 | ko-KR | `/?lang=ko` |
| 영어 | en | `/?lang=en` |
| 일본어 | ja-JP | `/?lang=ja` |
| 중국어 간체 | zh-Hans | `/?lang=zh` |
| 스페인어 | es | `/?lang=es` |
| 프랑스어 | fr | `/?lang=fr` |
| 브라질 포르투갈어 | pt-BR | `/?lang=pt` |
| 독일어 | de | `/?lang=de` |
| 힌디어 | hi-IN | `/?lang=hi` |
| 러시아어 | ru | `/?lang=ru` |
| 체코어 | cs-CZ | `/?lang=cs` |

영어, 중국어 간체, 스페인어, 프랑스어, 독일어, 러시아어는 여러 국가에서 같은 콘텐츠를 제공할 수 있도록 언어 또는 문자 체계 단위로 설정했습니다. 각 나라의 독립적인 페이지가 생기면 해당 국가용 URL과 hreflang을 추가할 수 있습니다.

언어별 홈페이지는 각각 자신의 canonical과 11개 언어의 hreflang을 포함합니다. `x-default`는 한국어 기본 페이지를 가리킵니다. `/en/`, `/ja/` 등의 경로는 도구 안내 페이지이고, 각 안내 페이지에서 동일 언어의 앱으로 이동할 수 있습니다.

## 배포 후 검색엔진 확인

1. 운영 환경에서 11개 URL이 HTTP 200을 반환하고, 원본 HTML의 언어, 제목, 설명, canonical과 본문이 각각 일치하는지 확인합니다. 브라우저 언어를 바꿔도 명시적인 언어 URL의 응답은 같아야 합니다.
2. [Google Search Console](https://search.google.com/search-console), [Bing Webmaster Tools](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed), 한국의 [네이버 서치어드바이저](https://searchadvisor.naver.com/guide/request-feed), 러시아어 페이지용 [Yandex Webmaster](https://yandex.com/support/webmaster/en/indexing-options/sitemap)에 `https://clockdodo.com/sitemap.xml`을 제출합니다. Yandex가 언어 관계를 인식하도록 각 HTML의 head에도 hreflang을 유지합니다. [Google의 다국어 문서](https://developers.google.com/search/docs/specialty/international/localized-versions) · [Yandex의 다국어 문서](https://yandex.com/support/webmaster/en/yandex-indexing/locale-pages)
3. 중국어 간체 URL은 [Baidu 검색 리소스 플랫폼](https://ziyuan.baidu.com/linksubmit/index)에서 제출할 수 있습니다. 체코의 [Seznam](https://search.seznam.cz/wt/pridej-stranku)에는 체코어 홈페이지 `https://clockdodo.com/?lang=cs`와 체코어 도구 안내 주소를 제출할 수 있습니다.
4. 검색엔진의 URL 검사나 수집 보고서에서 수집한 URL, 선택된 canonical, 색인 상태를 확인합니다. 결과에 표시할 언어 페이지와 노출 순위는 각 검색엔진에서 결정합니다.
