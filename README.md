# studio — 창작스튜디오 입주작가 라벨 페이지 (복제형 · 5면 스크롤)

QR 연결 전용 라벨 페이지. 작가마다 폴더 하나씩 복제해서 쓴다.

- **URL**: `https://yeulmaru.github.io/studio/` (루트 = 7기 안민환)
- 새 작가 페이지는 `https://yeulmaru.github.io/studio/<슬러그>/`
- 디자인·폰트·스크립트는 `assets/` 한 벌을 모든 페이지가 공유한다.

## 구성 — 스크롤 5면

| 면 | 내용 |
|---|---|
| 01 Artwork | 작품사진 **슬라이더**(풀블리드, 좌우 스와이프 · ‹ › 버튼 · 1/N 카운터) · 캡션 · 한 줄 스테이트먼트 |
| 02 Curatorial Note | 기획글 (문단 단위로 넘어감) |
| 03 Video | **유튜브 임베드** (링크 하나만 넣으면 됨) |
| 04 Exhibition | 전시 포스터(탭하면 확대) · 기간 · 운영시간 · 장소 |
| 05 Artist | 작가 사진 · 작가 소개 · 주요 이력 · 푸터 |

전시 타이틀은 **좌상단 고정**(`.fixhead`, `mix-blend-mode: difference`)으로 5면 내내 노출된다.

## 새 작가 페이지 만들기

1. `_template/` 폴더를 복사해서 슬러그 이름으로 바꾼다. 예: `kim-xx/`
   (영문 소문자·하이픈. 이 이름이 URL이 된다: `/studio/kim-xx/`)
2. `kim-xx/img/` 에 이미지를 넣는다. 파일명은 그대로 맞춘다.
   - `work-01.jpg` + `work-01.webp`, `work-02.*`, `work-03.*` … 작품 사진 (슬라이더 순서 = 번호 순서)
   - `poster.jpg` + `poster.webp` 포스터
   - `artist.jpg` + `artist.webp` 작가 사진
   - webp 가 없으면 `<source srcset=…webp>` 줄을 지우면 된다. jpg 만으로도 동작.
3. `kim-xx/index.html` 을 열어 **한글 자리표시자만** 바꾼다.
   - `<head>` 의 `<title>`, `description`, `og:*`
   - 좌상단 고정 타이틀 `.fixhead`
   - 01면: 슬라이드 `<picture class="w-slide">` 블록을 사진 수만큼 남기거나 늘린다. 한 장이면 컨트롤이 자동으로 숨는다.
     자동 넘김을 원하면 `<figure class="w-photo r" data-slider data-autoplay="5000">`
   - 03면: `data-youtube="…"` 에 유튜브 링크. `watch?v=` / `youtu.be/` / `shorts/` / 11자리 ID 아무거나.
     비워 두면 "Video — coming soon" 자리표시자.
   - 04면 기간·시간·장소, 05면 작가 정보
4. 커밋 → push. 1~2분 뒤 `https://yeulmaru.github.io/studio/kim-xx/` 에 뜬다.

루트 `index.html`(안민환)도 같은 구조라서 같은 방법으로 고친다. 단 자산 경로가 `assets/…` (하위 폴더는 `../assets/…`).

## 스크롤 모션

`muteno/creative` 의 book 모드와 동일한 감각:

- 제스처 1회 = 1페이지, **0.9s / power2.inOut**(= cubic in-out), 제스처 판정은 이벤트 간격 90ms 갭
- 모바일은 CSS `scroll-snap-type: y mandatory` 가 네이티브로 처리 (스와이프 1회 = 1면)
- 01면 슬라이더는 **가로** 스와이프만 가져간다 (세로 이동이 더 크면 면 넘김으로 양보)
- `prefers-reduced-motion` 시 모션 해제 + `proximity` 스냅 + 슬라이더 자동 넘김 해제
- GSAP·Lenis 의존 없음 — 같은 이징 곡선을 자체 구현 (`assets/js/deck.js`)

## 구조

```
index.html                 7기 안민환 라벨 페이지 (루트)
_template/index.html       새 작가용 틀 — 폴더째 복사해서 쓴다
_template/img/             작품·포스터·작가 사진 자리
404.html                   모든 경로 → /studio/ 로 리다이렉트
assets/css/tokens.css      디자인 토큰 (muteno/creative 와 동일)
assets/css/fonts.css       Anton / Jost @font-face
assets/css/label.css       페이지 스타일 (5면 공통)
assets/js/deck.js          5면 스크롤 제어 · 리빌 · 01 슬라이더 · 03 유튜브 · 포스터 확대
assets/fonts/              자체 호스팅 폰트 (Anton, Jost, Pretendard Variable)
assets/img/                루트(안민환) 페이지 이미지
```

## 표기 원칙

작품명은 홑화살괄호 〈 〉, 전시명은 겹화살괄호 《 》 (국내 미술 표기 관례).
한 줄 캡션 순서: `작가명, 〈작품명〉, 제작연도, 재료, 크기`.

## 디자인 기준

`muteno/creative` 의 `DESIGN.md` — Paper & Ink 모노크롬, Anton / Jost / Pretendard 3서체,
값은 전부 `tokens.css` 변수. 새 색·크기를 임의로 추가하지 않는다.
영문 강조는 이탤릭 대신 **Anton 아웃라인**(`-webkit-text-stroke`)으로 통일 — 자체 호스팅 폰트에 이탤릭 자족이 없기 때문.

## 배포

Settings → Pages → Source: **Deploy from a branch** / Branch: `main` / Folder: `/ (root)`
