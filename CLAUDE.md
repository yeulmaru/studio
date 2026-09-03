# CLAUDE.md — yeulmaru/studio 안내

이 파일은 Claude(및 사람)가 이 리포를 처음 열었을 때 구조와 운영 방식을 바로 이해하기 위한 문서다.
사용자는 개발자가 아니다. **수정 요청은 항상 "어느 페이지의 어떤 값을 바꿔 달라"는 식으로 들어오고, Claude 가 `page.js` 를 고쳐 PR 을 만든다.** 관리자 페이지는 없다(의도적으로 안 만듦).

## 이게 뭔가

GS칼텍스 예울마루 창작스튜디오 입주작가 **전시 라벨 페이지**. QR 로 연결되는 모바일 우선 사이트.
GitHub Pages 프로젝트 사이트라서 URL 은 `https://yeulmaru.github.io/studio/…` 로 붙는다.

한 페이지 = 스크롤 5면:

| 면 | 내용 | page.js 키 |
|---|---|---|
| 01 Artwork | 작품 사진 슬라이더(좌우 넘김) · 캡션 · 한 줄 스테이트먼트 | `work` |
| 02 Curatorial Note | 기획글 (문단 배열) | `note` |
| 03 Video | 유튜브 임베드 | `video` |
| 04 Exhibition | 포스터(탭하면 확대) · 기간 · 운영시간 · 장소 | `exhibition` |
| 05 Artist | 작가 사진 · 소개 · 이력 · 푸터 | `artist`, `footer` |

## 페이지(작가)별 위치 — 이게 제일 중요

```
/                      ← 1번 작가 (7기 안민환). URL: https://yeulmaru.github.io/studio/
  index.html             빈 껍데기. 건드리지 않는다
  page.js                ★ 이 페이지의 내용 전부 (텍스트·이미지 경로·유튜브 링크)
  img/                   ★ 이 페이지의 사진

/2/                    ← 2번 작가 (아직 없음). URL: https://yeulmaru.github.io/studio/2/
  index.html             _template 에서 복사한 그대로
  page.js                ★
  img/                   ★

/3/, /4/, /5/ …        ← 같은 방식. 폴더 이름이 곧 URL. 숫자 대신 슬러그(kim-xx)도 가능

/_template/            ← 새 페이지 만들 때 복사하는 원본. 여기 자체는 배포 URL 로 쓰지 않는다
/assets/               ← 모든 페이지가 공유하는 CSS·폰트·JS. 디자인 수정은 여기 한 곳
/404.html              ← 없는 주소로 들어오면 /studio/ 로 되돌림
```

**1번 작가(안민환)는 반드시 루트(`/studio/`)에 남긴다.** 이미 배포된 QR 이 그 주소를 가리킨다. 폴더로 옮기지 말 것.

## 수정 요청이 오면 할 일

### 텍스트·링크 바꾸기
해당 페이지 폴더의 `page.js` 만 고친다. `index.html` 은 만지지 않는다. HTML 을 몰라도 되는 구조다.

- 유튜브: `video.youtube` 에 링크 문자열. `watch?v=…` / `youtu.be/…` / `shorts/…` / 11자리 ID 전부 됨. 빈 문자열이면 "Video — coming soon" 자리표시자.
- 작품명: `work.title`. `" : "` 는 자동으로 흐린 콜론이 된다. 작품명은 〈 〉, 전시명은 《 》.
- 기간·시간: `exhibition.spec[].value` 에 평문. `—` 로 구간, `Tue`·`Sun` 같은 요일은 자동 장식.
- 비워 둔 항목은 화면에서 자동으로 빠진다.

### 사진 넣기 / 바꾸기
해당 페이지 폴더의 `img/` 에 넣고 `page.js` 에서 경로(`img/파일명`)를 적는다.

- **작품 사진(01면 슬라이더)**: `work.images` 배열. 순서 = 슬라이드 순서. 한 장이면 넘김 컨트롤이 자동으로 숨는다.
  - 권장 비율 **세로 3:4** (예: 1500×2000). 모바일에서 폭 100% 로 깔리고 위아래만 잘린다.
  - 가로 사진도 동작은 하지만 모바일에서 좌우가 크게 잘린다. 데스크톱은 잘리지 않고 전체를 보여준다.
