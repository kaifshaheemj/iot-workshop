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
      teaser: "Afternoon 1 — build it one checkpoint at a time",
      steps: [
        {
          id: "traffic-goal",
          title: "Start with the traffic signal story",
          checkpoint: "I can explain the three parts: LEDs show the signal, the sound sensor requests priority, and the ESP32 page reports the state.",
          html: `
            <p class="lede">You are going to build a small traffic signal in layers. First make one LED work, then make three LEDs cycle, then add a sound-triggered priority event, and finally observe everything from a page hosted by the ESP32.</p>
            <table class="data-table">
              <thead><tr><th>Feature</th><th>What you should see</th></tr></thead>
              <tbody>
                <tr><td>Signal LEDs</td><td>Red, yellow, and green take turns</td></tr>
                <tr><td>Sound input</td><td>A loud clap or siren-like sound requests green</td></tr>
                <tr><td>Wi-Fi page</td><td>The board reports state, ambulance flag, sound peak, and threshold</td></tr>
              </tbody>
            </table>
            <div class="callout warn"><p><strong>Safety:</strong> disconnect USB power before moving wires. Every LED needs its own 220 ohm resistor. The sensor uses 3.3 V logic.</p></div>
          `,
        },
        {
          id: "traffic-prepare",
          title: "Prepare the bench",
          checkpoint: "I have the ESP32, breadboard, three LEDs, three 220 ohm resistors, a sound sensor, a USB data cable, and Arduino IDE ready.",
          html: `
            <ul class="checklist">
              <li><span>☐</span><span>ESP32 Dev Module and a USB <strong>data</strong> cable</span></li>
              <li><span>☐</span><span>Breadboard and jumper wires</span></li>
              <li><span>☐</span><span>Red, yellow, and green LEDs</span></li>
              <li><span>☐</span><span>Three 220 ohm resistors — one per LED</span></li>
              <li><span>☐</span><span>Sound sensor module with analog output AO</span></li>
            </ul>
            <p>In Arduino IDE, select <strong>ESP32 Dev Module</strong>, the correct port, and Serial Monitor speed <strong>115200</strong>. Open the final sketch only after completing the smaller wiring checkpoints below.</p>
          `,
        },
        {
          id: "traffic-one-led",
          title: "Stage 1 — light one LED",
          checkpoint: "The red LED blinks once per second, and I can identify its anode, cathode, resistor, and GPIO.",
          html: `
            <p>Start with only the red branch. The long LED leg is the anode. The short leg or flat edge is the cathode.</p>
            <table class="data-table">
              <thead><tr><th>From</th><th>To</th></tr></thead>
              <tbody>
                <tr><td>GPIO 25</td><td>220 ohm resistor → red LED anode</td></tr>
                <tr><td>Red LED cathode</td><td>GND</td></tr>
              </tbody>
            </table>
            <p>Use the staged sketch: <a href="../sketches/traffic/traffic_stage_01_led_check.ino" download><code>traffic_stage_01_led_check.ino</code></a>. If the LED stays dark, reverse it before changing code.</p>
          `,
        },
        {
          id: "traffic-three-leds",
          title: "Stage 2 — build the automatic signal",
          checkpoint: "Exactly one LED is on at a time: green, then yellow, then red. The three branches each have their own resistor.",
          html: `
            <p>Keep the red branch and add the other two. Do not share a resistor between LEDs.</p>
            <table class="data-table">
              <thead><tr><th>LED</th><th>GPIO path</th><th>Return</th></tr></thead>
              <tbody>
                <tr><td>Red</td><td>GPIO 25 → 220 ohm → anode</td><td>Cathode → GND</td></tr>
                <tr><td>Yellow</td><td>GPIO 26 → 220 ohm → anode</td><td>Cathode → GND</td></tr>
                <tr><td>Green</td><td>GPIO 27 → 220 ohm → anode</td><td>Cathode → GND</td></tr>
              </tbody>
            </table>
            <p>Upload <a href="../sketches/traffic/traffic_stage_02_signal_cycle.ino" download><code>traffic_stage_02_signal_cycle.ino</code></a>. At this stage you are proving output timing only. The final repo sketch uses 3 seconds red, 1 second yellow, and 3 seconds green.</p>
          `,
        },
        {
          id: "traffic-sound",
          title: "Stage 3 — wire and tune the sound sensor",
          checkpoint: "The sound sensor is powered from 3.3 V, AO is on GPIO 34, and Serial Monitor shows a quiet reading and a higher reading after a sharp sound.",
          html: `
            <table class="data-table">
              <thead><tr><th>Sound sensor pin</th><th>ESP32 connection</th><th>Purpose</th></tr></thead>
              <tbody>
                <tr><td>VCC</td><td>3.3 V</td><td>Power</td></tr>
                <tr><td>GND</td><td>GND</td><td>Common ground</td></tr>
                <tr><td>AO</td><td>GPIO 34</td><td>Analog sound level</td></tr>
                <tr><td>DO</td><td>Leave unconnected</td><td>This repo sketch reads AO</td></tr>
              </tbody>
            </table>
            <p>Upload <a href="../sketches/traffic/traffic_stage_03_sound_check.ino" download><code>traffic_stage_03_sound_check.ino</code></a>, then open Serial Monitor at <strong>115200</strong>. Watch the printed <code>sound=</code> value while the room is quiet, then make a sharp sound. The final sketch compares the peak to <code>SOUND_THRESHOLD</code>.</p>
            <div class="callout warn"><p>Do not place the sound sensor on GPIO 18. That pin stays reserved and unused for the later buzzer add-on.</p></div>
          `,
        },
        {
          id: "traffic-web",
          title: "Stage 4 — upload the working web sketch",
          checkpoint: "The final traffic sketch is uploaded, the ESP32 creates TrafficLab Wi-Fi, and I can open its page at 192.168.4.1.",
          html: `
            <p>Open <code>sketches/traffic/traffic.ino</code> in Arduino IDE. The sketch keeps the page in <code>page.h</code>, so both files must remain in the same folder.</p>
            <ol class="steps-ol">
              <li>Upload with <strong>ESP32 Dev Module</strong> selected.</li>
              <li>Open Serial Monitor at <strong>115200</strong> and wait for the access-point message.</li>
              <li>Join Wi-Fi <strong>TrafficLab</strong> from your phone or laptop.</li>
              <li>Open <strong>http://192.168.4.1</strong>. A “no internet” warning is normal.</li>
            </ol>
            <p>The page should show the same signal state as the LEDs, plus the live sound peak and threshold.</p>
          `,
        },
        {
          id: "traffic-finish",
          title: "Stage 5 — prove the full system",
          checkpoint: "The LEDs cycle, a loud sound forces green, the page marks the ambulance state, and the signal returns to its normal cycle.",
          html: `
            <table class="data-table">
              <thead><tr><th>Test</th><th>Expected result</th></tr></thead>
              <tbody>
                <tr><td>Power on</td><td>Red starts and the automatic sequence begins</td></tr>
                <tr><td>Automatic cycle</td><td>Red → yellow → green repeats</td></tr>
                <tr><td>Sound event</td><td>Peak above threshold prints AMBULANCE and forces green</td></tr>
                <tr><td>Web status</td><td>The page reports state, ambulance flag, sound peak, and threshold</td></tr>
                <tr><td>Timeout</td><td>The priority green ends and the signal continues automatically</td></tr>
              </tbody>
            </table>
            <div class="callout ok"><p><strong>Finish:</strong> if one sound does not trigger it, adjust <code>SOUND_THRESHOLD</code> using the live numbers. This is a classroom priority-override demonstration, not real emergency-vehicle recognition.</p></div>
            <details class="accordion"><summary>Troubleshooting table</summary>
              <table class="data-table">
                <thead><tr><th>Symptom</th><th>First check</th><th>Then try</th></tr></thead>
                <tbody>
                  <tr><td>Upload fails</td><td>Correct board, port, and USB data cable</td><td>Hold BOOT while upload starts if your board needs it</td></tr>
                  <tr><td>LED stays dark</td><td>LED orientation and resistor path</td><td>Check the breadboard row and GPIO number</td></tr>
                  <tr><td>Sound never triggers</td><td>AO on GPIO 34 and 3.3 V power</td><td>Lower SOUND_THRESHOLD after observing Serial values</td></tr>
                  <tr><td>Page does not open</td><td>Join TrafficLab, not campus Wi-Fi</td><td>Use the printed IP address and stay connected despite “no internet”</td></tr>
                </tbody>
              </table>
            </details>
          `,
        },
      ],
    },
    {
      id: "tripwire",
      title: "Lab 2 — Intruder detection",
      phase: "afternoon",
      teaser: "Afternoon 2 — locked until lunch",
      steps: [
        {
          id: "tripwire-goal",
          title: "What you are building",
          checkpoint: "I can say the objective in one sentence: a laser beam across a space; if something crosses it, Serial says INTRUDER DETECTED and the buzzer sounds.",
          facilitator: "Do not start with the pin table. Ask what success looks like. Lab 1 used GPIO 25 and 27 for LEDs — those wires come off first.",
          html: `
            <p class="lede">A silent line of light. If something walks through it, the board notices and shouts. That is the whole lab.</p>
            <p>Sense → decide → act, with only what is on the table: ESP32, breadboard, jumper wires, laser, LDR, buzzer. No extra LED. No servo. No web page.</p>
            <div class="callout warn">
              <p>GPIO 25 and GPIO 27 were Lab 1 LED pins. Pull those LED wires off before you start. You will reuse the pins for laser and buzzer.</p>
            </div>
            <div class="only-beginner callout">
              <p>You already used analog numbers this morning. Here the analog number is “is the beam still there?” The digital shout is the buzzer.</p>
            </div>
          `,
        },
        {
          id: "tripwire-roles",
          title: "Three parts, three jobs",
          checkpoint: "I can name the jobs: laser makes the line, LDR is an analog eye, buzzer is the shout. I have not wired them yet.",
          quiz: {
            prompt: "If a hand blocks the beam, what should change first?",
            choices: ["The buzzer pin, because the alarm is the point", "The analog number from the LDR, because that is the only sensor", "The laser turns itself off"],
            answer: "The analog number from the LDR, because that is the only sensor",
            explain: "The buzzer is an output. It should follow a decision about a number. First you need that number to move when the beam breaks.",
            wrong: "The shout cannot happen until the eye sees a change. Try again.",
          },
          facilitator: "If they guess the buzzer first, ask: how does the chip know anything happened?",
          html: `
            <p class="lede">Before a single jumper: what is each part for?</p>
            <table class="data-table">
              <thead><tr><th>Part</th><th>Job</th><th>Kind of pin</th></tr></thead>
              <tbody>
                <tr><td>Laser</td><td>Draw a thin line of light toward the LDR</td><td>Digital output — on or off</td></tr>
                <tr><td>LDR</td><td>Turn “how much light hits me” into a number 0–4095</td><td>Analog input</td></tr>
                <tr><td>Buzzer</td><td>Make noise when the code decides the beam is gone</td><td>Digital output — on or off</td></tr>
              </tbody>
            </table>
            <div class="accordion">
              <details>
                <summary>Optional — guess larger or smaller (skip if you prefer to measure first)</summary>
                <p>Write a guess in your notebook (do not look up 1800 yet): if you cover the LDR, does the Serial number get <strong>larger</strong> or <strong>smaller</strong>? You will measure in a later step. This guess is not a checkpoint.</p>
              </details>
              <details>
                <summary>Click to enlarge — baud rate and what the numbers mean</summary>
                <p>Serial is text over USB. <strong>Baud</strong> is how fast those characters travel. The sketch will say <code>Serial.begin(115200)</code>. The Serial Monitor dropdown must also be <strong>115200</strong>. If they do not match, you see garbage — not a real light reading.</p>
                <table class="data-table">
                  <thead><tr><th>What Serial prints</th><th>What it represents</th></tr></thead>
                  <tbody>
                    <tr><td>Garbled symbols</td><td>Wrong baud. Fix the dropdown first.</td></tr>
                    <tr><td>A whole number 0–4095</td><td><code>analogRead</code> on the ESP32 (12-bit). That is the LDR “eye.”</td></tr>
                    <tr><td>A high number (toward 4095)</td><td>More light hitting this module — beam on the LDR.</td></tr>
                    <tr><td>A low number (toward 0)</td><td>Less light — a hand covering the window.</td></tr>
                  </tbody>
                </table>
                <p>Think with that map, then guess. Do not copy 1800 yet. 1800 is only a midpoint after you have two real readings from your desk.</p>
              </details>
            </div>
            <div class="hide-expert callout">
              <p>Digital is HIGH or LOW. Analog is a range. Mixing them up is how people put a buzzer on an analog-only pin.</p>
            </div>
          `,
        },
        {
          id: "tripwire-power",
          title: "Power and ground first",
          checkpoint: "Every module shares GND with the ESP32. LDR VCC is on 3.3V. I have not attached the three signal wires yet.",
          facilitator: "If a module stays dead, ask: is GND common? Do not grab their 5V rail for them.",
          html: `
            <p>What would happen if the LDR and the ESP32 did not share ground? The analog pin would be guessing in the dark — no common 0 V, no honest number.</p>
            <table class="data-table">
              <thead><tr><th>Wire</th><th>Where</th><th>Why</th></tr></thead>
              <tbody>
                <tr><td>All GND pins</td><td>ESP32 GND (same rail on the breadboard)</td><td>One 0 V for laser, LDR, and buzzer</td></tr>
                <tr><td>LDR VCC</td><td>ESP32 3.3V</td><td>ESP32 analog pins are 3.3V. Do not feed the LDR from 5V into GPIO 34</td></tr>
              </tbody>
            </table>
            <p class="only-beginner">The red rail can be 3.3V, the blue rail GND. Keep Lab 1 LEDs off those rails if they still sit on 25 and 27.</p>
          `,
        },
        {
          id: "tripwire-ldr",
          title: "Connect the eye — LDR",
          checkpoint: "I can say why the LDR analog wire is on GPIO 34, not on 25 or 27. AO is on 34, VCC on 3.3V, GND shared.",
          quiz: {
            prompt: "Why GPIO 34 for the LDR, not GPIO 25?",
            choices: ["34 is ADC1 analog in. analogRead belongs there. 25 is a digital output we will use for the laser.", "34 is closer on the breadboard.", "34 can drive more current for the buzzer later."],
            answer: "34 is ADC1 analog in. analogRead belongs there. 25 is a digital output we will use for the laser.",
            explain: "GPIO 34 is input-only analog. Never put the buzzer or the laser drive on it.",
            wrong: "Think about analog vs digital. Which pin can analogRead?",
          },
          html: `
            <p>The LDR is the only thing that <em>reads</em> the world. Give it the analog pin first.</p>
            <table class="data-table">
              <thead><tr><th>LDR pin</th><th>Goes to</th><th>Job</th></tr></thead>
              <tbody>
                <tr><td>AO (analog out)</td><td>GPIO 34</td><td>The number 0–4095</td></tr>
                <tr><td>VCC</td><td>3.3V</td><td>Power for the module</td></tr>
                <tr><td>GND</td><td>GND</td><td>Common 0 V</td></tr>
              </tbody>
            </table>
            <p>GPIO 34 cannot be an output. If you later want a shout, that shout needs a different pin.</p>
          `,
        },
        {
          id: "tripwire-laser",
          title: "Connect the line — laser",
          checkpoint: "Laser S is on GPIO 25. I know 25 is a digital output so HIGH can keep the beam on. The beam is aimed at the LDR.",
          facilitator: "If the laser never lights, ask VCC rating (3.3 vs 5) and whether they used the S pin. Do not aim at eyes.",
          html: `
            <p>What would happen if the laser were wired to GPIO 34? That pin cannot drive an output. The beam would stay dead.</p>
            <table class="data-table">
              <thead><tr><th>Laser pin</th><th>Goes to</th><th>Job</th></tr></thead>
              <tbody>
                <tr><td>S (control)</td><td>GPIO 25</td><td>Digital out. Code will set HIGH so the beam stays on</td></tr>
                <tr><td>VCC</td><td>3.3V or 5V (read the module)</td><td>Power. 5V is fine for VCC if the datasheet says so — keep S on 25</td></tr>
                <tr><td>GND</td><td>GND</td><td>Common 0 V</td></tr>
              </tbody>
            </table>
            <p>Aim the dot at the LDR window. If the dot misses, Serial will look like the beam is always broken.</p>
            <div class="callout warn">
              <p>Do not look into the beam. Treat it like a tiny spotlight, not a toy pointer at faces.</p>
            </div>
          `,
        },
        {
          id: "tripwire-see",
          title: "See the number move",
          checkpoint: "I wrote a beam-on number and a hand-block number from Serial at 115200. I know which way the number moves on my module.",
          facilitator: "Have them write two numbers on paper. This kit is expected to fall when blocked. 1800 is only a midpoint guess after they have both readings.",
          html: `
            <p>Do not add the buzzer yet. You are still teaching the chip what “beam there” looks like.</p>
            <div class="callout">
              <p>This short snippet only prints numbers. It is not the finished tripwire. The full sketch (threshold, INTRUDER DETECTED, buzzer) is on the last Lab 2 card, <strong>Working model</strong>.</p>
            </div>
            <p>In Arduino IDE: New sketch, paste only this, upload, open Serial Monitor. Click the baud box below if 115200 is not obvious.</p>
            <div class="accordion">
              <details>
                <summary>Click to enlarge — set baud 115200 and read the values</summary>
                <p>Tools → Serial Monitor. Bottom-right dropdown = <strong>115200</strong>, same as <code>Serial.begin(115200)</code> in the snippet. Mismatch prints junk.</p>
                <table class="data-table">
                  <thead><tr><th>On the desk</th><th>Typical Serial number on this module</th></tr></thead>
                  <tbody>
                    <tr><td>Laser on the LDR</td><td>Higher (more light) — write this as beam-on</td></tr>
                    <tr><td>Hand in the beam</td><td>Lower (less light) — write this as beam-off</td></tr>
                    <tr><td>Threshold later</td><td>A number <em>between</em> those two. 1800 is only a starting guess if it sits in that gap.</td></tr>
                  </tbody>
                </table>
              </details>
            </div>
            <div class="code-block"><header><span>see_the_beam.ino</span><button type="button" class="copy-btn">Copy</button></header><pre>const int LDR_PIN = 34;
const int LASER_PIN = 25;

void setup() {
  Serial.begin(115200);
  pinMode(LASER_PIN, OUTPUT);
  digitalWrite(LASER_PIN, HIGH);
}

void loop() {
  Serial.println(analogRead(LDR_PIN));
  delay(200);
}</pre></div>
            <ol>
              <li>Beam on the LDR — write the number. That is NORMAL for your desk.</li>
              <li>Hand in the beam — write the number. That is INTRUDER for your desk.</li>
            </ol>
            <p>On <strong>this</strong> module the blocked reading should be <em>smaller</em>. A starting midpoint of <code>1800</code> only makes sense if it sits between your two numbers. If it does not, use the midpoint of <em>your</em> pair.</p>
            <p class="note">Code later will treat <code>lightValue &lt; THRESHOLD</code> as INTRUDER.</p>
          `,
        },
        {
          id: "tripwire-buzzer",
          title: "Connect the shout — buzzer",
          checkpoint: "Buzzer SIG is on GPIO 27. I can say why it waited until after Serial numbers: the shout should follow a real decision, not a guess.",
          html: `
            <p>Now the analog eye has spoken. Give the decision a voice.</p>
            <table class="data-table">
              <thead><tr><th>Buzzer pin</th><th>Goes to</th><th>Job</th></tr></thead>
              <tbody>
                <tr><td>SIG (or + / S)</td><td>GPIO 27</td><td>Digital out. HIGH = alarm, LOW = quiet</td></tr>
                <tr><td>VCC</td><td>3.3V or 5V per the module</td><td>Power</td></tr>
                <tr><td>GND</td><td>GND</td><td>Common 0 V</td></tr>
              </tbody>
            </table>
            <p>GPIO 27 can output. GPIO 34 cannot. That is why the buzzer never sat on the LDR pin.</p>
          `,
        },
        {
          id: "tripwire-run",
          title: "Working model",
          checkpoint: "Hand through the beam: Serial says INTRUDER DETECTED and the buzzer is on. Beam restored: NORMAL and quiet. I used my threshold, not a magic number I never measured.",
          facilitator: "If it never alarms, ask which of the two Serial numbers is smaller. If it always alarms, ask whether the laser still hits the LDR.",
          html: `
            <p class="lede">This is the full program. Replace the short number-only snippet with this file. Baud 115200.</p>
            <p>File → Open <code>sketches/tripwire/tripwire.ino</code> if you have the afternoon zip. Or New sketch, paste the block below, save as <code>tripwire.ino</code>.</p>
            <p>Put <strong>your</strong> midpoint in <code>THRESHOLD</code> if 1800 is not between the two numbers you wrote.</p>
            <div class="code-block"><header><span>tripwire.ino</span><button type="button" class="copy-btn">Copy</button></header><pre>const int LDR_PIN = 34;
const int LASER_PIN = 25;
const int BUZZER_PIN = 27;

const int THRESHOLD = 1800;  // replace with the midpoint of your two Serial numbers

void setup() {
  Serial.begin(115200);

  pinMode(LDR_PIN, INPUT);
  pinMode(LASER_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(LASER_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("ESP32 INTRUDER DETECTION");
  Serial.println("Laser tripwire started. Status: NORMAL");
}

void loop() {
  int lightValue = analogRead(LDR_PIN);

  Serial.print("Light Value: ");
  Serial.println(lightValue);

  if (lightValue &lt; THRESHOLD) {
    Serial.println("INTRUDER DETECTED");
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    Serial.println("NORMAL");
    digitalWrite(BUZZER_PIN, LOW);
  }

  delay(200);
}</pre></div>
            <table class="data-table">
              <thead><tr><th>Buzzer / laser / LDR pin</th><th>Goes to</th><th>What that wire is for</th></tr></thead>
              <tbody>
                <tr><td>LDR AO</td><td>GPIO 34</td><td>Sense — analog number 0–4095</td></tr>
                <tr><td>LDR VCC</td><td>3.3V</td><td>Power for the LDR</td></tr>
                <tr><td>LDR GND</td><td>GND</td><td>Common 0 V</td></tr>
                <tr><td>Laser S</td><td>GPIO 25</td><td>Control — HIGH keeps the beam on</td></tr>
                <tr><td>Laser VCC</td><td>3.3V or 5V (read the laser board)</td><td>Power for the laser</td></tr>
                <tr><td>Laser GND</td><td>GND</td><td>Common 0 V</td></tr>
                <tr><td>Buzzer SIG (also + or I/O)</td><td>GPIO 27</td><td>Control — HIGH = shout, LOW = quiet</td></tr>
                <tr><td>Buzzer VCC</td><td>3.3V or 5V (read the buzzer board)</td><td>Power for the buzzer — not a GPIO</td></tr>
                <tr><td>Buzzer GND</td><td>GND</td><td>Common 0 V</td></tr>
              </tbody>
            </table>
            <p>Hand through the beam. Serial should flip to INTRUDER DETECTED and the buzzer should sound. Pull the hand away: NORMAL, quiet.</p>
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
            <p class="lede">Each lab was sense → decide → act: sound interrupts lights, a broken beam shouts on the buzzer, time measures a human.</p>
            <p>If something failed, change one wire or one number at a time. Baud 115200. ADC1 pins for analog after Wi-Fi.</p>
          `,
        },
      ],
    },
  ],
};
