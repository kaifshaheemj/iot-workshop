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
