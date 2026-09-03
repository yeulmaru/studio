/* ═════════════════════════════════════════════
   render.js — window.PAGE 객체 → 5면 마크업
   각 페이지의 page.js 가 window.PAGE 를 정의하면
   이 파일이 <main class="deck"> 안을 채운다. deck.js 보다 먼저 실행.
   여기서 만드는 마크업은 label.css 의 클래스와 1:1 로 맞춰져 있다.
   ═════════════════════════════════════════════ */
(function () {
  "use strict";
  var P = window.PAGE;
  var main = document.querySelector("main.deck");
  if (!P || !main) return;

  /* ── 유틸 ─────────────────────────────────── */
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  /* "풍경조각 : 토대를 까는 일" → 콜론을 흐리게 */
  var colon = function (s) {
    return esc(s).replace(/\s*:\s*/g, ' <span class="colon" aria-hidden="true">:</span> ');
  };
  var br = function (s) { return esc(s).replace(/\n/g, "<br>"); };
  /* "2026. 08. 25 Tue — 10. 25 Sun" / "09:00 — 22:00" → 요일·대시 장식 */
  var spec = function (v) {
    return esc(v)
      .split(/\s*[—–~]\s*/)
      .map(function (part) {
        return part.replace(/\s+(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/gi, '<span class="dow">$1</span>');
      })
      .join('<span class="dash" aria-hidden="true">—</span>');
  };
  var pic = function (im, imgAttrs) {
    if (!im) return "";
    if (typeof im === "string") im = { src: im };
    var h = "<picture>";
    if (im.webp) h += '<source srcset="' + esc(im.webp) + '" type="image/webp">';
    h += '<img src="' + esc(im.src) + '"' +
      (im.width ? ' width="' + esc(im.width) + '"' : "") +
      (im.height ? ' height="' + esc(im.height) + '"' : "") +
      ' alt="' + esc(im.alt || "") + '" decoding="async"' + (imgAttrs || "") + ">";
    return h + "</picture>";
  };
  var list = function (arr, fn) { return (arr || []).map(fn).join(""); };
  var bracket = function (t) {
    return '<span class="nb-bracket" aria-hidden="true">[</span>' + esc(t) + '<span class="nb-bracket" aria-hidden="true">]</span>';
  };

  var W = P.work || {}, N = P.note || {}, V = P.video || {}, E = P.exhibition || {}, A = P.artist || {};
  var images = W.images || [];
  var first = images[0];
  var titleKo = W.title || "";
  var artistKo = A.name || "";

  /* ── <head> ───────────────────────────────── */
  var docTitle = P.title || (titleKo + (artistKo ? " — " + artistKo : ""));
  document.title = docTitle;
  var setMeta = function (sel, val) { var m = document.querySelector(sel); if (m && val) m.setAttribute("content", val); };
  setMeta('meta[name="description"]', P.description);
  setMeta('meta[property="og:title"]', docTitle);
  setMeta('meta[property="og:description"]', P.descriptionEn || P.description);
  if (first) setMeta('meta[property="og:image"]', typeof first === "string" ? first : first.src);

  /* ── 좌상단 고정 타이틀 ────────────────────── */
  var fh = document.querySelector(".fixhead");
  if (fh) {
    var fhKo = (P.header && P.header.ko) || (P.series ? P.series + " " : "") + artistKo + " 〈" + titleKo + "〉";
    var fhEn = (P.header && P.header.en) || W.titleEn || "";
    fh.innerHTML = '<p class="fh-ko">' + colon(fhKo) + "</p>" + (fhEn ? '<p class="fh-en">' + esc(fhEn) + "</p>" : "");
  }

  /* ── 01 · 작품 ────────────────────────────── */
  var slides = list(images, function (im, i) {
    if (typeof im === "string") im = { src: im };
    var attrs = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
    /* 가로 사진(width > height)은 잘라내지 않고 통째로 보여준다 (contain). fit: "cover"|"contain" 으로 직접 지정도 가능 */
    var fit = im.fit || (im.width && im.height && im.width > im.height ? "contain" : "cover");
    return pic(im, attrs).replace("<picture>", '<picture class="w-slide w-slide--' + fit + '">');
  });
  var work =
    '<section class="pg pg--work" id="p1" aria-label="작품">' +
      '<figure class="w-photo r" data-slider' + (W.autoplay ? ' data-autoplay="' + esc(W.autoplay) + '"' : "") +
        ' aria-roledescription="carousel" aria-label="작품 사진"><div class="w-track">' + slides + "</div></figure>" +
      '<figcaption class="w-cap r">' +
        '<p class="label label--muted">01 — Artwork</p>' +
        '<p class="cap-ko" lang="ko">' +
          '<span class="c-artist">' + esc(artistKo) + "</span>" +
          '<span class="c-title">' + colon(titleKo) + (W.year ? '<span class="c-year">(' + esc(W.year) + ")</span>" : "") + "</span>" +
          (W.material ? '<span class="c-mat">' + esc(W.material) + "</span>" : "") +
        "</p>" +
        (W.titleEn ? '<p class="cap-en">' + esc(A.nameEn || "") +
          '<span class="ce-sep" aria-hidden="true">·</span><em>' + esc(W.titleEn) + "</em>" +
          (W.materialEn ? '<span class="ce-sep" aria-hidden="true">·</span>' + esc(W.materialEn) : "") + "</p>" : "") +
      "</figcaption>" +
      '<div class="w-note r">' +
        '<button class="note-btn" type="button" data-note-go>' + bracket(N.button || "기획글 보기") + "</button>" +
        (W.statement ? '<p class="wn-ko" lang="ko">' + esc(W.statement) + "</p>" : "") +
      "</div>" +
    "</section>";

  /* ── 02 · 기획글 ──────────────────────────── */
  var note =
    '<section class="pg pg--note" id="p2" aria-labelledby="t-note">' +
      '<div class="note-head">' +
        '<p class="label label--muted">02 — Curatorial Note</p>' +
        '<h2 class="note-title" id="t-note" lang="ko">' + esc(N.title || "기획글") + "</h2>" +
      "</div>" +
      '<div class="note-body" lang="ko">' + list(N.paragraphs, function (p) { return "<p>" + br(p) + "</p>"; }) + "</div>" +
    "</section>";

  /* ── 03 · 영상 ────────────────────────────── */
  var video =
    '<section class="pg pg--video" id="p3" aria-labelledby="t-video">' +
      '<p class="label label--muted r">03 — Video</p>' +
      '<div class="v-body">' +
        '<div class="v-frame r" data-youtube="' + esc(V.youtube || "") + '" data-title="' + esc(V.title || docTitle) + '"></div>' +
        '<div class="v-info r">' +
          '<h2 class="v-ko" id="t-video" lang="ko">' + esc(V.title || "작품 영상") + "</h2>" +
          (V.description ? '<p class="v-desc" lang="ko">' + br(V.description) + "</p>" : "") +
          (V.note ? '<p class="v-note" lang="ko">' + esc(V.note) + "</p>" : "") +
        "</div>" +
      "</div>" +
    "</section>";

  /* ── 04 · 전시 ────────────────────────────── */
  var rows = list(E.spec, function (r) {
    return '<div class="spec-row">' +
      "<dt>" + (r.label ? '<span class="label">' + esc(r.label) + "</span>" : "") +
        (r.ko ? '<span class="ko" lang="ko">' + esc(r.ko) + "</span>" : "") + "</dt>" +
      "<dd>" + '<span class="v" lang="ko">' + spec(r.value || "") + "</span>" +
        (r.note || r.link ? '<span class="v-note" lang="ko">' + esc(r.note || "") +
          (r.link ? ' <a class="v-link" href="' + esc(r.link.url) + '" target="_blank" rel="noopener noreferrer">' + bracket(r.link.text || r.link.url) + "</a>" : "") +
          "</span>" : "") +
      "</dd></div>";
  });
  var exh =
    '<section class="pg pg--exh" id="p4" aria-labelledby="t-exh">' +
      '<p class="label label--muted r">04 — Exhibition</p>' +
      '<div class="exh-body">' +
        (E.poster ? '<figure class="e-poster r">' +
          '<button class="poster-btn" type="button" aria-label="포스터 크게 보기" data-zoom>' + pic(E.poster, ' loading="lazy"') + "</button>" +
          '<p class="hint"><span class="hint--tap">포스터를 탭하면 확대</span><span class="hint--click">포스터를 클릭하면 확대</span></p>' +
        "</figure>" : "") +
        '<div class="e-info">' +
          (E.kicker ? '<p class="e-kicker" lang="ko">' + esc(E.kicker) + "</p>" : "") +
          '<h2 class="e-ko" id="t-exh" lang="ko">' +
            esc(E.title || "").replace(/_/g, '<span class="us" aria-hidden="true">_</span>') +
            (E.subtitle ? '<br><span class="nb">' + colon(E.subtitle) + "</span>" : "") +
          "</h2>" +
          '<dl class="spec r">' + rows + "</dl>" +
        "</div>" +
      "</div>" +
    "</section>";

  /* ── 05 · 작가 ────────────────────────────── */
  var artist =
    '<section class="pg pg--artist" id="p5" aria-labelledby="t-artist">' +
      '<p class="label label--muted r">05 — Artist</p>' +
      '<div class="a-body">' +
        (A.photo ? '<figure class="a-photo r">' + pic(A.photo, ' loading="lazy"') + "</figure>" : "") +
        '<div class="a-info">' +
          '<h2 class="display a-name" id="t-artist">' + esc(A.nameEn || artistKo).replace(/ /g, "&nbsp;") + "</h2>" +
          '<p class="a-ko" lang="ko">' + esc(artistKo) +
            (A.born || A.genre ? '<span class="born">' + (A.born ? "b.&nbsp;" + esc(A.born) : "") + (A.born && A.genre ? " · " : "") + esc(A.genre || "") + "</span>" : "") +
          "</p>" +
          (A.statement ? '<p class="a-stmt" lang="ko">' + esc(A.statement) + "</p>" : "") +
          (A.cv && A.cv.length ? '<ul class="a-cv" lang="ko">' + list(A.cv, function (c) { return "<li>" + esc(c) + "</li>"; }) + "</ul>" : "") +
        "</div>" +
      "</div>" +
      '<footer class="site-foot">' +
        '<p class="wordmark">' + esc((P.footer && P.footer.wordmark) || "Creative Studio.") + "</p>" +
        '<p class="foot-copy">' + esc((P.footer && P.footer.copy) || "(c) 2023-26. GS Caltex Yeulmaru. all rights reserved.") + "</p>" +
      "</footer>" +
    "</section>";

  main.innerHTML = work + note + video + exh + artist;

  /* ── 포스터 확대 다이얼로그 ────────────────── */
  var zoom = document.getElementById("zoom");
  if (zoom && E.poster) {
    var z = typeof E.poster === "string" ? { src: E.poster } : E.poster;
    zoom.insertAdjacentHTML("beforeend", pic({ src: z.src, webp: z.webp, alt: "전시 포스터 확대" }, ' loading="lazy"'));
  }
})();
