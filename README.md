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

## 내용은 전부 `page.js` 하나에

각 페이지 폴더의 `index.html` 은 빈 껍데기이고, **`page.js` 의 `window.PAGE` 객체**가 내용 전부다.
`assets/js/render.js` 가 그 객체를 읽어 5면을 그린다. 그래서 HTML 을 만질 일이 없다.

```js
window.PAGE = {
  series: "창작스튜디오 7기 입주작가",          // 좌상단 고정 타이틀 앞머리
  work:  { title, titleEn, year, material, materialEn, statement, autoplay, images: [ {src, webp, alt}, … ] },
  note:  { title, button, paragraphs: [ "…", "…" ] },
  video: { youtube: "https://www.youtube.com/watch?v=…", title, description, note },
  exhibition: { kicker, title, subtitle, poster: {src, webp, alt}, spec: [ {label, ko, value, note, link:{text,url}} ] },
  artist: { name, nameEn, born, genre, photo: {src, webp, alt}, statement, cv: [ "…" ] },
  footer: { wordmark, copy }
};
```

- 비워 둔 항목은 화면에서 자동으로 빠진다 (예: `video.youtube` 비우면 "coming soon", `images` 한 장이면 슬라이더 컨트롤 숨김).
- `title` 의 `" : "` 는 흐린 콜론으로, `exhibition.title` 의 `_` 는 흐린 밑줄로, `spec.value` 의 `—` 와 요일(`Tue`)은 자동 장식된다.
- `youtube` 는 `watch?v=` / `youtu.be/` / `shorts/` / 11자리 ID 어떤 형식이든 된다.
- 이미지 경로는 그 페이지 폴더 기준 (`img/…`). `webp` 는 있을 때만 적는다.

## 새 작가 페이지 만들기

1. `_template/` 폴더를 복사해서 이름을 바꾼다. 예: `2/` → URL 은 `https://yeulmaru.github.io/studio/2/`
   (영문·숫자·하이픈만. `kim-xx/` 처럼 슬러그도 됨)
2. `2/img/` 에 사진을 넣는다 (작품 여러 장, 포스터, 작가 사진).
3. `2/page.js` 의 값을 채운다. 위 구조 그대로, 한글 자리표시자만 바꾸면 된다.
4. 커밋 → push. 1~2분 뒤 반영.

루트(`/studio/`)도 같은 구조다: `page.js` 가 안민환 페이지 내용이고 `img/` 에 그 사진이 있다.

## 스크롤 모션

`muteno/creative` 의 book 모드와 동일한 감각:

- 제스처 1회 = 1페이지, **0.9s / power2.inOut**(= cubic in-out), 제스처 판정은 이벤트 간격 90ms 갭
- 모바일은 CSS `scroll-snap-type: y mandatory` 가 네이티브로 처리 (스와이프 1회 = 1면)
- 01면 슬라이더는 **가로** 스와이프만 가져간다 (세로 이동이 더 크면 면 넘김으로 양보)
- `prefers-reduced-motion` 시 모션 해제 + `proximity` 스냅 + 슬라이더 자동 넘김 해제
- GSAP·Lenis 의존 없음 — 같은 이징 곡선을 자체 구현 (`assets/js/deck.js`)

## 구조

```
index.html                 껍데기 (모든 페이지 동일 — 손대지 않음)
page.js                    루트 페이지(7기 안민환) 내용
img/                       루트 페이지 사진
_template/                 새 작가용 틀 — 폴더째 복사 (index.html · page.js · img/)
404.html                   모든 경로 → /studio/ 로 리다이렉트
assets/css/tokens.css      디자인 토큰 (muteno/creative 와 동일)
assets/css/fonts.css       Anton / Jost @font-face
assets/css/label.css       페이지 스타일 (5면 공통)
assets/js/render.js        window.PAGE → 5면 마크업
assets/js/deck.js          5면 스크롤 제어 · 리빌 · 01 슬라이더 · 03 유튜브 · 포스터 확대
assets/fonts/              자체 호스팅 폰트 (Anton, Jost, Pretendard Variable)
```

## 표기 원칙

작품명은 홑화살괄호 〈 〉, 전시명은 겹화살괄호 《 》 (국내 미술 표기 관례).
한 줄 캡션 순서: `작가명, 〈작품명〉, 제작연도, 재료, 크기`.

## 디자인 기준

`muteno/creative` 의 `DESIGN.md` — Paper & Ink 모노크롬, Anton / Jost / Pretendard 3서체,
값은 전부 `tokens.css` 변수. 새 색·크기를 임의로 추가하지 않는다.
영문 강조는 이탤릭 대신 **Anton 아웃라인**(`-webkit-text-stroke`)으로 통일 — 자체 호스팅 폰트에 이탤릭 자족이 없기 때문.

## 로컬에서 보기

자산 경로가 `/studio/assets/…` 절대경로라서, 리포 **상위 폴더**에서 서버를 띄우고 `/studio/` 로 연다.

```
cd ..   # studio 의 부모
python3 -m http.server 8000
# → http://localhost:8000/studio/
```

## 배포

Settings → Pages → Source: **Deploy from a branch** / Branch: `main` / Folder: `/ (root)`
