(function () {
  const prefix = window.PLAYBOOK_ID || "workshop-playbook";
  const STORAGE = {
    skill: prefix + "-skill",
    step: prefix + "-step",
    checks: prefix + "-checks",
    quizzes: prefix + "-quizzes",
  };

  const SKILL_LABEL = {
    beginner: "New to hardware",
    some: "Some electronics",
    expert: "I know ESP32",
  };

  const state = {
    skill: localStorage.getItem(STORAGE.skill) || "",
    index: Number(localStorage.getItem(STORAGE.step) || 0),
    checks: readJson(STORAGE.checks, {}),
    quizzes: readJson(STORAGE.quizzes, {}),
    facilitator: new URLSearchParams(location.search).get("role") === "facilitator",
  };

  const steps = flattenSteps(window.PLAYBOOK.modules);
  if (state.index < 0 || state.index >= steps.length) state.index = 0;

  const els = {
    overlay: document.getElementById("skill-overlay"),
    nav: document.getElementById("sidebar-nav"),
    view: document.getElementById("step-view"),
    back: document.getElementById("btn-back"),
    next: document.getElementById("btn-next"),
    hint: document.getElementById("nav-hint"),
    fill: document.getElementById("progress-fill"),
    label: document.getElementById("progress-label"),
    badge: document.getElementById("skill-badge"),
    sidebar: document.getElementById("sidebar"),
    menu: document.getElementById("menu-btn"),
    close: document.getElementById("sidebar-close"),
    drawer: document.getElementById("pin-drawer"),
    gate: document.getElementById("gate-banner"),
    gateText: document.getElementById("gate-banner-text"),
  };

  if (state.facilitator) document.body.classList.add("facilitator-on");
  applyMeta();

  document.querySelectorAll(".skill-pick").forEach((btn) => {
    btn.addEventListener("click", () => setSkill(btn.dataset.skill));
  });
  document.getElementById("change-skill").addEventListener("click", () => showSkillPicker(true));
  document.getElementById("reset-progress").addEventListener("click", resetProgress);
  document.getElementById("pin-map-btn").addEventListener("click", () => setHidden(els.drawer, false));
  document.getElementById("pin-map-close").addEventListener("click", () => setHidden(els.drawer, true));
  els.drawer.addEventListener("click", (e) => {
    if (e.target === els.drawer) setHidden(els.drawer, true);
  });
  els.back.addEventListener("click", () => go(-1));
  els.next.addEventListener("click", tryNext);
  els.menu.addEventListener("click", () => toggleSidebar(true));
  els.close.addEventListener("click", () => toggleSidebar(false));

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") tryNext();
  });

  els.view.addEventListener("click", onViewClick);
  els.view.addEventListener("change", onViewChange);
  els.view.addEventListener("input", onViewInput);

  if (!state.skill) {
    showSkillPicker(true);
  } else {
    showSkillPicker(false);
    document.body.dataset.skill = state.skill;
    render();
  }

  function applyMeta() {
    const meta = window.PLAYBOOK_META || {};
    if (meta.title) {
      document.title = meta.title + " — Workshop Playbook";
      const brand = document.querySelector(".brand-title");
      if (brand) brand.textContent = meta.title;
    }
    if (meta.kicker) {
      const kicker = document.querySelector(".brand-kicker");
      if (kicker) kicker.textContent = meta.kicker;
    }
    if (meta.overlayEyebrow) {
      const el = document.querySelector("#skill-overlay .eyebrow");
      if (el) el.textContent = meta.overlayEyebrow;
    }
    if (meta.overlayTitle) {
      const el = document.querySelector("#skill-overlay h1");
      if (el) el.textContent = meta.overlayTitle;
    }
    if (meta.overlayLede) {
      const el = document.querySelector("#skill-overlay .lede");
      if (el) el.textContent = meta.overlayLede;
    }
    if (meta.skillLabels) {
      Object.assign(SKILL_LABEL, meta.skillLabels);
    }
    if (meta.skills && meta.skills.length) {
      const grid = document.querySelector(".skill-grid");
      if (grid) {
        grid.innerHTML = meta.skills
          .map(
            (s) =>
              `<button type="button" class="skill-pick" data-skill="${s.id}">` +
              `<span class="skill-kicker">${s.kicker}</span>` +
              `<strong>${s.title}</strong>` +
              `<span>${s.blurb}</span></button>`
          )
          .join("");
      }
    }
    if (meta.referenceTitle) {
      const el = document.querySelector(".drawer-card h2");
      if (el) el.textContent = meta.referenceTitle;
    }
    if (meta.referenceNote) {
      const el = document.querySelector(".drawer-card .note");
      if (el) el.textContent = meta.referenceNote;
    }
    if (meta.referenceRows && meta.referenceRows.length) {
      const body = document.querySelector(".drawer-card tbody");
      if (body) {
        body.innerHTML = meta.referenceRows
          .map((row) => "<tr>" + row.map((cell) => `<td>${cell}</td>`).join("") + "</tr>")
          .join("");
      }
    }
  }

  function flattenSteps(modules) {
    const out = [];
    modules.forEach((mod) => {
      mod.steps.forEach((step) => {
        out.push({ ...step, moduleId: mod.id, moduleTitle: mod.title });
      });
    });
    return out;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") || fallback;
    } catch {
      return fallback;
    }
  }

  function setHidden(el, hidden) {
    if (hidden) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function showSkillPicker(show) {
    setHidden(els.overlay, !show);
  }

  function setSkill(skill) {
    state.skill = skill;
    localStorage.setItem(STORAGE.skill, skill);
    document.body.dataset.skill = skill;
    showSkillPicker(false);
    render();
  }

  function resetProgress() {
    if (!confirm("Clear checkpoints and start from the first step?")) return;
    state.index = 0;
    state.checks = {};
    state.quizzes = {};
    localStorage.setItem(STORAGE.step, "0");
    localStorage.setItem(STORAGE.checks, "{}");
    localStorage.setItem(STORAGE.quizzes, "{}");
    render();
  }

  function toggleSidebar(open) {
    els.sidebar.classList.toggle("open", open);
    document.body.classList.toggle("sidebar-open", open);
  }

  function go(delta) {
    const next = state.index + delta;
    if (next < 0 || next >= steps.length) return;
    if (delta > 0 && !canAdvance(steps[state.index])) {
      showGate(blockerText(steps[state.index]));
      return;
    }
    hideGate();
    state.index = next;
    localStorage.setItem(STORAGE.step, String(state.index));
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function tryNext() {
    const step = steps[state.index];
    if (!canAdvance(step)) {
      showGate(blockerText(step));
      return;
    }
    if (state.index === steps.length - 1) {
      showGate("You have finished every step. There is no next page — stay here and use Back if you want to review.", false);
      els.hint.textContent = "Workshop complete. Stay on this page.";
      return;
    }
    go(1);
  }

  function canAdvance(step) {
    if (step.quiz && !state.quizzes[step.id]) return false;
    if (step.checkpoint && !state.checks[step.id]) return false;
    return true;
  }

  function blockerText(step) {
    if (step.quiz && !state.quizzes[step.id]) {
      return "Answer the question on this page first. Next will not change the page until you do.";
    }
    if (step.checkpoint && !state.checks[step.id]) {
      return "Tick the checkpoint box after you finish this work. Next will not change the page until it is ticked.";
    }
    return "Finish this step before continuing. You will stay on this page.";
  }

  function showGate(text, highlight = true) {
    els.gateText.textContent = text;
    setHidden(els.gate, false);
    els.hint.textContent = text;
    els.hint.style.color = "#b45309";
    if (highlight) {
      const box = els.view.querySelector(".checkpoint, .quiz");
      if (box) {
        box.classList.remove("needs-attention");
        void box.offsetWidth;
        box.classList.add("needs-attention");
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    els.gate.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideGate() {
    setHidden(els.gate, true);
    els.hint.style.color = "";
  }

  function render() {
    const step = steps[state.index];
    els.badge.textContent = SKILL_LABEL[state.skill] || "Skill";
    els.label.textContent = `Step ${state.index + 1} of ${steps.length}`;
    els.fill.style.width = `${((state.index + 1) / steps.length) * 100}%`;
    els.back.disabled = state.index === 0;
    els.next.disabled = false;
    els.next.textContent = state.index === steps.length - 1 ? "Done" : "Next";
    els.hint.textContent = canAdvance(step)
      ? "Checkpoint done. Click Next only when you are ready — ticking the box does not change the page."
      : "Do the work, then tick the checkpoint. Clicking Next early keeps you on this page.";
    hideGate();
    renderNav();
    renderStep(step);
    toggleSidebar(false);
  }

  function renderNav() {
    els.nav.innerHTML = "";
    window.PLAYBOOK.modules.forEach((mod) => {
      const label = document.createElement("p");
      label.className = "mod-label";
      label.textContent = mod.title;
      els.nav.appendChild(label);
      mod.steps.forEach((step) => {
        const i = steps.findIndex((s) => s.id === step.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nav-step";
        if (i === state.index) btn.classList.add("active");
        if (i < state.index) btn.classList.add("done");
        btn.innerHTML = `<span class="nav-idx">${String(i + 1).padStart(2, "0")}</span><span>${step.title}</span>`;
        btn.addEventListener("click", () => {
          if (i > state.index) {
            for (let n = state.index; n < i; n += 1) {
              if (!canAdvance(steps[n])) {
                showGate("Finish and tick the checkpoint on this page first. The playbook will not jump ahead.");
                return;
              }
            }
          }
          hideGate();
          state.index = i;
          localStorage.setItem(STORAGE.step, String(state.index));
          render();
        });
        els.nav.appendChild(btn);
      });
    });
  }

  function renderStep(step) {
    const quizHtml = step.quiz ? renderQuiz(step) : "";
    const checkHtml = step.checkpoint ? renderCheckpoint(step) : "";
    const facHtml = step.facilitator
      ? `<aside class="facilitator"><strong>Facilitator</strong><p>${step.facilitator}</p></aside>`
      : "";

    els.view.innerHTML = `
      <p class="step-kicker">${step.moduleTitle}</p>
      <h1>${step.title}</h1>
      ${step.html}
      ${quizHtml}
      ${checkHtml}
      ${facHtml}
    `;
  }

  function renderQuiz(step) {
    const done = !!state.quizzes[step.id];
    const buttons = step.quiz.choices
      .map(
        (choice) =>
          `<button type="button" data-choice="${escapeAttr(choice)}">${choice}</button>`
      )
      .join("");
    return `
      <section class="quiz" data-quiz-id="${step.id}" data-answer="${escapeAttr(step.quiz.answer)}">
        <h3>${step.quiz.prompt}</h3>
        <div class="choice-row">${buttons}</div>
        <p class="quiz-feedback"${done ? "" : " hidden"}>${done ? step.quiz.explain : ""}</p>
      </section>
    `;
  }

  function renderCheckpoint(step) {
    const checked = state.checks[step.id] ? "checked" : "";
    return `
      <section class="checkpoint">
        <h3>Checkpoint</h3>
        <label>
          <input type="checkbox" data-check="${step.id}" ${checked} />
          <span>${step.checkpoint}</span>
        </label>
      </section>
    `;
  }

  function onViewClick(e) {
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const block = copyBtn.closest(".code-block");
      const text = block.querySelector("pre").innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1200);
      });
      return;
    }

    const choice = e.target.closest("[data-choice]");
    if (choice) {
      const quiz = choice.closest(".quiz");
      const answer = quiz.dataset.answer;
      const picked = choice.dataset.choice;
      const feedback = quiz.querySelector(".quiz-feedback");
      const step = steps[state.index];
      quiz.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.classList.remove("correct", "wrong");
      });
      if (picked === answer) {
        choice.classList.add("correct");
        state.quizzes[step.id] = true;
        localStorage.setItem(STORAGE.quizzes, JSON.stringify(state.quizzes));
        feedback.hidden = false;
        feedback.textContent = step.quiz.explain;
        hideGate();
        els.hint.textContent = canAdvance(step)
          ? "Question done. Click Next when you are ready — this page will not change by itself."
          : "Answer saved. Tick the checkpoint, then click Next.";
      } else {
        choice.classList.add("wrong");
        feedback.hidden = false;
        feedback.textContent = step.quiz.wrong || "Not that one — try again.";
      }
      return;
    }

    const simBtn = e.target.closest("[data-sim-toggle]");
    if (simBtn) {
      const root = simBtn.closest(".simulator");
      const beam = root.querySelector(".sim-beam");
      const status = root.querySelector(".sim-status");
      const broken = beam.classList.toggle("off");
      status.textContent = broken ? "INTRUDER DETECTED" : "NORMAL";
      status.classList.toggle("alert", broken);
      status.classList.toggle("ok", !broken);
      simBtn.textContent = broken ? "Restore the beam" : "Wave a hand through the beam";
    }
  }

  function onViewChange(e) {
    const box = e.target.closest("[data-check]");
    if (!box) return;
    const id = box.dataset.check;
    if (box.checked) state.checks[id] = true;
    else delete state.checks[id];
    localStorage.setItem(STORAGE.checks, JSON.stringify(state.checks));
    const step = steps[state.index];
    const ready = canAdvance(step);
    els.hint.textContent = ready
      ? "Checkpoint ticked. You are still on this page — click Next when you want to continue."
      : blockerText(step);
    els.hint.style.color = "";
    if (ready) hideGate();
    const wrap = box.closest(".checkpoint");
    if (wrap) wrap.classList.toggle("needs-attention", !box.checked);
  }

  function onViewInput(e) {
    if (!e.target.closest(".threshold-tool")) return;
    const tool = e.target.closest(".threshold-tool");
    const on = Number(tool.querySelector("[data-th-on]").value);
    const off = Number(tool.querySelector("[data-th-off]").value);
    const out = tool.querySelector(".th-result");
    if (!Number.isFinite(on) || !Number.isFinite(off) || tool.querySelector("[data-th-on]").value === "" || tool.querySelector("[data-th-off]").value === "") {
      out.textContent = "Enter both readings from Serial Monitor.";
      return;
    }
    const mid = Math.round((on + off) / 2);
    if (off > on) {
      out.textContent = `Use const int THRESHOLD = ${mid};  (intruder when lightValue > THRESHOLD)`;
    } else if (on > off) {
      out.textContent = `Your module is inverted (beam-on is darker). Midpoint is ${mid}. Flip the comparison to lightValue < THRESHOLD, or swap what you treat as ON/OFF.`;
    } else {
      out.textContent = "The two numbers are the same — cover the LDR more fully and read again.";
    }
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }
})();
