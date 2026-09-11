(function () {
  const THEME_KEY = "iot-workshop-theme";
  const prefix = window.PLAYBOOK_ID || "iot-day";
  const STORAGE = {
    step: prefix + "-step",
    checks: prefix + "-checks",
    quizzes: prefix + "-quizzes",
    visited: prefix + "-visited",
    afternoon: prefix + "-afternoon",
  };
  const params = new URLSearchParams(location.search);
  const UNLOCK = (window.PLAYBOOK_META && window.PLAYBOOK_META.unlockCode) || "AFTERNOON";
  const state = {
    index: Number(localStorage.getItem(STORAGE.step) || 0),
    checks: readJson(STORAGE.checks, {}),
    quizzes: readJson(STORAGE.quizzes, {}),
    visited: readJson(STORAGE.visited, {}),
    facilitator: params.get("role") === "facilitator",
    afternoon: false,
  };

  if (params.get("phase") === "afternoon") localStorage.setItem(STORAGE.afternoon, "1");
  state.afternoon =
    state.facilitator ||
    params.get("phase") === "afternoon" ||
    localStorage.getItem(STORAGE.afternoon) === "1";

  let steps = computeSteps();
  if (state.facilitator && params.get("step")) {
    const previewIndex = steps.findIndex((step) => step.id === params.get("step"));
    if (previewIndex >= 0) state.index = previewIndex;
  }
  let reactionTimer = 0;
  let reactionState = "idle";
  let reactionGoAt = 0;
  let reactionTarget = -1;

  const els = {
    nav: document.getElementById("sidebar-nav"),
    view: document.getElementById("step-view"),
    back: document.getElementById("btn-back"),
    next: document.getElementById("btn-next"),
    hint: document.getElementById("nav-hint"),
    fill: document.getElementById("progress-fill"),
    label: document.getElementById("progress-label"),
    sidebar: document.getElementById("sidebar"),
    menu: document.getElementById("menu-btn"),
    close: document.getElementById("sidebar-close"),
    drawer: document.getElementById("pin-drawer"),
    gate: document.getElementById("gate-banner"),
    gateText: document.getElementById("gate-banner-text"),
    currentPhase: document.getElementById("current-phase"),
    currentModule: document.getElementById("current-module"),
    sidebarProgress: document.getElementById("sidebar-progress"),
    themeToggle: document.getElementById("theme-toggle"),
  };

  if (state.facilitator) document.body.classList.add("facilitator-on");
  syncThemeToggle();
  applyMeta();
  bindEvents();
  render();

  function bindEvents() {
    document.getElementById("reset-progress").addEventListener("click", resetProgress);
    els.themeToggle.addEventListener("click", toggleTheme);
    window.addEventListener("storage", syncThemeFromStorage);
    document.getElementById("pin-map-btn").addEventListener("click", () => setHidden(els.drawer, false));
    document.getElementById("pin-map-close").addEventListener("click", () => setHidden(els.drawer, true));
    els.drawer.addEventListener("click", (event) => {
      if (event.target === els.drawer) setHidden(els.drawer, true);
    });
    els.back.addEventListener("click", () => go(-1));
    els.next.addEventListener("click", tryNext);
    els.menu.addEventListener("click", () => toggleSidebar(true));
    els.close.addEventListener("click", () => toggleSidebar(false));
    els.view.addEventListener("click", onViewClick);
    els.view.addEventListener("change", onViewChange);
    els.view.addEventListener("input", onViewInput);
    els.view.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.matches("[data-unlock-input]")) {
        event.preventDefault();
        tryUnlock(event.target.value);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setHidden(els.drawer, true);
        toggleSidebar(false);
        return;
      }
      if (event.target.matches("input, textarea, button, a, summary")) return;
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") tryNext();
    });
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function setTheme(theme, persist) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
    }
    syncThemeToggle();
  }

  function syncThemeToggle() {
    const light = currentTheme() === "light";
    els.themeToggle.textContent = light ? "Dark mode" : "Light mode";
    els.themeToggle.setAttribute("aria-pressed", String(light));
    els.themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  }

  function toggleTheme() {
    setTheme(currentTheme() === "light" ? "dark" : "light", true);
  }

  function syncThemeFromStorage(event) {
    if (event.key === THEME_KEY && (event.newValue === "light" || event.newValue === "dark")) {
      setTheme(event.newValue, false);
    }
  }

  function afternoonOpen() {
    return state.afternoon || state.facilitator;
  }

  function computeSteps() {
    return flattenSteps(
      window.PLAYBOOK.modules.filter((module) => module.phase !== "afternoon" || afternoonOpen())
    );
  }

  function flattenSteps(modules) {
    const result = [];
    modules.forEach((module) => {
      module.steps.forEach((step, moduleIndex) => {
        result.push({
          ...step,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleIndex,
          moduleLength: module.steps.length,
          phase: module.phase || "morning",
          phaseLabel: module.phaseLabel || (module.phase === "afternoon" ? "Hands-on" : "Morning"),
        });
      });
    });
    return result;
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
    if (meta.referenceTitle) document.querySelector(".drawer-card h2").textContent = meta.referenceTitle;
    renderReference();
  }

  function renderReference() {
    const meta = window.PLAYBOOK_META || {};
    const useAfternoon = afternoonOpen() && meta.afternoonReferenceRows;
    const rows = useAfternoon ? meta.afternoonReferenceRows : meta.referenceRows;
    const note = useAfternoon ? meta.afternoonReferenceNote : meta.referenceNote;
    if (note) document.querySelector(".drawer-card .note").textContent = note;
    if (rows && rows.length) {
      document.querySelector(".drawer-card tbody").innerHTML = rows
        .map((row) => "<tr>" + row.map((cell) => `<td>${cell}</td>`).join("") + "</tr>")
        .join("");
    }
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") || fallback;
    } catch {
      return fallback;
    }
  }

  function setHidden(element, hidden) {
    if (hidden) element.setAttribute("hidden", "");
    else element.removeAttribute("hidden");
  }

  function resetProgress() {
    if (!confirm("Clear every checkpoint and return to the first step?")) return;
    state.index = 0;
    state.checks = {};
    state.quizzes = {};
    state.visited = {};
    localStorage.setItem(STORAGE.step, "0");
    localStorage.setItem(STORAGE.checks, "{}");
    localStorage.setItem(STORAGE.quizzes, "{}");
    localStorage.setItem(STORAGE.visited, "{}");
    render();
    scrollStepTop();
  }

  function toggleSidebar(open) {
    els.sidebar.classList.toggle("open", open);
    document.body.classList.toggle("sidebar-open", open);
  }

  function tryUnlock(raw) {
    const typed = String(raw || "").trim().toUpperCase();
    const feedback = els.view.querySelector("[data-unlock-feedback]");
    if (typed !== String(UNLOCK).toUpperCase()) {
      if (feedback) {
        feedback.textContent = "That code does not match. Wait for the facilitator and try again.";
        feedback.classList.add("error");
      }
      return;
    }

    state.afternoon = true;
    state.checks.unlock = true;
    localStorage.setItem(STORAGE.afternoon, "1");
    localStorage.setItem(STORAGE.checks, JSON.stringify(state.checks));
    steps = computeSteps();
    const firstLab = steps.findIndex((step) => step.phase === "afternoon");
    if (firstLab >= 0) state.index = firstLab;
    localStorage.setItem(STORAGE.step, String(state.index));
    renderReference();
    render();
    scrollStepTop();
  }

  function go(delta) {
    const nextIndex = state.index + delta;
    if (nextIndex < 0 || nextIndex >= steps.length) return;
    if (delta > 0 && !canAdvance(steps[state.index])) {
      showGate(blockerText(steps[state.index]));
      return;
    }
    hideGate();
    state.index = nextIndex;
    localStorage.setItem(STORAGE.step, String(state.index));
    render();
    scrollStepTop();
  }

  function tryNext() {
    const step = steps[state.index];
    if (!canAdvance(step)) {
      showGate(blockerText(step));
      return;
    }
    if (state.index === steps.length - 1) {
      const text = afternoonOpen()
        ? "Workshop complete. Use Previous or the workshop map to revisit any experiment."
        : "Morning is complete. The build lab opens when your facilitator gives the code.";
      showGate(text, false);
      els.hint.textContent = text;
      return;
    }
    go(1);
  }

  function canAdvance(step) {
    if (step.phase === "afternoon") return true;
    if (step.quiz && !state.quizzes[step.id]) return false;
    if (step.checkpoint && !state.checks[step.id]) return false;
    return true;
  }

  function hasRequirement(step) {
    if (step.phase === "afternoon") return false;
    return Boolean(step.quiz || step.checkpoint);
  }

  function isComplete(step, index) {
    if (step.phase === "afternoon") return Boolean(state.visited[step.id]);
    return hasRequirement(step) ? canAdvance(step) : index < state.index;
  }

  function blockerText(step) {
    if (step.quiz && !state.quizzes[step.id]) return "Answer the quick check before continuing.";
    if (step.checkpoint && !state.checks[step.id]) return "Finish the experiment, then tick the checkpoint before continuing.";
    return "Finish this step before continuing.";
  }

  function showGate(text, highlight) {
    const shouldHighlight = highlight === undefined ? true : highlight;
    els.gateText.textContent = text;
    setHidden(els.gate, false);
    els.hint.textContent = text;
    if (shouldHighlight) {
      const box = els.view.querySelector(".checkpoint, .quiz");
      if (box) {
        box.classList.remove("needs-attention");
        void box.offsetWidth;
        box.classList.add("needs-attention");
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function hideGate() {
    setHidden(els.gate, true);
  }

  function scrollStepTop() {
    els.view.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    clearTimeout(reactionTimer);
    reactionState = "idle";
    steps = computeSteps();
    if (state.index < 0 || state.index >= steps.length) state.index = 0;
    const step = steps[state.index];
    if (step.phase === "afternoon" && !state.visited[step.id]) {
      state.visited[step.id] = true;
      localStorage.setItem(STORAGE.visited, JSON.stringify(state.visited));
    }
    const completed = steps.filter((item, index) => isComplete(item, index)).length;

    els.label.textContent = `Step ${state.index + 1} of ${steps.length}${step.duration ? ` · ${step.duration}` : ""}`;
    els.fill.style.width = `${((state.index + 1) / steps.length) * 100}%`;
    els.currentPhase.textContent = step.phaseLabel;
    els.currentModule.textContent = step.moduleTitle;
    els.sidebarProgress.textContent = `${completed}/${steps.length} complete`;
    els.back.disabled = state.index === 0;
    els.next.disabled = false;
    els.next.textContent = state.index === steps.length - 1 ? "Finish" : "Continue";
    els.hint.textContent = !hasRequirement(step)
      ? "Review this step, then continue."
      : canAdvance(step)
        ? "Checkpoint complete. Continue when ready."
        : step.quiz && !state.quizzes[step.id]
          ? "Complete the quick check to continue."
          : "Complete the work and tick the checkpoint.";

    hideGate();
    renderNav();
    renderStep(step);
    renderReference();
    toggleSidebar(false);
  }

  function goToUnlock() {
    const index = steps.findIndex((step) => step.id === "unlock");
    if (index < 0) return;
    if (!canJumpTo(index)) {
      toggleSidebar(false);
      showGate("Complete each morning checkpoint before opening the build lab.");
      return;
    }
    state.index = index;
    localStorage.setItem(STORAGE.step, String(state.index));
    render();
    scrollStepTop();
  }

  function canJumpTo(targetIndex) {
    const target = steps[targetIndex];
    if (target && target.phase === "afternoon" && afternoonOpen()) return true;
    if (targetIndex <= state.index) return true;
    for (let index = state.index; index < targetIndex; index += 1) {
      if (!canAdvance(steps[index])) return false;
    }
    return true;
  }

  function renderNav() {
    els.nav.innerHTML = "";
    let lockedRendered = false;
    let exercisesRendered = false;

    window.PLAYBOOK.modules.forEach((module) => {
      const locked = module.phase === "afternoon" && !afternoonOpen();
      if (locked) {
        if (lockedRendered) return;
        lockedRendered = true;
        const lockCard = document.createElement("button");
        lockCard.type = "button";
        lockCard.className = "afternoon-lock";
        lockCard.innerHTML = `<span class="lock-icon" aria-hidden="true"></span><span><small>Hands-on build lab</small><strong>Three POCs locked</strong><em>Open after lunch with the facilitator code</em></span>`;
        lockCard.addEventListener("click", goToUnlock);
        els.nav.appendChild(lockCard);
        return;
      }

      if (module.id.startsWith("exercise-")) {
        if (exercisesRendered) return;
        exercisesRendered = true;
        renderExerciseGroup();
        return;
      }

      renderModuleNav(module);
    });
  }

  function moduleEntries(module) {
    return module.steps
      .map((item) => {
        const index = steps.findIndex((step) => step.id === item.id);
        return { item: index >= 0 ? steps[index] : item, index };
      })
      .filter(({ index }) => index >= 0);
  }

  function renderModuleNav(module) {
    const entries = moduleEntries(module);
    if (!entries.length) return;
    const active = entries.some(({ index }) => index === state.index);
    const completed = entries.filter(({ item, index }) => isComplete(item, index)).length;
    const details = createNavModule(
      module.phaseLabel || (module.phase === "afternoon" ? "Hands-on" : "Morning"),
      module.title,
      completed,
      entries.length,
      active
    );
    const list = details.querySelector(".module-steps");
    entries.forEach(({ item, index }) => list.appendChild(createNavButton(item, index)));
    els.nav.appendChild(details);
  }

  function renderExerciseGroup() {
    const modules = window.PLAYBOOK.modules.filter((module) => module.id.startsWith("exercise-"));
    const entries = modules.flatMap(moduleEntries);
    const exercises = modules.filter((module) => /^exercise-[1-8]$/.test(module.id));
    const active = entries.some(({ index }) => index === state.index);
    const completed = exercises.filter((module) =>
      moduleEntries(module).every(({ item, index }) => isComplete(item, index))
    ).length;
    const details = createNavModule("Morning · practice", "Exercises 1–8", completed, exercises.length, active);
    details.classList.add("exercise-group");
    const list = details.querySelector(".module-steps");

    modules.forEach((module) => {
      const moduleItems = moduleEntries(module);
      const moduleCompleted = moduleItems.filter(({ item, index }) => isComplete(item, index)).length;
      const label = document.createElement("p");
      label.className = "nav-submodule-label";
      if (moduleItems.some(({ index }) => index === state.index)) label.classList.add("active");
      label.innerHTML = `<strong>${module.title}</strong><span>${moduleCompleted}/${moduleItems.length}</span>`;
      list.appendChild(label);
      moduleItems.forEach(({ item, index }) => list.appendChild(createNavButton(item, index)));
    });

    els.nav.appendChild(details);
  }

  function createNavModule(phase, title, completed, total, active) {
    const details = document.createElement("details");
    details.className = "nav-module";
    details.open = active;
    if (active) details.classList.add("current");
    if (completed === total) details.classList.add("complete");
    details.innerHTML = `<summary><span><small>${phase}</small><strong>${title}</strong></span><em>${completed}/${total}</em></summary><div class="module-steps"></div>`;
    return details;
  }

  function createNavButton(item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-step";
    if (index === state.index) {
      button.classList.add("active");
      button.setAttribute("aria-current", "step");
    }
    if (isComplete(item, index)) button.classList.add("done");
    if (!canJumpTo(index)) button.classList.add("unavailable");
    button.innerHTML = `<span class="nav-idx">${String(item.moduleIndex + 1).padStart(2, "0")}</span><span>${item.title}</span>`;
    button.addEventListener("click", () => {
      if (!canJumpTo(index)) {
        toggleSidebar(false);
        showGate("Complete the current checkpoint before jumping ahead.");
        return;
      }
      state.index = index;
      localStorage.setItem(STORAGE.step, String(state.index));
      render();
      scrollStepTop();
    });
    return button;
  }

  function renderStep(step) {
    const quizHtml = step.quiz ? renderQuiz(step) : "";
    const checkpointHtml = step.phase !== "afternoon" && step.checkpoint ? renderCheckpoint(step) : "";
    const facilitatorHtml = step.facilitator
      ? `<aside class="facilitator"><strong>Facilitator cue</strong><p>${step.facilitator}</p></aside>`
      : "";

    els.view.innerHTML = `
      <div class="step-inner">
        <div class="step-meta"><span class="phase-chip ${step.phase}">${step.phaseLabel}</span><span>Module step ${step.moduleIndex + 1} of ${step.moduleLength}</span>${step.duration ? `<span>${step.duration}</span>` : ""}</div>
        <p class="step-kicker">${step.moduleTitle}</p>
        <h1 tabindex="-1">${step.title}</h1>
        <div class="step-content">${step.html}</div>
        ${quizHtml}
        ${checkpointHtml}
        ${facilitatorHtml}
      </div>
    `;
  }

  function renderQuiz(step) {
    const done = Boolean(state.quizzes[step.id]);
    const choices = step.quiz.choices
      .map((choice) => `<button type="button" data-choice="${escapeAttr(choice)}">${choice}</button>`)
      .join("");
    return `
      <section class="quiz" data-quiz-id="${step.id}" data-answer="${escapeAttr(step.quiz.answer)}">
        <p class="section-label">Quick check</p>
        <h3>${step.quiz.prompt}</h3>
        <div class="choice-row">${choices}</div>
        <p class="quiz-feedback"${done ? "" : " hidden"}>${done ? step.quiz.explain : ""}</p>
      </section>
    `;
  }

  function renderCheckpoint(step) {
    const checked = state.checks[step.id] ? "checked" : "";
    return `
      <section class="checkpoint ${checked ? "is-complete" : ""}">
        <div class="checkpoint-mark" aria-hidden="true"></div>
        <div><p class="section-label">Evidence checkpoint</p><h3>Confirm before you continue</h3>
        <label><input type="checkbox" data-check="${step.id}" ${checked} /><span>${step.checkpoint}</span></label></div>
      </section>
    `;
  }

  async function copyCode(button) {
    const text = button.closest(".code-block").querySelector("pre").innerText;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select code to copy";
    }
    setTimeout(() => {
      button.textContent = "Copy code";
    }, 1400);
  }

  function onViewClick(event) {
    const unlockButton = event.target.closest("[data-unlock-submit]");
    if (unlockButton) {
      const input = els.view.querySelector("[data-unlock-input]");
      tryUnlock(input ? input.value : "");
      return;
    }

    const copyButton = event.target.closest(".copy-btn");
    if (copyButton) {
      copyCode(copyButton);
      return;
    }

    const choice = event.target.closest("[data-choice]");
    if (choice) {
      answerQuiz(choice);
      return;
    }

    if (event.target.closest("[data-reaction-start]")) {
      startReactionDemo();
      return;
    }

    const reactionButton = event.target.closest("[data-reaction-press]");
    if (reactionButton) pressReactionDemo(Number(reactionButton.dataset.reactionPress));
  }

  function answerQuiz(choice) {
    const quiz = choice.closest(".quiz");
    const picked = choice.dataset.choice;
    const step = steps[state.index];
    const feedback = quiz.querySelector(".quiz-feedback");
    quiz.querySelectorAll("[data-choice]").forEach((button) => button.classList.remove("correct", "wrong"));

    if (picked === quiz.dataset.answer) {
      choice.classList.add("correct");
      state.quizzes[step.id] = true;
      localStorage.setItem(STORAGE.quizzes, JSON.stringify(state.quizzes));
      feedback.hidden = false;
      feedback.textContent = step.quiz.explain;
      hideGate();
      els.hint.textContent = canAdvance(step)
        ? "Quick check complete. Continue when ready."
        : "Answer saved. Complete the checkpoint next.";
      renderNav();
    } else {
      choice.classList.add("wrong");
      feedback.hidden = false;
      feedback.textContent = step.quiz.wrong || "Not yet. Try another answer.";
    }
  }

  function startReactionDemo() {
    clearTimeout(reactionTimer);
    const root = els.view.querySelector("[data-reaction-sim]");
    if (!root) return;
    root.querySelectorAll(".reaction-lights i").forEach((light) => light.classList.remove("on"));
    root.querySelector("[data-reaction-status]").textContent = "WAIT... do not press yet.";
    root.querySelector("[data-reaction-result]").textContent = "Armed";
    root.querySelectorAll("[data-reaction-press]").forEach((button) => {
      button.disabled = false;
    });
    root.className = "reaction-simulator waiting";
    reactionTarget = -1;
    reactionState = "waiting";
    reactionTimer = setTimeout(() => {
      if (!root.isConnected || reactionState !== "waiting") return;
      const lights = root.querySelectorAll(".reaction-lights i");
      reactionTarget = Math.floor(Math.random() * lights.length);
      lights[reactionTarget].classList.add("on");
      root.querySelector("[data-reaction-status]").textContent = `TARGET ${reactionTarget + 1} — press the matching button.`;
      root.querySelector("[data-reaction-result]").textContent = "Timing...";
      root.className = "reaction-simulator go";
      reactionGoAt = performance.now();
      reactionState = "go";
    }, 1200 + Math.random() * 2200);
  }

  function pressReactionDemo(selected) {
    const root = els.view.querySelector("[data-reaction-sim]");
    if (!root || reactionState === "idle" || reactionState === "result") return;
    clearTimeout(reactionTimer);
    const status = root.querySelector("[data-reaction-status]");
    const result = root.querySelector("[data-reaction-result]");

    if (reactionState === "waiting") {
      status.textContent = "TOO EARLY";
      result.textContent = "Foul — no time recorded";
      root.className = "reaction-simulator false-start";
    } else if (selected !== reactionTarget) {
      status.textContent = "WRONG BUTTON";
      result.textContent = `Target ${reactionTarget + 1}, pressed ${selected + 1}`;
      root.className = "reaction-simulator false-start";
    } else {
      const elapsed = Math.round(performance.now() - reactionGoAt);
      status.textContent = "VALID REACTION";
      result.textContent = elapsed + " ms";
      root.className = "reaction-simulator result";
    }
    root.querySelectorAll(".reaction-lights i").forEach((light) => light.classList.remove("on"));
    root.querySelectorAll("[data-reaction-press]").forEach((button) => {
      button.disabled = true;
    });
    reactionTarget = -1;
    reactionState = "result";
  }

  function onViewChange(event) {
    const checkbox = event.target.closest("[data-check]");
    if (!checkbox) return;
    const id = checkbox.dataset.check;
    if (checkbox.checked) state.checks[id] = true;
    else delete state.checks[id];
    localStorage.setItem(STORAGE.checks, JSON.stringify(state.checks));
    const step = steps[state.index];
    const ready = canAdvance(step);
    const checkpoint = checkbox.closest(".checkpoint");
    checkpoint.classList.toggle("is-complete", checkbox.checked);
    checkpoint.classList.toggle("needs-attention", !checkbox.checked);
    els.hint.textContent = ready ? "Checkpoint complete. Continue when ready." : blockerText(step);
    if (ready) hideGate();
    renderNav();
    const completed = steps.filter((item, index) => isComplete(item, index)).length;
    els.sidebarProgress.textContent = `${completed}/${steps.length} complete`;
  }

  function onViewInput(event) {
    if (!event.target.matches("[data-sound-quiet], [data-sound-loud]")) return;
    const tool = event.target.closest(".sound-threshold-tool");
    const quietInput = tool.querySelector("[data-sound-quiet]");
    const loudInput = tool.querySelector("[data-sound-loud]");
    const output = tool.querySelector("[data-sound-result]");
    if (quietInput.value === "" || loudInput.value === "") {
      output.textContent = "Enter your two readings from Serial Monitor.";
      output.classList.remove("error");
      return;
    }
    const quiet = Number(quietInput.value);
    const loud = Number(loudInput.value);
    if (!Number.isFinite(quiet) || !Number.isFinite(loud) || loud <= quiet) {
      output.textContent = "The loud reading must be higher than the quiet reading. Measure both again.";
      output.classList.add("error");
      return;
    }
    const midpoint = Math.round((quiet + loud) / 2);
    output.textContent = `Start with SOUND_THRESHOLD = ${midpoint}; then test and refine it.`;
    output.classList.remove("error");
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }
})();
