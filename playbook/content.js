function codeBlock(filename, source) {
  return (
    '<div class="code-block"><header><span>' +
    filename +
    '</span><button type="button" class="copy-btn">Copy</button></header><pre>' +
    escapeHtml(source.trim()) +
    "</pre></div>"
  );
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const SVG_LDR = `
<svg class="wiring" viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LDR module wiring">
  <rect x="20" y="30" width="150" height="140" rx="10" fill="#e8f7f4" stroke="#0d7a6c"/>
  <text x="95" y="70" fill="#1c2433" text-anchor="middle" font-size="14">ESP32</text>
  <text x="95" y="96" fill="#5d6b80" text-anchor="middle" font-size="12">3.3V</text>
  <text x="95" y="116" fill="#5d6b80" text-anchor="middle" font-size="12">GND</text>
  <text x="95" y="136" fill="#5d6b80" text-anchor="middle" font-size="12">GPIO 34 AO</text>
  <rect x="300" y="50" width="180" height="100" rx="10" fill="#102018" stroke="#5ee09a"/>
  <text x="390" y="88" fill="#5ee09a" text-anchor="middle" font-size="14">LDR module</text>
  <text x="390" y="112" fill="#93a0b8" text-anchor="middle" font-size="12">VCC  GND  AO  (DO unused)</text>
  <line x1="170" y1="92" x2="300" y2="80" stroke="#5ee09a" stroke-width="2"/>
  <line x1="170" y1="112" x2="300" y2="100" stroke="#93a0b8" stroke-width="2"/>
  <line x1="170" y1="132" x2="300" y2="120" stroke="#3ee0c5" stroke-width="2"/>
</svg>`;

const SVG_TRIPWIRE = `
<svg class="wiring" viewBox="0 0 560 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laser tripwire layout">
  <rect x="20" y="70" width="110" height="70" rx="8" fill="#3a1018" stroke="#ff4d62"/>
  <text x="75" y="110" fill="#ff8a9a" text-anchor="middle" font-size="13">LASER</text>
  <line x1="130" y1="105" x2="330" y2="105" stroke="#ff2e4d" stroke-width="4"/>
  <rect x="330" y="70" width="110" height="70" rx="8" fill="#102018" stroke="#5ee09a"/>
  <text x="385" y="110" fill="#8dffc2" text-anchor="middle" font-size="13">LDR</text>
  <rect x="180" y="160" width="200" height="50" rx="8" fill="#e8f7f4" stroke="#0d7a6c"/>
  <text x="280" y="190" fill="#1c2433" text-anchor="middle" font-size="13">ESP32 · GPIO 34 + GPIO 5 LED</text>
  <text x="280" y="36" fill="#5d6b80" text-anchor="middle" font-size="12">Start 15–20 cm apart. Beam must hit the LDR face.</text>
</svg>`;

window.PLAYBOOK_ID = "intruder-detection";

window.PLAYBOOK = {
  modules: [
    {
      id: "workshop",
      title: "Workshop",
      steps: [
        {
          id: "welcome",
          title: "Why you are here",
          checkpoint: "I know this is a university workshop playbook, I know today’s objective (laser tripwire on ESP32), and I will tick checkpoints before Next.",
          html: `
            <p class="lede">This playbook is for <strong>university students in a live workshop</strong>. You work at your bench. Keep this page open on your laptop. It is a guide, not a lecture deck.</p>
            <div class="callout">
              <p><strong>Today’s objective:</strong> build a laser + LDR tripwire on an ESP32. When the beam is blocked, Serial says INTRUDER DETECTED, the alarm LED on GPIO 5 turns on, and (later today) a page at http://192.168.4.1 says the same thing.</p>
            </div>
            <h2>How this room works</h2>
            <ul>
              <li>Some of you have never used a microcontroller. Some of you already have. Same labs for everyone.</li>
              <li>One action per step: wire, upload, or confirm.</li>
              <li>Tick the checkpoint only after that step actually works. Next will not leave this page until you do.</li>
              <li>Ticking the box does not skip ahead. Click Next when you are ready.</li>
            </ul>
            <div class="callout">
              <p><strong>Where you code:</strong> Arduino IDE on your laptop (<code>.ino</code> files).<br>
              <strong>Where it runs:</strong> on the ESP32 after you upload over a USB <em>data</em> cable.</p>
            </div>
            <ul>
              <li>Open sketches from the <code>sketches/</code> folders, or copy from this playbook.</li>
              <li>Pin map (top right) is locked for the whole session. No extra button. No buzzer today.</li>
            </ul>
            <p class="only-beginner callout">If you have never used a microcontroller: the ESP32 is a tiny computer with pins. Your laptop compiles a program; the chip then runs it. It still needs USB power after upload.</p>
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
          title: "Kit checklist",
          checkpoint: "I have the hardware and software for today’s build (no buzzer needed).",
          html: `
            <p>Install software <strong>before</strong> the session if you can. Board-support install alone can eat 20 minutes.</p>
            <h2>Hardware today</h2>
            <ul class="checklist">
              <li><input type="checkbox"> ESP32 Dev Board</li>
              <li><input type="checkbox"> USB <strong>data</strong> cable (not charge-only)</li>
              <li><input type="checkbox"> Breadboard + jumper wires (M-M and F-M)</li>
              <li><input type="checkbox"> LDR sensor module</li>
              <li><input type="checkbox"> LED + 220Ω resistor (alarm lamp — not a button)</li>
              <li><input type="checkbox"> Laser module (KY-008 style)</li>
            </ul>
            <div class="callout warn">
              <p>No buzzer in this session. GPIO 18 is reserved for an active buzzer after Serial + dashboard work. Leave that pin empty.</p>
            </div>
            <h2>Software</h2>
            <ul class="checklist">
              <li><input type="checkbox"> Arduino IDE — <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">arduino.cc/en/software</a></li>
              <li><input type="checkbox"> ESP32 board support (next steps)</li>
              <li><input type="checkbox"> USB-serial driver: CP2102 or CH340 — match the chip near the USB port</li>
            </ul>
          `,
          facilitator: "If someone has a charge-only cable, the board will power but never appear as a COM port. Swap the cable before chasing drivers.",
        },
        {
          id: "board-support",
          title: "Install ESP32 board support",
          checkpoint: "Boards Manager shows the esp32 package by Espressif Systems as installed.",
          html: `
            <ol class="steps-ol">
              <li>Open Arduino IDE → <strong>File → Preferences</strong>.</li>
              <li>In <strong>Additional Boards Manager URLs</strong>, paste:</li>
            </ol>
            ${codeBlock("Boards Manager URL", "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json")}
            <ol class="steps-ol" start="3">
              <li><strong>Tools → Board → Boards Manager</strong>, search <code>esp32</code>, install the package by Espressif Systems.</li>
              <li>Restart Arduino IDE.</li>
            </ol>
          `,
        },
        {
          id: "select-board",
          title: "Select board and port",
          checkpoint: "Tools → Port shows a COM port (Windows) or /dev/cu.usbserial-… (Mac) while the board is plugged in.",
          html: `
            <ol class="steps-ol">
              <li><strong>Tools → Board → ESP32 Arduino</strong> → pick your board. If unsure, use <strong>ESP32 Dev Module</strong>.</li>
              <li>Plug in the board with the data cable.</li>
              <li><strong>Tools → Port</strong> → select the port that appears when you plug in.</li>
            </ol>
            <div class="callout warn">
              <p>If nothing appears: try another USB cable first (most common cause), then install the CP2102/CH340 driver for the chip next to USB.</p>
            </div>
            <p class="only-beginner callout">A COM port is just the laptop’s name for “this USB serial device.” No port means the laptop does not see the chip.</p>
          `,
          facilitator: "Don’t silently pick the port for them. Ask what they would try first.",
        },
        {
          id: "blink",
          title: "Sanity check: Blink",
          checkpoint: "The onboard LED blinks after upload. Toolchain is confirmed.",
          facilitator: "Do not move the room on until every pair has a blinking LED. Everything downstream depends on this.",
          html: `
            <p>In Arduino IDE: <strong>File → Open</strong> <code>sketches/00_blink/00_blink.ino</code>. The folder name and the <code>.ino</code> name must match. On most DevKit boards the onboard LED is GPIO 2 (<code>LED_BUILTIN</code>).</p>
            ${codeBlock(
              "00_blink.ino",
              `/*
  00 Blink
  Arduino IDE: File -> Open this file (folder name must match 00_blink.ino).
  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
*/

#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#endif

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}`
            )}
            <div class="callout">
              <p>If upload sticks on “Connecting…” hold the <strong>BOOT</strong> button on the board during upload, then release.</p>
            </div>
          `,
        },
      ],
    },
    {
      id: "module2",
      title: "Module 1 — LDR",
      steps: [
        {
          id: "analog",
          title: "Why analog?",
          html: `
            <p class="lede">Goal: watch light levels change in real time on Serial Monitor.</p>
            <div class="hide-expert callout">
              <p>Blink was digital: on or off. An LDR is analog: a number from 0 to 4095. That number is how we decide “beam present” vs “beam broken.” There is no push button in this build.</p>
            </div>
            <p>GPIO 34 is on <strong>ADC1</strong>, so it still works after WiFi starts. ADC2 pins do not mix well with WiFi.</p>
          `,
        },
        {
          id: "ldr-wiring",
          title: "Wire the LDR module",
          checkpoint: "LDR VCC is on 3.3V, GND on GND, AO on GPIO 34. DO is unconnected.",
          html: `
            ${SVG_LDR}
            <table class="data-table">
              <thead><tr><th>LDR module</th><th>ESP32</th></tr></thead>
              <tbody>
                <tr><td>VCC</td><td><code>3.3V</code></td></tr>
                <tr><td>GND</td><td><code>GND</code></td></tr>
                <tr><td>AO</td><td><code>GPIO 34</code></td></tr>
                <tr><td>DO</td><td>Not connected</td></tr>
              </tbody>
            </table>
          `,
        },
        {
          id: "ldr-code",
          title: "Read light on Serial Monitor",
          checkpoint: "Serial Monitor at 115200 shows numbers that change when I cover the LDR.",
          facilitator: "Have people cover the LDR and call out their number. Different seats have different ambient light — that is the hook for calibrating a threshold instead of hardcoding one.",
          html: `
            <p>After upload: <strong>Tools → Serial Monitor</strong> (Ctrl+Shift+M). Set baud to <strong>115200</strong> in the bottom-right dropdown. Mismatched baud is the usual cause of garbled text.</p>
            <p class="note">Arduino IDE: <strong>File → Open</strong> <code>sketches/02_ldr_serial/02_ldr_serial.ino</code></p>
            ${codeBlock(
              "02_ldr_serial.ino",
              `#define LDR_PIN 34

void setup() {
  Serial.begin(115200);
}

void loop() {
  int lightValue = analogRead(LDR_PIN);
  Serial.println(lightValue);
  delay(200);
}`
            )}
          `,
        },
      ],
    },
    {
      id: "module3",
      title: "Module 2 — Laser tripwire",
      steps: [
        {
          id: "aim-laser",
          title: "Aim the laser at the LDR",
          checkpoint: "The laser spot hits the LDR sensing face at a fixed distance (start at 15–20 cm).",
          html: `
            ${SVG_TRIPWIRE}
            <p>Mount or hold the laser so the beam points at the LDR. Close and stable is better than far and shaky for the first test.</p>
            <div class="callout danger">
              <p>Do not look into the laser. Treat it like any other small laser pointer: never at faces.</p>
            </div>
          `,
        },
        {
          id: "power-laser",
          title: "Power the laser by itself first",
          checkpoint: "The laser lights up when powered from 3.3V or 5V per its rating, before it is part of the ESP32 sketch logic.",
          facilitator: "Teach this as a habit: isolate hardware faults from code faults.",
          html: `
            <p><strong>Do this before treating the laser as an ESP32 problem.</strong> Connect the module <code>+</code> / <code>−</code> to 3.3V or 5V (check the module rating) and confirm the beam.</p>
            <p>If the laser is dead here, no sketch will save it. If it lights here, later bugs are wiring, threshold, or code.</p>
          `,
        },
        {
          id: "tripwire-wire",
          title: "Keep LDR + alarm LED wired",
          html: `
            <p>LDR stays as in Module 1. Wire GPIO 5 as the <strong>alarm LED</strong>: on means the beam is broken. No button — the laser + LDR is the only sensor.</p>
            <div class="hide-expert callout">
              <p><strong>Digital output:</strong> the LED pin is HIGH (about 3.3 V) when an intruder is detected, and LOW (0 V) when the beam is clear.</p>
            </div>
            <table class="data-table">
              <thead><tr><th>Part</th><th>ESP32</th></tr></thead>
              <tbody>
                <tr><td>LDR VCC</td><td>3.3V</td></tr>
                <tr><td>LDR GND</td><td>GND</td></tr>
                <tr><td>LDR AO</td><td>GPIO 34</td></tr>
                <tr><td>Alarm LED</td><td>GPIO 5 through 220Ω to GND</td></tr>
                <tr><td>Buzzer</td><td>Not this session (GPIO 18 reserved)</td></tr>
              </tbody>
            </table>
          `,
        },
        {
          id: "threshold",
          title: "Calibrate your threshold",
          facilitator: "Have them write beam-present and beam-broken numbers on paper, then set THRESHOLD between them. No magic 2500 without measuring.",
          html: `
            <p>With the LDR sketch still running, write down two Serial numbers:</p>
            <ol class="steps-ol">
              <li>Beam hitting the LDR (NORMAL).</li>
              <li>Hand blocking the beam (INTRUDER).</li>
            </ol>
            <p>On many LDR modules, blocking the beam <strong>raises</strong> the analog value (darker = bigger number). The sketches use <code>lightValue &gt; THRESHOLD</code> for that case.</p>
            <div class="threshold-tool">
              <h3>Threshold helper</h3>
              <label>Beam ON (laser hitting LDR)</label>
              <input type="number" data-th-on placeholder="e.g. 1200" />
              <label>Beam OFF (hand blocking)</label>
              <input type="number" data-th-off placeholder="e.g. 3100" />
              <p class="th-result">Enter both readings from Serial Monitor.</p>
            </div>
          `,
        },
        {
          id: "simulator",
          title: "What detection should look like",
          html: `
            <p>The real alarm comes from hardware. This is only so you know the two states before you upload.</p>
            <div class="simulator">
              <h3>Simulated tripwire</h3>
              <div class="sim-stage">
                <div class="sim-laser">LASER</div>
                <div class="sim-beam"></div>
                <div class="sim-ldr">LDR</div>
              </div>
              <button type="button" class="ghost-btn" data-sim-toggle>Wave a hand through the beam</button>
              <p class="sim-status ok">NORMAL</p>
            </div>
          `,
        },
        {
          id: "tripwire-code",
          title: "Run the serial tripwire",
          checkpoint: "Waving a hand through the beam flips Serial from NORMAL to INTRUDER DETECTED and turns the GPIO 5 LED on.",
          html: `
            <p>Put <strong>your</strong> midpoint in <code>THRESHOLD</code>. 2500 is only a starting guess.</p>
            <p class="note">Arduino IDE: <strong>File → Open</strong> <code>sketches/03_tripwire_serial/03_tripwire_serial.ino</code></p>
            ${codeBlock(
              "03_tripwire_serial.ino",
              `#define LDR_PIN 34
#define LED_PIN 5
#define THRESHOLD 2500
// #define BUZZER_PIN 18  // later -- do not use this pin

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightValue = analogRead(LDR_PIN);

  if (lightValue > THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("INTRUDER DETECTED");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("NORMAL");
  }

  delay(200);
}`
            )}
          `,
        },
      ],
    },
    {
      id: "dashboard",
      title: "Live dashboard",
      steps: [
        {
          id: "dash-intro",
          title: "The board hosts the page",
          html: `
            <p class="lede">When the beam breaks, the ESP32 already knows. Now a browser should say it too.</p>
            <p>The next sketch turns the ESP32 into a small Wi-Fi access point named <strong>IntruderLab</strong>. The dashboard is at <strong>http://192.168.4.1</strong>. No room Wi-Fi and no internet required.</p>
            <div class="callout">
              <p>Keep this playbook open as a local file. Connecting to IntruderLab does not break <code>file://</code> pages.</p>
            </div>
            <ul>
              <li>Same LDR + LED logic as Module 2.</li>
              <li>Page polls <code>/status</code> for JSON: <code>intruder</code>, <code>light</code>, <code>threshold</code>.</li>
              <li>Serial Monitor still prints NORMAL / INTRUDER DETECTED if the phone page is awkward.</li>
            </ul>
          `,
        },
        {
          id: "dash-upload",
          title: "Upload the dashboard sketch",
          checkpoint: "Sketch 04 uploaded. Serial Monitor says the access point IntruderLab is up.",
          html: `
            <p>Keep your calibrated <code>THRESHOLD</code>. In Arduino IDE use <strong>File → Open</strong> on <code>sketches/04_tripwire_dashboard/04_tripwire_dashboard.ino</code>. You should see two tabs: the <code>.ino</code> and <code>dashboard.h</code>. Leave both in the folder and upload.</p>
            ${codeBlock(
              "04_tripwire_dashboard.ino",
              `#include <WiFi.h>
#include <WebServer.h>
#include "dashboard.h"

#define LDR_PIN 34
#define LED_PIN 5
#define THRESHOLD 2500
#define AP_SSID "IntruderLab"

WebServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID);
  server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.begin();
}

void loop() {
  int lightValue = analogRead(LDR_PIN);

  if (lightValue > THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("INTRUDER DETECTED");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("NORMAL");
  }

  server.handleClient();
}`
            )}
            <div class="callout warn">
              <p>Do not paste only this excerpt into a blank sketch. Open the whole folder so <code>dashboard.h</code> is compiled as the second tab.</p>
            </div>
          `,
        },
        {
          id: "dash-connect",
          title: "Open the live dashboard",
          checkpoint: "I joined IntruderLab, opened http://192.168.4.1, and a beam-break shows INTRUDER DETECTED on the page and lights the LED.",
          html: `
            <ol class="steps-ol">
              <li>On your laptop or phone, join Wi-Fi <strong>IntruderLab</strong> (open network, no password).</li>
              <li>In a browser, go to <strong>http://192.168.4.1</strong>.</li>
              <li>Confirm the page shows <strong>NORMAL</strong> with the beam on the LDR.</li>
              <li>Wave a hand through the beam. The page should flash <strong>INTRUDER DETECTED</strong> and GPIO 5 should light.</li>
            </ol>
            <div class="callout">
              <p>Some phones warn that the network has no internet. Stay connected anyway. This network is only for the board.</p>
            </div>
          `,
        },
      ],
    },
    {
      id: "troubleshoot",
      title: "Troubleshoot",
      steps: [
        {
          id: "trouble",
          title: "If it does not work",
          html: `
            <p>Match the symptom. Change one thing at a time.</p>
            <div class="accordion">
              <details open>
                <summary>Board does not show up in Tools → Port</summary>
                <p>Charge-only USB cable (try another first), or missing CP2102/CH340 driver.</p>
              </details>
              <details>
                <summary>Serial Monitor shows garbled symbols</summary>
                <p>Baud mismatch. Code and Serial Monitor dropdown must both be 115200.</p>
              </details>
              <details>
                <summary>LED never turns on</summary>
                <p>Shared GND, resistor, polarity (long leg = anode). For the tripwire, also confirm THRESHOLD and that GPIO 5 is the alarm LED.</p>
              </details>
              <details>
                <summary>analogRead always 0 or 4095</summary>
                <p>Wrong pin (must be ADC-capable). LDR must have 3.3V and GND. Use GPIO 34.</p>
              </details>
              <details>
                <summary>Analog readings die after WiFi</summary>
                <p>That is an ADC2 pin. This workshop stays on GPIO 34 (ADC1) on purpose.</p>
              </details>
              <details>
                <summary>Upload stuck on Connecting…</summary>
                <p>Hold BOOT during upload. Try a shorter data cable or a powered hub if the board resets.</p>
              </details>
              <details>
                <summary>Cannot see IntruderLab or 192.168.4.1</summary>
                <p>Confirm sketch 04 uploaded. Wait a few seconds after reset. Disable VPN. On some laptops, set the Wi-Fi as a metered/open network and ignore “no internet.”</p>
              </details>
            </div>
          `,
        },
      ],
    },
    {
      id: "next",
      title: "Coming next",
      steps: [
        {
          id: "buzzer",
          title: "Buzzer (not this session)",
          html: `
            <p><span class="locked-banner">Coming next — do not wire yet</span></p>
            <p class="lede">Today stops at Serial + LED + live dashboard. Sound is the add-on after that stack is reliable.</p>
            <table class="data-table">
              <thead><tr><th>Item</th><th>Plan</th></tr></thead>
              <tbody>
                <tr><td>Part</td><td>Active buzzer (HIGH = sound)</td></tr>
                <tr><td>Pin</td><td><code>GPIO 18</code> only — already reserved in every sketch comment</td></tr>
                <tr><td>Logic</td><td><code>digitalWrite(BUZZER_PIN, intruder ? HIGH : LOW)</code></td></tr>
                <tr><td>Classroom</td><td>Pulse the buzzer so it is not a continuous scream</td></tr>
                <tr><td>Dashboard</td><td>Same <code>/status</code> JSON — no new protocol</td></tr>
              </tbody>
            </table>
            <div class="callout warn">
              <p>Do not put a buzzer on GPIO 34 (input-only, LDR) or GPIO 5 (alarm LED). Leave GPIO 18 empty until the follow-on module.</p>
            </div>
            <p>If the tripwire and dashboard both work, you are done for this workshop.</p>
          `,
        },
      ],
    },
  ],
};
