window.PLAYBOOK_ID = "iot-university-day";

window.PLAYBOOK_META = {
  title: "University IoT workshop",
  kicker: "Student playbook",
  unlockCode: "AFTERNOON",
  overlayEyebrow: "University workshop",
  overlayTitle: "How much have you done before today?",
  overlayLede: "Morning is theory. Afternoon is a hands-on surprise with the kit on your table.",
  skillLabels: {
    beginner: "New to this",
    some: "Some experience",
    expert: "I have done this before",
  },
  skills: [
    { id: "beginner", kicker: "Start here", title: "New to this", blurb: "Never done a hardware lab. Extra explainers stay on." },
    { id: "some", kicker: "Short recap", title: "Some experience", blurb: "You have seen a breadboard or IDE. Light recap, then the day." },
    { id: "expert", kicker: "Skip theory", title: "I have done this before", blurb: "Theory cards stay collapsed." },
  ],
  referenceTitle: "Day reference",
  referenceNote: "Morning: theory and slides only. Afternoon pin maps appear after the unlock code.",
  referenceRows: [
    ["Morning", "Prep-book slider + theory cards", "Now"],
    ["Afternoon", "Three kit labs, unlocked after lunch", "Locked"],
    ["Slides", "slides.html on this same site", "Projector + laptops"],
    ["Unlock code", "Spoken by the facilitator after lunch", "Type it on the last morning card"],
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
          checkpoint: "I know this is a university workshop: theory this morning, kit labs after lunch, and I will tick checkpoints before Next.",
          facilitator: "Do not name the three demos. Tease curiosity only. Unlock code is AFTERNOON (or ?phase=afternoon). You always see labs with ?role=facilitator.",
          html: `
            <p class="lede">This playbook is for <strong>university students in a live workshop</strong>. You work at your bench. Keep this page open. It is a guide, not a lecture deck.</p>
            <div class="callout">
              <p><strong>Today’s shape:</strong> morning is theory (slides + these cards). After lunch each team gets a hardware kit and builds three short systems, one after another. Those labs stay hidden until your facilitator opens them. That is on purpose.</p>
            </div>
            <h2>How this room works</h2>
            <ul>
              <li>Some of you have never done hardware. Some of you already have. Same path for everyone.</li>
              <li>One action per step. Tick the checkpoint only when that step actually works.</li>
              <li>Next will not leave the page until the checkpoint is ticked. Ticking does not skip ahead.</li>
            </ul>
            <a class="slides-cta" href="slides.html">Open morning slides (fullscreen)</a>
            <p class="note">Facilitators: put slides.html on the projector. Same deck is on this site so it still works without Google.</p>
            <div class="only-beginner callout">
              <p>You do not need to study anything before this session. New words (pin, sketch, upload, serial) show up on the next cards.</p>
            </div>
          `,
        },
      ],
    },
    {
      id: "theory",
      title: "Morning theory",
      steps: [
        {
          id: "sense-decide-act",
          title: "Sense, decide, act",
          checkpoint: "I can say in my own words: a sensor reads the world, code decides, an output does something.",
          html: `
            <p class="lede">Every kit you will touch this afternoon follows the same loop. We will not name the projects yet.</p>
            <table class="data-table">
              <thead><tr><th>Stage</th><th>Meaning</th></tr></thead>
              <tbody>
                <tr><td>Sense</td><td>A pin reads a changing number from a sensor</td></tr>
                <tr><td>Decide</td><td>Code compares a number to a rule (a threshold, a timer, a request from a page)</td></tr>
                <tr><td>Act</td><td>An LED, a motor, or a web page changes</td></tr>
              </tbody>
            </table>
            <div class="hide-expert callout">
              <p>If you remember only one sentence: <strong>the chip does not “know” the story. It only compares numbers and drives pins.</strong></p>
            </div>
          `,
        },
        {
          id: "digital-analog",
          title: "Digital vs analog",
          checkpoint: "I know digital is HIGH/LOW and analog is a number (0 to 4095 on ESP32).",
          html: `
            <p><strong>Digital</strong> is on or off: about 3.3 V (HIGH) or 0 V (LOW). LEDs and many alarms are digital outputs.</p>
            <p><strong>Analog</strong> is a range. On ESP32, <code>analogRead</code> is usually 0–4095. Light and sound sensors often use analog pins on ADC1 (GPIO 32–39) so they still work after Wi-Fi starts.</p>
            <p class="only-beginner callout">A GPIO is just a numbered pin on the board. The sketch names the pin. If the wire is on a different pin, the code will not see it.</p>
          `,
        },
        {
          id: "upload-serial",
          title: "Where code runs",
          checkpoint: "I know we write in Arduino IDE on the laptop, then upload to the board over a USB data cable, and Serial Monitor must match baud.",
          html: `
            <p><strong>Where you code:</strong> Arduino IDE. Each program is a folder whose name matches the <code>.ino</code> file.</p>
            <p><strong>Where it runs:</strong> on the ESP32 after Upload. Use a USB <strong>data</strong> cable, not charge-only.</p>
            <p>Serial Monitor (Ctrl+Shift+M) prints numbers and messages. Baud in the sketch and in the dropdown must match (we use 115200).</p>
            <div class="callout warn">
              <p>If Tools → Port is empty, swap the cable first, then install the USB-serial driver (CP2102 or CH340).</p>
            </div>
          `,
        },
        {
          id: "wifi-page",
          title: "A page hosted by the board",
          checkpoint: "I know the board can make its own Wi-Fi and a phone can open a status page without the internet.",
          html: `
            <p>Some labs end with a small web page served by the ESP32. The board creates a Wi-Fi name. You join it and open an address such as <code>http://192.168.4.1</code>.</p>
            <p>Your laptop may say “no internet.” Stay connected anyway. That network is only for the board.</p>
            <div class="callout warn">
              <p>When you join the board’s Wi-Fi, campus internet on that laptop will drop. Keep this playbook as a local file (or the morning zip) so the guide still opens.</p>
            </div>
          `,
        },
        {
          id: "unlock",
          title: "After lunch — open the labs",
          checkpoint: "I will wait for the facilitator before typing the unlock code.",
          facilitator: "Say the word AFTERNOON out loud after kits are on the tables. Or send students to ?phase=afternoon. Rehearse with ?role=facilitator.",
          html: `
            <p class="lede">Morning stops here on purpose. All afternoon labs stay under one locked section in the sidebar until this code is accepted.</p>
            <p>After lunch, when the kit is on your table, type the word your facilitator says out loud, then click Unlock labs.</p>
            <div class="unlock-box">
              <h2>Afternoon unlock</h2>
              <p>One code opens every lab. You will not need a separate code for each project.</p>
              <input type="text" data-unlock-input autocomplete="off" placeholder="Code from the facilitator" />
              <button type="button" class="nav-btn-next" data-unlock-submit>Unlock labs</button>
            </div>
            <p class="note">Still locked? You are on the right page — wait for the spoken code. Facilitators can preview with <code>?role=facilitator</code>.</p>
          `,
        },
      ],
    },
    {
      id: "traffic",
      title: "Lab 1 — Traffic and ambulance",
      phase: "afternoon",
      teaser: "Afternoon 1 — locked until lunch",
      steps: [
        {
          id: "traffic-goal",
          title: "Lab 1 goal",
          checkpoint: "I know success: lights cycle like a signal, an ambulance sound interrupts to green, and the web page shows the same status.",
          html: `
            <p class="lede">Build a traffic light that cycles red / yellow / green. A loud ambulance-like sound interrupts the cycle and forces green. A page on the board shows the current state.</p>
            <p>Join Wi-Fi <strong>TrafficLab</strong> and open <strong>http://192.168.4.1</strong>.</p>
            <p class="note">Sketch folder (afternoon zip): <code>sketches/traffic/traffic.ino</code>. Tune SOUND_THRESHOLD from Serial.</p>
          `,
        },
        {
          id: "traffic-wire",
          title: "Wire the traffic kit",
          checkpoint: "Red, yellow, and green LEDs plus the sound sensor are wired. GPIO 18 is still empty if your kit reserved it.",
          html: `
            <table class="data-table">
              <thead><tr><th>Part</th><th>ESP32 (defaults — match your CONTEXT)</th></tr></thead>
              <tbody>
                <tr><td>Red LED</td><td>GPIO 25 through 220 ohm to GND</td></tr>
                <tr><td>Yellow LED</td><td>GPIO 26 through 220 ohm to GND</td></tr>
                <tr><td>Green LED</td><td>GPIO 27 through 220 ohm to GND</td></tr>
                <tr><td>Sound sensor AO</td><td>GPIO 34 (ADC1)</td></tr>
                <tr><td>Sound VCC / GND</td><td>3.3V / GND</td></tr>
              </tbody>
            </table>
            <p>If your team’s CONTEXT uses different pins, change the <code>#define</code> lines at the top of the sketch, not the wiring story.</p>
          `,
        },
        {
          id: "traffic-run",
          title: "Upload and prove it",
          checkpoint: "Lights cycle, a clap or siren sound jumps to green, and the page at 192.168.4.1 matches.",
          html: `
            <p>File → Open <code>sketches/traffic/traffic.ino</code>. Set baud 115200. Watch analog numbers, then set <code>SOUND_THRESHOLD</code> between quiet and siren.</p>
            <p>Open the board page while joined to <strong>TrafficLab</strong>. The heading should follow the LEDs.</p>
          `,
        },
      ],
    },
    {
      id: "tripwire",
      title: "Lab 2 — Tripwire and door",
      phase: "afternoon",
      teaser: "Afternoon 2 — locked until lunch",
      steps: [
        {
          id: "tripwire-goal",
          title: "Lab 2 goal",
          checkpoint: "I know success: a broken laser beam flags an intruder, the servo closes the door, and the web page can open or close the door.",
          html: `
            <p class="lede">Aim a laser at an LDR. When the beam breaks, Serial says INTRUDER DETECTED, the alarm LED turns on, and a servo closes a cardboard “door.” The board page can also open or close that door.</p>
            <p>Wi-Fi <strong>IntruderLab</strong> — <strong>http://192.168.4.1</strong>.</p>
            <p>No extra practice button. Only the LDR, laser, LED, and servo from this PoC.</p>
          `,
        },
        {
          id: "tripwire-wire",
          title: "Wire tripwire and servo",
          checkpoint: "LDR on GPIO 34, alarm LED on GPIO 5, servo signal on GPIO 13. Laser powered and aimed at the LDR.",
          html: `
            <table class="data-table">
              <thead><tr><th>Part</th><th>ESP32</th></tr></thead>
              <tbody>
                <tr><td>LDR AO</td><td>GPIO 34</td></tr>
                <tr><td>LDR VCC / GND</td><td>3.3V / GND</td></tr>
                <tr><td>Alarm LED</td><td>GPIO 5 through 220 ohm</td></tr>
                <tr><td>Servo signal</td><td>GPIO 13</td></tr>
                <tr><td>Servo VCC</td><td>5V if the module needs it (external 5V if USB browns out)</td></tr>
                <tr><td>Laser</td><td>Own 3.3V or 5V per rating, aimed at the LDR</td></tr>
              </tbody>
            </table>
            <p>Calibrate THRESHOLD like morning analog: beam on vs hand blocking. Sketch: <code>sketches/tripwire/tripwire.ino</code>.</p>
          `,
        },
        {
          id: "tripwire-run",
          title: "Upload, beam, door buttons",
          checkpoint: "Beam-break closes the servo and shows INTRUDER on the page. Open and Close on the page move the door.",
          html: `
            <p>Join IntruderLab. Page shows NORMAL / INTRUDER DETECTED plus Open door / Close door. Breaking the beam should close. Buttons should move the servo even without a break.</p>
          `,
        },
      ],
    },
    {
      id: "reaction",
      title: "Lab 3 — Reaction time",
      phase: "afternoon",
      teaser: "Afternoon 3 — locked until lunch",
      steps: [
        {
          id: "reaction-goal",
          title: "Lab 3 goal",
          checkpoint: "I know success: a random LED lights after a delay, I react, and Serial prints reaction time in milliseconds.",
          html: `
            <p class="lede">The board waits a random time, lights one LED, and measures how long until you complete the reaction (button on GPIO 4, because this PoC needs a react input).</p>
            <p>Sketch: <code>sketches/reaction/reaction.ino</code>. Serial at 115200 prints the time.</p>
          `,
        },
        {
          id: "reaction-wire",
          title: "Wire the LEDs and react button",
          checkpoint: "Three LEDs and one react button are wired. I did not add extra parts beyond this PoC.",
          html: `
            <table class="data-table">
              <thead><tr><th>Part</th><th>ESP32</th></tr></thead>
              <tbody>
                <tr><td>LED A / B / C</td><td>GPIO 25 / 26 / 27 through 220 ohm to GND</td></tr>
                <tr><td>React button</td><td>GPIO 4 to GND, INPUT_PULLUP (pressed = LOW)</td></tr>
              </tbody>
            </table>
          `,
        },
        {
          id: "reaction-run",
          title: "Play a round",
          checkpoint: "Serial prints a reaction time after I press when an LED lights. False starts are ignored or flagged.",
          html: `
            <p>Upload, open Serial Monitor, wait for an LED, press. Try a press too early — the sketch should not count a cheat as a valid time.</p>
          `,
        },
      ],
    },
    {
      id: "done",
      title: "Close",
      phase: "afternoon",
      teaser: "Afternoon — locked until lunch",
      steps: [
        {
          id: "wrap",
          title: "You built three loops",
          html: `
            <p class="lede">Each lab was sense → decide → act: sound interrupts lights, light interrupts a door, time measures a human.</p>
            <p>If something failed, change one wire or one number at a time. Baud 115200. ADC1 pins for analog after Wi-Fi.</p>
          `,
        },
      ],
    },
  ],
};
