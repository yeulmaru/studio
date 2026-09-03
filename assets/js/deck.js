/* ═════════════════════════════════════════════
   deck.js — 5페이지 스크롤 제어 · 01 사진 슬라이더 · 03 유튜브
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

  var smoothTo = function (targetY, dur, done) {
    var from = window.scrollY;
    var dist = targetY - from;
    var t0 = null;
    docEl.classList.add("snap-off");
    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      window.scrollTo(0, from + dist * easeInOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
      else { docEl.classList.remove("snap-off"); if (done) done(); }
    };
    requestAnimationFrame(step);
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
    var names = ["작품", "기획글", "영상", "전시", "작가"];
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

  /* ── 02 기획글: 문단 단위로 넘기기 ─────────
     화면에 걸친 "마지막 문단"을 그때그때 계산해서 타이틀 바로 아래로 올린다.
     폰 크기에 따라 그 문단이 3번째든 4번째든 실측으로 판별한다. */
  var notePage = (function () {
    var sec = document.getElementById("p2");
    if (!sec) return { next: function () { return false; }, prev: function () { return false; }, atEnd: function () { return true; }, atStart: function () { return true; } };

    var paras = Array.prototype.slice.call(sec.querySelectorAll(".note-body p"));
    var head = sec.querySelector(".note-head");
    var body = sec.querySelector(".note-body");
    var busy = false;

    var headH = function () { return head ? head.getBoundingClientRect().height : 0; };

    /* 마지막 문단도 화면 맨 위까지 올라올 수 있게 본문 뒤에 여백을 만든다 */
    var spacer = null;
    if (body && paras.length) {
      spacer = document.createElement("div");
      spacer.setAttribute("aria-hidden", "true");
      spacer.className = "note-spacer";
      body.appendChild(spacer);
    }
    var sizeSpacer = function () {
      if (!spacer) return;
      var last = paras[paras.length - 1];
      var need = window.innerHeight - headH() - last.offsetHeight - 48;
      spacer.style.height = Math.max(0, Math.round(need)) + "px";
    };
    sizeSpacer();
    window.addEventListener("resize", function () { clearTimeout(spacer && spacer._t); if (spacer) spacer._t = setTimeout(sizeSpacer, 180); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeSpacer);
    var secTop = function () { return sec.getBoundingClientRect().top + window.scrollY; };

    /* 화면에 조금이라도 걸쳐 있는 문단 중 마지막 것 */
    var lastVisible = function () {
      var vh = window.innerHeight, top = headH(), found = null;
      paras.forEach(function (p) {
        var r = p.getBoundingClientRect();
        if (r.top < vh - 6 && r.bottom > top + 6) found = p;
      });
      return found;
    };
    var firstVisible = function () {
      var vh = window.innerHeight, top = headH();
      for (var i = 0; i < paras.length; i++) {
        var r = paras[i].getBoundingClientRect();
        if (r.top < vh - 6 && r.bottom > top + 6) return paras[i];
      }
      return null;
    };

    var scrollToPara = function (p) {
      busy = true;
      p.classList.add("is-mark");
      var y = p.getBoundingClientRect().top + window.scrollY - headH() - 12;
      var maxY = secTop() + sec.offsetHeight - window.innerHeight;
      y = Math.max(secTop(), Math.min(y, maxY));
      smoothTo(y, 820, function () {
        setTimeout(function () { p.classList.remove("is-mark"); busy = false; }, 280);
      });
    };

    var atEnd = function () {
      var r = sec.getBoundingClientRect();
      return r.bottom <= window.innerHeight + 6;
    };
    var atStart = function () {
      return sec.getBoundingClientRect().top >= -6;
    };

    return {
      atEnd: atEnd,
      atStart: atStart,
      next: function () {
        if (busy) return true;
        var lastP = paras[paras.length - 1];
        /* 마지막 문단이 이미 맨 위에 정렬돼 있으면 곧장 다음 면으로 */
        if (Math.abs(lastP.getBoundingClientRect().top - headH() - 12) < 26) return false;
        if (atEnd()) return false;
        var p = lastVisible();
        if (!p) return false;
        var r = p.getBoundingClientRect();
        if (Math.abs(r.top - headH() - 12) < 26) {   /* 이미 맨 위면 그 다음 문단 */
          var i = paras.indexOf(p);
          if (i >= paras.length - 1) return false;
          p = paras[i + 1];
        }
        scrollToPara(p);
        return true;
      },
      prev: function () {
        if (busy) return true;
        if (atStart()) return false;
        var p = firstVisible();
        if (!p) return false;
        var i = paras.indexOf(p);
        var r = p.getBoundingClientRect();
        if (Math.abs(r.top - headH() - 12) < 8) i -= 1;
        if (i < 0) { smoothTo(secTop(), 760, function () {}); return true; }
        scrollToPara(paras[i]);
        return true;
      },
      /* 모바일: 손을 뗀 뒤 가장 가까운 문단 경계로 정렬 */
      settle: function () {
        if (busy || atEnd() || atStart()) return;
        var lastP = paras[paras.length - 1];
        if (Math.abs(lastP.getBoundingClientRect().top - headH() - 12) < 26) return;  /* 끝에 도달 — 다음 면에 양보 */
        var top = headH() + 12, best = null, bestD = 1e9;
        paras.forEach(function (p) {
          var d = Math.abs(p.getBoundingClientRect().top - top);
          if (d < bestD) { bestD = d; best = p; }
        });
        if (best && bestD > 6 && bestD < window.innerHeight * 0.62) scrollToPara(best);
      }
    };
  })();

  /* 모바일: 스와이프가 끝나면 문단 경계로 정렬 */
  var settleT = null;
  window.addEventListener("scroll", function () {
    if (isDesktop() || current !== 1) return;
    clearTimeout(settleT);
    settleT = setTimeout(function () { notePage.settle(); }, 180);
  }, { passive: true });

  /* ── 휠: 제스처 1회 = 1페이지 (데스크톱) ─── */
  var isDesktop = function () { return window.matchMedia("(min-width: 901px) and (min-aspect-ratio: 1/1)").matches; };
  var lastWheelT = -1000;

  window.addEventListener("wheel", function (e) {
    if (reduced) return;
    if (document.querySelector("dialog[open]")) return;
    if (Math.abs(e.deltaY) < 4) return;

    var fresh = (e.timeStamp - lastWheelT) > 90; /* 새 제스처 판정 */

    /* 02 기획글 — 화면비와 무관하게 문단 단위로 넘긴다 */
    if (current === 1) {
      lastWheelT = e.timeStamp;
      if (flipping) { e.preventDefault(); return; }
      if (!fresh) { e.preventDefault(); return; }
      if (e.deltaY > 0 ? notePage.next() : notePage.prev()) { e.preventDefault(); return; }
      /* 문단을 다 봤으면 다음/이전 면으로 */
      e.preventDefault();
      flipTo(current + (e.deltaY > 0 ? 1 : -1));
      return;
    }

    if (!isDesktop()) return;
    e.preventDefault();
    lastWheelT = e.timeStamp;
    if (flipping || !fresh) return;
    flipTo(current + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* ── 키보드 ─────────────────────────────── */
  window.addEventListener("keydown", function (e) {
    if (document.querySelector("dialog[open]")) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); flipTo(current + 1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); flipTo(current - 1); }
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && current === 0 && window.deckSlider) {
      e.preventDefault(); window.deckSlider.go(e.key === "ArrowRight" ? 1 : -1);
    }
    else if (e.key === "Home") { e.preventDefault(); flipTo(0); }
    else if (e.key === "End") { e.preventDefault(); flipTo(pages.length - 1); }
  });

  /* ── [기획글 보기] → 노란불 켜고 02면으로 ── */
  (function noteGo() {
    var sec = document.getElementById("p2");
    if (!sec) return;
    document.querySelectorAll("[data-note-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.classList.add("is-go");          /* 버튼 노란불 */
        sec.classList.add("is-loading");     /* 도착지 타이틀도 노란불 */
        flipTo(1);
        var hold = reduced ? 120 : 1240;     /* 플립(0.9s) + 안착 여유 */
        setTimeout(function () {
          btn.classList.remove("is-go");
          sec.classList.remove("is-loading");
        }, hold);
      });
    });
  })();


  /* ── 01 작품 사진 슬라이더 ─────────────────
     [data-slider] 안의 .w-slide 를 가로로 넘긴다.
     · 좌우 스와이프(세로 스크롤과 구분: 가로 이동이 더 클 때만)
     · 우하단 ‹ › 버튼 + "1 / N" 카운터
     · data-autoplay="ms" 가 있으면 자동 넘김, 손대면 타이머 재시작
     · 한 장이면 아무것도 안 붙인다 */
  (function slider() {
    var root = document.querySelector("[data-slider]");
    if (!root) return;
    var track = root.querySelector(".w-track");
    var slides = track ? Array.prototype.slice.call(track.querySelectorAll(".w-slide")) : [];
    if (slides.length < 2) return;

    var idx = 0, timer = null;
    var ms = parseInt(root.getAttribute("data-autoplay"), 10) || 0;

    var ctl = document.createElement("div");
    ctl.className = "w-ctl";
    var mk = function (dir, label) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.innerHTML = dir < 0
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
      b.addEventListener("click", function () { go(dir); });
      return b;
    };
    var count = document.createElement("span");
    count.className = "w-count";
    count.setAttribute("aria-live", "polite");
    ctl.appendChild(mk(-1, "이전 사진"));
    ctl.appendChild(count);
    ctl.appendChild(mk(1, "다음 사진"));
    root.appendChild(ctl);

    var render = function () {
      track.style.transform = "translate3d(-" + (idx * 100) + "%, 0, 0)";
      count.textContent = (idx + 1) + " / " + slides.length;
      slides.forEach(function (sl, i) { sl.setAttribute("aria-hidden", i === idx ? "false" : "true"); });
    };
    var restart = function () {
      if (timer) clearInterval(timer);
      if (ms > 0 && !reduced) timer = setInterval(function () { idx = (idx + 1) % slides.length; render(); }, ms);
    };
    var go = function (dir) {
      idx = (idx + dir + slides.length) % slides.length;
      render();
      restart();
    };

    /* 스와이프 — 가로 이동이 세로보다 클 때만 슬라이더가 가져간다 */
    var sx = null, sy = null, horiz = false;
    root.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; horiz = false;
    }, { passive: true });
    root.addEventListener("touchmove", function (e) {
      if (sx === null) return;
      var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (!horiz && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) horiz = true;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = sy = null;
      if (horiz && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      horiz = false;
    });

    /* 자동 넘김은 1면이 보일 때만 돈다 */
    if (ms > 0 && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) restart();
          else if (timer) { clearInterval(timer); timer = null; }
        });
      }, { threshold: 0.5 }).observe(root);
    } else restart();

    render();
    window.deckSlider = { go: go };
  })();

  /* ── 03 유튜브 ──────────────────────────────
     [data-youtube] 값에서 영상 ID를 뽑아 iframe 을 만든다.
     watch?v= / youtu.be / shorts / embed / live / 11자리 ID 모두 허용.
     비어 있거나 못 읽으면 "준비 중" 자리표시자. */
  (function youtube() {
    var boxes = document.querySelectorAll("[data-youtube]");
    if (!boxes.length) return;
    var parse = function (u) {
      u = (u || "").trim();
      if (!u) return null;
      if (/^[\w-]{11}$/.test(u)) return u;
      var m = u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
      return m ? m[1] : null;
    };
    boxes.forEach(function (box) {
      var id = parse(box.getAttribute("data-youtube"));
      if (!id) {
        var ph = document.createElement("div");
        ph.className = "v-empty";
        ph.textContent = "Video — coming soon";
        box.appendChild(ph);
        return;
      }
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1";
      f.title = box.getAttribute("data-title") || "YouTube video";
      f.loading = "lazy";
      f.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      f.setAttribute("allowfullscreen", "");
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      box.appendChild(f);

      /* 정보 칸에 [YouTube에서 보기] 링크 */
      var info = box.parentNode && box.parentNode.querySelector(".v-info");
      if (info && !info.querySelector(".v-link")) {
        var a = document.createElement("a");
        a.className = "v-link";
        a.href = "https://www.youtube.com/watch?v=" + id;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = '<span class="nb-bracket" aria-hidden="true">[</span>YouTube에서 보기<span class="nb-bracket" aria-hidden="true">]</span>';
        info.appendChild(a);
      }
    });
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
