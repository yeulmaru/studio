/* ═════════════════════════════════════════════
   page.js — 이 페이지의 내용 전부. 여기만 고친다.
   1) _template 폴더를 복사해서 이름을 바꾼다 (예: 2). URL 은 /studio/2/
   2) img/ 에 사진을 넣는다. 파일명은 자유 — 아래 경로만 맞추면 된다.
   3) 아래 값을 채운다. 비워 두는 항목은 화면에서 자동으로 빠진다.
   ═════════════════════════════════════════════ */
window.PAGE = {
  series: "창작스튜디오 N기 입주작가",
  description: "작가명, 〈작품명〉, 2026, 재료, 크기. GS칼텍스 예울마루 창작스튜디오 N기 입주작가전.",
  descriptionEn: "Artist Name, Work Title, 2026, materials, dimensions.",

  /* ── 01 작품 ── */
  work: {
    title: "작품명",
    titleEn: "Work Title in English",
    year: "2026",
    material: "재료, 크기",
    materialEn: "Materials, Dimensions",
    statement: "작품을 한 줄로 설명하는 스테이트먼트.",
    autoplay: 0,                                   // ms. 0 이면 수동. 예: 5000
    images: [                                      // 순서대로 슬라이드. 원하는 만큼 추가
      { src: "img/work-01.jpg", alt: "작품 사진 1" },
      { src: "img/work-02.jpg", alt: "작품 사진 2" },
      { src: "img/work-03.jpg", alt: "작품 사진 3" }
    ]
  },

  /* ── 02 기획글 ── */
  note: {
    title: "기획글",
    button: "기획글 보기",
    paragraphs: [
      "첫 문단.",
      "두 번째 문단.",
      "세 번째 문단."
    ]
  },

  /* ── 03 영상 ── */
  video: {
    youtube: "",                                   // 유튜브 링크. 비우면 "coming soon"
    title: "작품 영상",
    description: "영상에 대한 한두 줄 설명.",
    note: "* 영상은 YouTube에서 재생됩니다."
  },

  /* ── 04 전시 ── */
  exhibition: {
    kicker: "GS칼텍스 예울마루 창작스튜디오",
    title: "N기 입주작가전_작가명",
    subtitle: "〈작품명〉",
    poster: { src: "img/poster.jpg", alt: "전시 포스터" },
    spec: [
      { label: "Period", ko: "기간", value: "2026. 00. 00 Mon — 00. 00 Sun" },
      { label: "Hours",  ko: "운영시간", value: "09:00 — 22:00" },
      { label: "Venue",  ko: "장소", value: "GS칼텍스 예울마루, 장소" }
    ]
  },

  /* ── 05 작가 ── */
  artist: {
    name: "작가명",
    nameEn: "Artist Name",
    born: "0000",
    genre: "장르",
    photo: { src: "img/artist.jpg", alt: "작가 사진" },
    statement: "작가 소개 한 줄.",
    cv: [
      "주요 이력 1",
      "주요 이력 2",
      "주요 이력 3"
    ]
  },

  footer: { wordmark: "Creative Studio.", copy: "(c) 2023-26. GS Caltex Yeulmaru. all rights reserved." }
};
