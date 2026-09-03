/* ═════════════════════════════════════════════
   page.js — 이 페이지의 내용 전부. 여기만 고친다.
   이미지 경로는 이 폴더 기준 (img/…). webp 는 있으면 적고 없으면 줄을 지운다.
   비워 두는 항목은 화면에서 자동으로 빠진다.
   ═════════════════════════════════════════════ */
window.PAGE = {
  series: "창작스튜디오 7기 입주작가",           // 좌상단 고정 타이틀 앞머리
  description: "안민환, 〈풍경조각 : 토대를 까는 일〉, 2026, 흙·잔디, 가변설치. GS칼텍스 예울마루 창작스튜디오 7기 입주작가전.",
  descriptionEn: "Minhwan An, Landscape Sculpture: Laying the Foundation, 2026, soil and grass, dimensions variable.",

  /* ── 01 작품 ── */
  work: {
    title: "풍경조각 : 토대를 까는 일",          // " : " 는 자동으로 흐린 콜론이 된다
    titleEn: "Landscape Sculpture: Laying the Foundation",
    year: "2026",
    material: "흙, 잔디, 가변설치",
    materialEn: "Soil, Grass, Dimensions variable",
    statement: "땅의 표면을 들어 올려, 풍경이 딛고 있던 토대를 드러낸다.",
    autoplay: 5000,                                // ms 간격으로 자동 넘김. 0 이면 손으로만 넘김
    images: [                                      // 순서대로 슬라이드. 가로 사진은 자동으로 잘리지 않게(contain) 표시
      { src: "img/work.jpg", webp: "img/work.webp", width: 3000, height: 4000,
        alt: "잔디밭의 흙과 잔디 층을 들어 올려 흰 기둥으로 받쳐 세운 안민환의 야외 설치 작품" },
      { src: "img/work-01.jpg", webp: "img/work-01.webp", width: 1600, height: 1078, alt: "잔디밭 위 흙·잔디 조각들을 위에서 내려다본 항공 사진" },
      { src: "img/work-02.jpg", webp: "img/work-02.webp", width: 1600, height: 1066, alt: "잔디광장에 아치 형태로 들어 올려진 흙·잔디 조각들" },
      { src: "img/work-03.jpg", webp: "img/work-03.webp", width: 1600, height: 1198, alt: "푸른 하늘 아래 흩어진 아치형 풍경조각" },
      { src: "img/work-04.jpg", webp: "img/work-04.webp", width: 1600, height: 1066, alt: "장도 잔디광장 전경과 풍경조각 설치 모습" },
      { src: "img/work-05.jpg", webp: "img/work-05.webp", width: 1600, height: 1066, alt: "풍경조각 여러 점이 이어진 잔디광장" },
      { src: "img/work-06.jpg", webp: "img/work-06.webp", width: 1600, height: 1066, alt: "아치 아래로 뒤편 풍경이 비치는 설치 전경" },
      { src: "img/work-07.jpg", webp: "img/work-07.webp", width: 1600, height: 1066, alt: "들어 올린 잔디층 아치 근접" },
      { src: "img/work-08.jpg", webp: "img/work-08.webp", width: 1600, height: 1066, alt: "하늘을 향해 솟은 아치형 풍경조각" },
      { src: "img/work-09.jpg", webp: "img/work-09.webp", width: 1600, height: 1066, alt: "흙과 잔디 단면 디테일" },
      { src: "img/work-10.jpg", webp: "img/work-10.webp", width: 1600, height: 1066, alt: "흰 기둥으로 받쳐 세운 흙·잔디 조각" },
      { src: "img/work-11.jpg", webp: "img/work-11.webp", width: 1600, height: 1066, alt: "기울어져 솟은 잔디 조각의 측면" },
      { src: "img/work-12.jpg", webp: "img/work-12.webp", width: 1600, height: 1066, alt: "나무 그늘 앞에 세워진 풍경조각" }
    ]
  },

  /* ── 02 기획글 ── */
  note: {
    title: "기획글",
    button: "기획글 보기",
    paragraphs: [
      "우리가 바라보는 풍경은 과연 어디에서 시작될까. 바다 위에 흩어진 섬들은 서로 떨어져 있는 존재처럼 보이지만, 바다 아래에서는 하나의 대지로 이어져 있다. 《풍경 조각: 토대를 까는 일》은 이처럼 눈에 보이지 않는 연결을 드러내며, 익숙한 풍경을 새로운 시선으로 바라보도록 제안한다.",
      "안민환의 조각은 ‘우리는 무엇으로부터 시작이 되는가’라는 질문에서 출발한다. 그의 작업에는 생성과 소멸, 몸과 공간, 기억과 풍경이 자주 등장하는데, 이는 각각 독립된 주제라기보다 인간이 세계를 경험하고 삶을 형성해 가는 여정을 탐구하기 위한 단일한 조형 언어로 수렴된다. 그는 신체가 도구가 되는 퍼포먼스적 행위를 통해 걷고, 오르고, 파고, 드러내는 과정, 즉 노동이 집약된 작업 방식을 고수한다. 이러한 반복적인 방식은 스스로 시작점(태초의 발견)을 찾아가는 수행에 가깝다.",
      "그는 오랫동안 CUT-OUT 작업을 통해 형태를 자르고, 들어 올리는 조형 언어를 발전시켜 왔다. 이번 전시에서는 그 대상이 특정 크기의 조각을 넘어 대지 전체로 확장된다. 잔디와 땅을 절개하고 걷어내는 행위를 통해 익숙한 대지는 작품의 재료이자, 캔버스로 전환된다. 들춰진 땅 아래 드러난 흙은 새로운 생성의 가능성과 소멸의 필연성을 품고, 비워진 공간은 하늘과 숲, 바다를 담아내며 주변 환경을 작품 속으로 끌어들인다. 이렇듯 그의 풍경 조각은 고정된 물체가 아니라 자연과 시간, 그리고 관람자의 경험이 함께 완성해 가는 열린 조각이 된다.",
      "바다와 육지가 맞닿으며 끊임없이 경계를 바꾸는 장도의 장소성은 그의 작업을 심화하는 배경이 된다. 작가는 이곳의 지질학적 구조를 CUT-OUT의 조형 원리와 연결 지으며, 섬을 고립된 대상이 아닌 같은 토대 위에 서로 다른 모습으로 이어지는 풍경으로 바라본다. 이와 같은 시각은 우리가 당연하게 여겼던 경계와 구분을 환기하고, 나아가 자연과 인간 또한 동일한 세계 안에서 서로 맞닿은 존재임을 보여준다.",
      "여수세계섬박람회 개최를 기념하여 마련된 《풍경 조각: 토대를 까는 일》은 감춰져 있던 토대를 드러내고, 그 위에서 형성되는 관계와 연결을 발견하는 전시이다. 관람자는 작품의 형태만을 바라보기보다, 변형된 토대와 그 안에 비워진 공간, 그리고 그곳을 채우는 하늘과 바람, 빛의 변화를 천천히 따라가며 풍경을 하나의 조각으로 경험하게 된다. 그렇게 걷고 머무는 시간 속에서 자연과 인간, 섬과 대지, 생성과 소멸이 하나의 토대 위에서 서로 이어져 있음을 새롭게 깨닫게 될 것이다. 여수세계섬박람회라는 뜻깊은 계기를 맞아 장도를 찾는 모든 관람자에게, 이번 전시가 섬이라는 토대 위에서 펼쳐지는 새로운 감각적 경험의 지평을 열어주는 특별한 순간이 되기를 기대한다."
    ]
  },

  /* ── 03 영상 ── */
  video: {
    youtube: "https://www.youtube.com/watch?v=-onQljHv9NY",   // watch / youtu.be / shorts / 11자리 ID 모두 OK. 비우면 "coming soon"
    title: "작가 인터뷰",
    description: "창작스튜디오 7기 입주작가 안민환 인터뷰. 〈풍경조각 : 토대를 까는 일〉이 시작된 자리에 대해.",
    note: "* 영상은 YouTube에서 재생됩니다."
  },

  /* ── 04 전시 ── */
  exhibition: {
    kicker: "GS칼텍스 예울마루 창작스튜디오",
    title: "7기 입주작가전_안민환",                   // "_" 는 흐린 밑줄 기호로
    subtitle: "〈풍경조각 : 토대를 까는 일〉",
    poster: { src: "img/poster.jpg", webp: "img/poster.webp", width: 1536, height: 2048, alt: "전시 포스터 — 풍경조각 : 토대를 까는 일" },
    spec: [                                          // "—" 로 구간, 요일(Tue/Sun)은 자동 장식
      { label: "Period", ko: "기간", value: "2026. 08. 25 Tue — 10. 25 Sun" },
      { label: "Hours",  ko: "운영시간", value: "09:00 — 22:00",
        note: "* 물때에 따라 변동 · 휴장",
        link: { text: "장도 물때 확인", url: "https://www.yeulmaru.org/community/v/1733/" } },
      { label: "Venue",  ko: "장소", value: "GS칼텍스 예울마루, 장도 잔디광장" }
    ]
  },

  /* ── 05 작가 ── */
  artist: {
    name: "안민환",
    nameEn: "Minhwan An",
    born: "1988",
    genre: "조각",
    photo: { src: "img/artist.jpg", webp: "img/artist.webp", width: 1333, height: 2000, alt: "작가 안민환" },
    statement: "조각을 통해 신체와 풍경의 관계, 확장되는 공간성을 탐구한다.",
    cv: [
      "개인전 《CUT—OUT》(2024) 외 3회",
      "신한갤러리(2024) · 문래예술공장(2023) 그룹전",
      "울산북구예술창작소(2018) · 모하창작스튜디오(2017) 레지던시"
    ]
  },

  footer: { wordmark: "Creative Studio.", copy: "(c) 2023-26. GS Caltex Yeulmaru. all rights reserved." }
};
