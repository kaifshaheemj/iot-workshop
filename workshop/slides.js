(function () {
  const img = document.getElementById("slide-img");
  const fallback = document.getElementById("fallback");
  const count = document.getElementById("slide-count");
  const titleEl = document.getElementById("deck-title");
  const dots = document.getElementById("dots");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const stage = document.getElementById("stage");

  const state = { images: [], index: 0, title: "Morning theory" };

  document.getElementById("btn-fullscreen").addEventListener("click", toggleFullscreen);
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));

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
    if (e.key === "End" && state.images.length) {
      state.index = state.images.length - 1;
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
    state.images = deck.images || [];
    titleEl.textContent = state.title;
    document.title = state.title + " — Morning slides";
    render();
  });

  async function loadDeck() {
    const probed = await probeImages();
    const numberedRaster = probed.some((url) => /\.(png|jpe?g|webp)$/i.test(url));
    if (numberedRaster) {
      return { title: state.title, images: probed };
    }
    try {
      const res = await fetch("slides.json");
      if (res.ok) {
        const data = await res.json();
        if (data.title) state.title = data.title;
        if (data.images && data.images.length) {
          return { title: data.title || state.title, images: data.images };
        }
      }
    } catch (_) {
      /* file:// may block fetch; numbered images still load via probe */
    }
    return { title: state.title, images: probed };
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
    const exts = ["png", "jpg", "jpeg", "webp", "svg"];
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
    if (!state.images.length) return;
    const next = state.index + delta;
    if (next < 0 || next >= state.images.length) return;
    state.index = next;
    render();
  }

  function render() {
    const total = state.images.length;
    if (!total) {
      img.hidden = true;
      fallback.hidden = false;
      dots.hidden = true;
      count.textContent = "No slides yet";
      btnPrev.disabled = true;
      btnNext.disabled = true;
      return;
    }
    fallback.hidden = true;
    img.hidden = false;
    img.src = state.images[state.index];
    img.alt = "Slide " + (state.index + 1) + " of " + total;
    count.textContent = "Slide " + (state.index + 1) + " of " + total;
    btnPrev.disabled = state.index === 0;
    btnNext.disabled = state.index === total - 1;
    dots.hidden = false;
    dots.innerHTML = state.images
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
