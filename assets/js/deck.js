/* ═════════════════════════════════════════════
   deck.js — 3페이지 스크롤 제어
   모션 기준: creative/assets/js/main.js 의 book 모드
   · 제스처 1회 = 1페이지 플립, 0.9s power2.inOut
   · 제스처 판정은 이벤트 간격 90ms 갭으로만 (잠금·쿨다운 없음)
   모바일은 CSS scroll-snap(mandatory)이 네이티브로 처리한다.
   ═════════════════════════════════════════════ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pages = Array.prototype.slice.call(document.querySelectorAll(".pg"));
  if (!pages.length) return;

  /* ── 등장(리빌) — 1회만 ───────────────────
     콘텐츠가 안 보이는 사고를 막는 게 최우선이다:
     · 첫 화면 안에 있는 요소는 관찰하지 않고 즉시 노출
     · 관찰 대상도 1.2초 뒤에는 무조건 노출(안전장치) */
  (function reveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".r"));
    var show = function (el) { el.classList.add("in"); };

    if (!("IntersectionObserver" in window)) { els.forEach(show); return; }

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var pending = [];
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) show(el);   /* 첫 화면에 걸치면 즉시 */
      else pending.push(el);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0 });
    pending.forEach(function (el) { io.observe(el); });

    setTimeout(function () { els.forEach(show); }, 1200);  /* 안전장치 */
  })();

  /* ── 페이지 인디케이터 ──────────────────── */
  var dotEls = [];
  var current = 0;

  var pageTop = function (i) { return pages[i].getBoundingClientRect().top + window.scrollY; };
  var setDot = function (i) {
    dotEls.forEach(function (d, j) {
      d.classList.toggle("is-active", j === i);
      d.setAttribute("aria-current", j === i ? "true" : "false");
    });
  };

  var flipping = false;

  /* power2.inOut 과 동일한 곡선 (cubic in-out) */
  var easeInOutCubic = function (p) {
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  };

  var flipTo = function (i) {
    i = Math.max(0, Math.min(pages.length - 1, i));
    var target = pageTop(i);
    if (flipping || (i === current && Math.abs(window.scrollY - target) < 4)) return;
    flipping = true;
    current = i;
    setDot(i);

    if (reduced) {
      docEl.classList.add("snap-off");
      window.scrollTo(0, target);
      docEl.classList.remove("snap-off");
      flipping = false;
      return;
    }

    var from = window.scrollY;
    var dist = target - from;
    var dur = 900;
    var t0 = null;

    docEl.classList.add("snap-off"); /* 네이티브 스냅과 충돌 방지 */

    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      window.scrollTo(0, from + dist * easeInOutCubic(p));
      if (p < 1) { requestAnimationFrame(step); }
      else {
        docEl.classList.remove("snap-off");
        flipping = false;
      }
    };
    requestAnimationFrame(step);
  };

  if (pages.length > 1) {
    var dots = document.createElement("nav");
    dots.className = "deck-dots";
    dots.setAttribute("aria-label", "페이지 이동");
    var names = ["작품", "기획글", "전시", "작가"];
    pages.forEach(function (pg, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", (i + 1) + "페이지 · " + (names[i] || ""));
      b.addEventListener("click", function () { flipTo(i); });
      dots.appendChild(b);
    });
    document.body.appendChild(dots);
    dotEls = Array.prototype.slice.call(dots.querySelectorAll("button"));
    setDot(0);
  }

  /* 현재 페이지 추적 (네이티브 스크롤·스와이프 포함) */
  if ("IntersectionObserver" in window) {
    var ioPage = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !flipping) {
          var i = pages.indexOf(e.target);
          if (i > -1) { current = i; setDot(i); }
        }
      });
    }, { threshold: 0.55 });
    pages.forEach(function (pg) { ioPage.observe(pg); });
  }

  /* ── 휠: 제스처 1회 = 1페이지 (데스크톱) ─── */
  var isDesktop = function () { return window.matchMedia("(min-width: 901px) and (min-aspect-ratio: 1/1)").matches; };
  var lastWheelT = -1000;

  window.addEventListener("wheel", function (e) {
    if (!isDesktop() || reduced) return;
    if (document.querySelector("dialog[open]")) return;

    /* 뷰포트보다 긴 면(기획글)은 그 안에서 네이티브 스크롤을 허용한다 */
    var cur = pages[current];
    if (cur && cur.offsetHeight > window.innerHeight + 4) {
      var rc = cur.getBoundingClientRect();
      if (e.deltaY > 0 && rc.bottom > window.innerHeight + 4) return;
      if (e.deltaY < 0 && rc.top < -4) return;
    }

    e.preventDefault();
    var fresh = (e.timeStamp - lastWheelT) > 90; /* 새 제스처 판정 */
    lastWheelT = e.timeStamp;
    if (flipping || !fresh) return;
    if (Math.abs(e.deltaY) < 4) return;
    flipTo(current + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* ── 키보드 ─────────────────────────────── */
  window.addEventListener("keydown", function (e) {
    if (document.querySelector("dialog[open]")) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); flipTo(current + 1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); flipTo(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); flipTo(0); }
    else if (e.key === "End") { e.preventDefault(); flipTo(pages.length - 1); }
  });

  /* ── 기획글 모달 (아래 → 위) ────────────── */
  (function noteSheet() {
    var dlg = document.getElementById("notedlg");
    var src = document.querySelector(".note-body");
    var slot = dlg && dlg.querySelector("[data-note-clone]");
    if (!dlg || !src || !slot || typeof dlg.showModal !== "function") return;

    slot.innerHTML = src.innerHTML;   /* 기획글 면의 본문을 그대로 복제 */

    var open = function () { dlg.showModal(); slot.scrollTop = 0; };
    var close = function () {
      if (reduced) { dlg.close(); return; }
      dlg.classList.add("closing");
      setTimeout(function () { dlg.close(); dlg.classList.remove("closing"); }, 380);
    };

    document.querySelectorAll("[data-note-open]").forEach(function (b) { b.addEventListener("click", open); });
    var x = dlg.querySelector("[data-note-close]");
    if (x) x.addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  })();

  /* ── 포스터 확대 ────────────────────────── */
  (function zoom() {
    var dlg = document.getElementById("zoom");
    if (!dlg || typeof dlg.showModal !== "function") return;

    var open = function () {
      if (document.startViewTransition && !reduced) document.startViewTransition(function () { dlg.showModal(); });
      else dlg.showModal();
    };
    var close = function () {
      if (document.startViewTransition && !reduced) document.startViewTransition(function () { dlg.close(); });
      else dlg.close();
    };

    var btn = document.querySelector("[data-zoom]");
    if (btn) btn.addEventListener("click", open);
    var x = dlg.querySelector("[data-close]");
    if (x) x.addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  })();
})();