- **포스터(04면)**: `exhibition.poster`. 비율 무관 (잘리지 않고 통째로 보여줌, 탭하면 확대).
- **작가 사진(05면)**: `artist.photo`. 비율 무관, 세로 2:3 이 가장 자연스럽다.
- 파일 형식: jpg 또는 png. 장당 1MB 이하 권장(폰에서 열리는 페이지다). webp 는 있으면 `webp:` 에 같이 적고, 없으면 그 키를 빼면 된다.
- `width`/`height` 는 선택. 적으면 로딩 중 레이아웃이 안 흔들린다.
- `*-original.*` 은 원본 보관용. 웹에서 쓰지 않는다.

### 새 작가 페이지 만들기
1. `_template/` 를 통째로 복사해서 이름을 바꾼다. 예: `2/`
2. `2/img/` 에 사진을 넣는다.
3. `2/page.js` 자리표시자를 채운다.
4. 커밋 → push → 1~2분 뒤 `https://yeulmaru.github.io/studio/2/`

### 디자인 바꾸기
`assets/css/label.css` (색·크기는 `assets/css/tokens.css` 변수만 사용, 새 값 임의 추가 금지).
마크업은 `assets/js/render.js` 가 `page.js` 객체로부터 생성한다. 면을 추가·삭제하려면 `render.js` 와 `deck.js` 의 `names` 배열(인디케이터)을 같이 고친다.

## page.js 전체 구조

```js
window.PAGE = {
  series: "창작스튜디오 7기 입주작가",             // 좌상단 고정 타이틀 앞머리
  description: "…", descriptionEn: "…",           // <meta description>, og
  work: {
    title, titleEn, year, material, materialEn, statement,
    autoplay: 0,                                  // ms. 0 = 수동 넘김
    images: [ { src: "img/work-01.jpg", webp: "img/work-01.webp", width, height, alt }, … ]
  },
  note: { title: "기획글", button: "기획글 보기", paragraphs: [ "…", "…" ] },
  video: { youtube: "https://www.youtube.com/watch?v=…", title, description, note },
  exhibition: {
    kicker, title: "7기 입주작가전_안민환",         // "_" 는 흐린 밑줄 기호
    subtitle: "〈작품명〉",
    poster: { src, webp, alt },
    spec: [ { label: "Period", ko: "기간", value: "2026. 08. 25 Tue — 10. 25 Sun", note, link: { text, url } }, … ]
  },
  artist: { name, nameEn, born, genre, photo: { src, webp, alt }, statement, cv: [ "…" ] },
  footer: { wordmark, copy }
};
```

## 기술 메모 (Claude 용)

- 순수 정적. 빌드 없음, 의존성 없음, CI 없음. push 하면 GitHub Pages 가 그대로 서빙.
- 자산 경로는 `/studio/assets/…` **절대경로**. 하위 폴더에서도 같은 `index.html` 을 쓰기 위해서다.
  로컬 확인은 리포의 **부모 폴더**에서 `python3 -m http.server` 띄우고 `http://localhost:8000/studio/` 로 연다.
- 스크립트 실행 순서: `page.js` → `assets/js/render.js`(마크업 생성) → `assets/js/deck.js`(면 넘김·슬라이더·유튜브·포스터 확대). 둘 다 `defer`, 순서 유지 필수.
- `deck.js` 는 2면(index 1)이 기획글이라는 전제로 문단 넘김을 처리한다. 면 순서를 바꾸면 그 부분도 봐야 한다.
- og 태그는 JS 로 채워서 크롤러(카톡 미리보기)엔 안 잡힐 수 있다. 미리보기가 필요하면 그 페이지 `index.html` 의 meta 만 직접 채운다.
- 이 실행 환경(Claude 샌드박스) 브라우저는 유튜브 접속이 막혀 있어 iframe 렌더는 로컬에서 확인 못 한다. 링크 유효성은 `https://www.youtube.com/oembed?url=<링크>&format=json` 으로 확인한다.
- 디자인 기준: `muteno/creative` 의 `DESIGN.md` — Paper & Ink 모노크롬, Anton / Jost / Pretendard.

## 관련 리포

- `yeulmaru/yeulmaru.github.io` — 사용자 사이트 루트. 여기 내용은 `/studio/` 와 무관. (`/studio/` 는 이 리포가 담당)
- `yeulmaru/crstudio`, `yeulmaru/staypackage` — 별개 프로젝트. 확인 안 함.
