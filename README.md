# studio — 작품 라벨 페이지 (단일)

QR 연결 전용 단일 페이지. 안민환 《풍경조각 : 토대를 까는 일》(2026) 라벨.

- **URL**: `https://yeulmaru.github.io/studio/`
- 페이지는 `index.html` 하나뿐이고, 외부로 나가는 링크가 없다.
- 다른 경로로 접근하면 `404.html`이 라벨 페이지로 되돌린다.

## 구조

```
index.html                 라벨 페이지 (유일한 페이지)
404.html                   모든 경로 → index 로 리다이렉트
assets/css/tokens.css      디자인 토큰 (muteno/creative 와 동일)
assets/css/fonts.css       Anton / Jost @font-face
assets/css/label.css       이 페이지 전용 스타일
assets/fonts/              자체 호스팅 폰트 (Anton, Jost, Pretendard Variable)
assets/img/poster.webp     웹용 포스터 (341KB)
assets/img/poster.jpg      webp 미지원 폴백 (449KB)
assets/img/poster-original.png  원본 포스터 (2.8MB, 웹에서 미사용)
```

## 디자인 기준

`muteno/creative` 의 `DESIGN.md` — Paper & Ink 모노크롬, Anton / Jost / Pretendard 3서체,
값은 전부 `tokens.css` 변수. 새 색·크기를 임의로 추가하지 않는다.

## 수정 방법

내용(작가·제목·연도·재료·크기)은 `index.html` 의 `.info` 블록에서만 고친다.
스타일은 `assets/css/label.css`. 커밋 → push 하면 GitHub Pages 가 자동 반영한다.

## 배포

Settings → Pages → Source: **Deploy from a branch** / Branch: `main` / Folder: `/ (root)`
