(function () {
  const img = document.getElementById("slide-img");
  const htmlSlide = document.getElementById("html-slide");
  const fallback = document.getElementById("fallback");
  const count = document.getElementById("slide-count");
  const titleEl = document.getElementById("deck-title");
  const dots = document.getElementById("dots");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const stage = document.getElementById("stage");

  const PREP = (window.PREPBOOK_SLIDES || []).map((slide) => ({
    type: "html",
    theme: slide.theme || "",
    htmlFull: slide.htmlFull || "",
    kicker: slide.kicker,
    title: slide.title,
    html: slide.html,
  }));

  const state = { items: [], index: 0, title: "From Sensors to Smart Systems" };

  document.getElementById("btn-fullscreen").addEventListener("click", toggleFullscreen);
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));
  img.addEventListener("error", () => {
    const item = state.items[state.index];
    if (item && item.type === "img") {
      item.type = "html";
      item.kicker = "Morning presentation";
      item.title = "Slide image could not load";
      item.html = "<p>Restore the numbered presentation images under <code>slides/images/</code>, then refresh.</p>";
      render();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "f" || e.key === "F") toggleFullscreen();
    if (e.key === "Home") {
      state.index = 0;
      render();
    }
    if (e.key === "End" && state.items.length) {
      state.index = state.items.length - 1;
      render();
    }
  });

  let touchX = null;
  stage.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  stage.addEventListener(
    "touchend",
    (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 40) return;
      go(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );

  loadDeck().then((deck) => {
    state.title = deck.title || state.title;
    state.items = deck.items || [];
    titleEl.textContent = state.title;
    document.title = state.title + " — Presentation";
    render();
  });

  async function loadDeck() {
    const probed = await probeImages();
    const rasters = probed.filter((url) => /\.(png|jpe?g|webp)$/i.test(url));
    if (rasters.length) {
      return { title: state.title, items: rasters.map((src) => ({ type: "img", src })) };
    }
    return { title: state.title, items: PREP };
  }

  function probeOne(url) {
    return new Promise((resolve) => {
      const test = new Image();
      test.onload = () => resolve(true);
      test.onerror = () => resolve(false);
      test.src = url;
    });
  }

  async function probeImages() {
    const exts = ["png", "jpg", "jpeg", "webp"];
    const found = [];
    for (let i = 1; i <= 80; i += 1) {
      const n = String(i).padStart(2, "0");
      let url = null;
      for (let e = 0; e < exts.length; e += 1) {
        const candidate = "slides/images/" + n + "." + exts[e];
        if (await probeOne(candidate)) {
          url = candidate;
          break;
        }
      }
      if (!url) break;
      found.push(url);
    }
    return found;
  }

  function go(delta) {
    if (!state.items.length) return;
    const next = state.index + delta;
    if (next < 0) return;
    if (next >= state.items.length) {
      location.href = "index.html";
      return;
    }
    state.index = next;
    render();
  }

  function render() {
    const total = state.items.length;
    if (!total) {
      img.hidden = true;
      htmlSlide.hidden = true;
      fallback.hidden = false;
      dots.hidden = true;
      count.textContent = "No slides yet";
      btnPrev.disabled = true;
      btnNext.disabled = true;
      return;
    }

    const item = state.items[state.index];
    const last = state.index === total - 1;
    fallback.hidden = true;
    count.textContent = "Slide " + (state.index + 1) + " of " + total;
    btnPrev.disabled = state.index === 0;
    btnNext.disabled = false;
    btnNext.textContent = last ? "Playbook" : "Next";

    if (item.type === "img") {
      htmlSlide.hidden = true;
      img.hidden = false;
      img.alt = "Slide " + (state.index + 1) + " of " + total;
      img.src = item.src;
    } else {
      img.hidden = true;
      htmlSlide.hidden = false;
      htmlSlide.className = "html-slide " + (item.theme || "");
      if (item.htmlFull) {
        htmlSlide.innerHTML = item.htmlFull;
      } else {
        htmlSlide.innerHTML =
          '<p class="eyebrow">' +
          (item.kicker || "Morning presentation") +
          "</p><h1>" +
          (item.title || "") +
          "</h1>" +
          (item.html || "");
      }
    }

    dots.hidden = false;
    dots.innerHTML = state.items
      .map((_, i) => {
        const current = i === state.index ? ' aria-current="true"' : "";
        return '<button type="button" data-i="' + i + '"' + current + ' aria-label="Slide ' + (i + 1) + '"></button>';
      })
      .join("");
    dots.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.index = Number(btn.dataset.i);
        render();
      });
    });
  }

  function toggleFullscreen() {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      if (root.requestFullscreen) root.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
})();
