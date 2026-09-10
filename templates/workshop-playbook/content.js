window.PLAYBOOK_ID = "workshop-template";

window.PLAYBOOK_META = {
  title: "University workshop",
  kicker: "Student playbook",
  overlayEyebrow: "University workshop",
  overlayTitle: "How much have you done before today?",
  overlayLede: "This room mixes people who have never touched hardware with people who already have. Same labs for everyone. Extra explainers appear only if you need them.",
  skillLabels: {
    beginner: "New to this",
    some: "Some experience",
    expert: "I have done this before",
  },
  skills: [
    {
      id: "beginner",
      kicker: "Start here",
      title: "New to this",
      blurb: "Never done a hardware or tool lab like this. Extra explainers stay on.",
    },
    {
      id: "some",
      kicker: "Short recap",
      title: "Some experience",
      blurb: "You have seen a breadboard or IDE before. Light recap, then the lab.",
    },
    {
      id: "expert",
      kicker: "Skip theory",
      title: "I have done this before",
      blurb: "Theory cards stay collapsed. Wiring, code, and checkpoints only.",
    },
  ],
  referenceTitle: "Quick reference",
  referenceNote: "Your team fills this from the real PoC. Do not invent extra parts.",
  referenceRows: [
    ["Today", "Hands-on lab for university workshop students", "This session"],
    ["This playbook", "Step-by-step guide. Tick checkpoints. Do not skip.", "Keep it open"],
    ["Later add-on", "Only if the PoC says so", "Do not wire yet"],
  ],
};

window.PLAYBOOK = {
  modules: [
    {
      id: "workshop",
      title: "Workshop",
      steps: [
        {
          id: "welcome",
          title: "Why you are here",
          checkpoint: "I know this is a university workshop playbook, I know today's objective, and I will tick checkpoints before Next.",
          facilitator: "Read the objective aloud as a room. Then let them pick skill level if they skipped the overlay.",
          html: `
            <p class="lede">This playbook is for <strong>university students in a live workshop</strong> — not a lecture slide deck and not a take-home textbook. You work at your bench. This file stays open on your laptop.</p>
            <div class="callout">
              <p><strong>Today’s objective</strong> (replace this sentence with the real PoC when you generate a workshop): build and prove one working demo, step by step, until the checkpoint at the end is true on real hardware or the real tool.</p>
            </div>
            <h2>How this room works</h2>
            <ul>
              <li>Some of you have never done this. Some of you already have. That is expected.</li>
              <li>Follow the steps in order. Each one is one action: wire, upload, measure, or confirm.</li>
              <li>Tick the <strong>checkpoint</strong> only after that step actually works. Next will not change the page until you do.</li>
              <li>Ticking the box does not skip ahead. You click Next when you are ready.</li>
            </ul>
            <div class="only-beginner callout">
              <p>If a word is new (pin, sketch, upload, serial), the next cards explain it. You do not need to study anything before this session.</p>
            </div>
            <div class="hide-expert callout">
              <p><strong>Where you code</strong> and <strong>where it runs</strong> will be named in Setup. Keep this playbook and that tool both open.</p>
            </div>
          `,
        },
      ],
    },
    {
      id: "setup",
      title: "Setup",
      steps: [
        {
          id: "kit",
          title: "What you need today",
          checkpoint: "I have only the kit listed for this PoC. I will not add extra parts.",
          html: `
            <p>The generated playbook will list hardware and software from the PoC only. Example placeholders:</p>
            <ul class="checklist">
              <li><input type="checkbox"> Laptop with the required IDE or tool installed</li>
              <li><input type="checkbox"> The board / kit named in the PoC</li>
              <li><input type="checkbox"> Cables that actually transfer data, not charge-only</li>
            </ul>
            <div class="callout warn">
              <p>Do not add a button, sensor, or library just because it is a common tutorial. If it is not in the PoC, it is not in the playbook.</p>
            </div>
          `,
        },
      ],
    },
    {
      id: "lab",
      title: "Lab",
      steps: [
        {
          id: "lab-1",
          title: "Build toward the PoC",
          checkpoint: "This placeholder step is only for the empty template. A real workshop replaces it with PoC labs.",
          facilitator: "If their LED or tool fails, ask what they would check first.",
          html: `
            <p>When your team pastes a PoC (like laser + LDR intruder detection), this module becomes the real labs: small steps that end on the working demo.</p>
            <div class="only-beginner callout">
              <p>Extra explainer cards stay here for beginners only.</p>
            </div>
          `,
        },
      ],
    },
  ],
};
