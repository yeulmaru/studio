# studio — 작품 라벨 페이지 (단일 · 3페이지 스크롤)

QR 연결 전용 단일 페이지. 안민환 〈풍경조각 : 토대를 까는 일〉(2026) 라벨.

- **URL**: `https://yeulmaru.github.io/studio/`
- 페이지는 `index.html` 하나뿐이고, 외부로 나가는 링크가 없다.
- 다른 경로로 접근하면 `404.html`이 라벨 페이지로 되돌린다.

## 구성 — 스크롤 3면

| 면 | 내용 |
|---|---|
| 01 Artwork | 작품사진(풀블리드) · 작품명/작가명(우측 상단) · 한 줄 스테이트먼트 · 표준 캡션 |
| 02 Exhibition | 전시 포스터(탭하면 확대) · 기간 · 장소 · 키워드 |
| 03 Artist | 작가 사진 · 작가 소개 · 주요 이력 · 푸터 |

전시 타이틀은 **좌상단 고정**(`.fixhead`, `mix-blend-mode: difference`)으로 3면 내내 노출된다.

## 스크롤 모션

`muteno/creative` 의 book 모드와 동일한 감각:

- 제스처 1회 = 1페이지, **0.9s / power2.inOut**(= cubic in-out), 제스처 판정은 이벤트 간격 90ms 갭
- 모바일은 CSS `scroll-snap-type: y mandatory` 가 네이티브로 처리 (스와이프 1회 = 1면)
- `prefers-reduced-motion` 시 모션 해제 + `proximity` 스냅
- GSAP·Lenis 의존 없음 — 같은 이징 곡선을 자체 구현 (`assets/js/deck.js`)

## 구조

```
index.html                 라벨 페이지 (유일한 페이지)
404.html                   모든 경로 → index 로 리다이렉트
assets/css/tokens.css      디자인 토큰 (muteno/creative 와 동일)
assets/css/fonts.css       Anton / Jost @font-face
assets/css/label.css       이 페이지 전용 스타일
assets/js/deck.js          3면 스크롤 제어 · 리빌 · 포스터 확대
assets/fonts/              자체 호스팅 폰트 (Anton, Jost, Pretendard Variable)
assets/img/work.webp|jpg   01 작품사진 (웹용)
assets/img/poster.webp|jpg 02 포스터 (웹용)
assets/img/artist.webp|jpg 03 작가 사진 (웹용)
assets/img/*-original.*    원본 보관 (웹에서 미사용)
```

## 표기 원칙

작품명은 홑화살괄호 〈 〉, 전시명은 겹화살괄호 《 》 (국내 미술 표기 관례).
한 줄 캡션 순서: `작가명, 〈작품명〉, 제작연도, 재료, 크기`.

## 디자인 기준

`muteno/creative` 의 `DESIGN.md` — Paper & Ink 모노크롬, Anton / Jost / Pretendard 3서체,
값은 전부 `tokens.css` 변수. 새 색·크기를 임의로 추가하지 않는다.
영문 강조는 이탤릭 대신 **Anton 아웃라인**(`-webkit-text-stroke`)으로 통일 — 자체 호스팅 폰트에 이탤릭 자족이 없기 때문.

## 수정 방법

- 텍스트: `index.html` 의 해당 `<section class="pg">` 안에서만 고친다.
- 작가 사진 교체: `assets/img/artist.jpg` + `assets/img/artist.webp` 두 파일을 같은 이름으로 덮어쓴다.
- 스타일: `assets/css/label.css`
- 커밋 → push 하면 GitHub Pages 가 자동 반영한다 (1~2분).

## 배포

Settings → Pages → Source: **Deploy from a branch** / Branch: `main` / Folder: `/ (root)`
