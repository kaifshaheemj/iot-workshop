function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function codeBlock(filename, source, canCopy = true) {
  const copyButton = canCopy ? '<button type="button" class="copy-btn">Copy code</button>' : "";
  return `<div class="code-block"><header><span>${filename}</span>${copyButton}</header><pre>${escapeHtml(source.trim())}</pre></div>`;
}

function exerciseCodeBlock(filename, source) {
  return codeBlock(filename, source, false);
}

function sketchLink(path, label) {
  return `<a class="download-link" href="../sketches/${path}" download>${label}<span aria-hidden="true">↓</span></a>`;
}

function exerciseDiagram(number, title) {
  const path = `../sketches/exercises/Exercise${number}/circuit_diagram.svg`;
  return `<figure class="circuit-figure"><img src="${path}" alt="${title} circuit diagram"><figcaption><span>${title}</span><a href="${path}" target="_blank" rel="noopener">Open full diagram</a></figcaption></figure>`;
}

function projectDiagram(path, title) {
  const source = `../sketches/${path}`;
  return `<figure class="circuit-figure"><img src="${source}" alt="${title} wiring diagram"><figcaption><span>${title}</span><a href="${source}" target="_blank" rel="noopener">Open full diagram</a></figcaption></figure>`;
}

window.PLAYBOOK_ID = "iot-university-day-v5";

window.PLAYBOOK_META = {
  title: "IoT Build Lab",
  kicker: "Anna University workshop",
  unlockCode: "AFTERNOON",
  referenceTitle: "Workshop reference",
  referenceNote: "Morning exercise pins are reused. Disconnect USB and clear the previous circuit before every exercise.",
  referenceRows: [
    ["Presentation", "20 slides", "75-minute facilitated block"],
    ["Exercises 1–3", "LEDs and buttons", "GPIO 16–19, 25–27, 32"],
    ["Exercises 4–5", "LDR 34 or DHT11 4 + 16×2 LCD", "LCD SDA 21 / SCL 22"],
    ["Exercise 5", "Passive buzzer through NPN driver", "GPIO 27 · separate 5 V load"],
    ["Exercises 6 and 8", "SH1106 OLED SDA 21 / SCL 22", "Ultrasonic 5/18 or microphone A0 34"],
    ["Exercise 7", "Servo signal 13", "External 5 V + common GND"],
  ],
  afternoonReferenceNote: "These pin maps come directly from the final POC sketches. Disconnect USB before changing any wire.",
  afternoonReferenceRows: [
    ["Traffic", "Red 4, yellow 2, green 16, KY-037 DO 17", "OLED SDA 22 / SCL 21 · Wi-Fi: TrafficSignal"],
    ["Tripwire", "LDR AO 34, laser S 25, buzzer SIG 27", "Serial: 115200"],
    ["Reaction", "LEDs 16 / 17 / 18 / 19", "Buttons 25 / 26 / 27 / 32 · Wi-Fi: Reaction Arena"],
  ],
};

window.PLAYBOOK = {
  modules: [
    {
      id: "intro",
      title: "Start here",
      phaseLabel: "Morning",
      steps: [
        {
          id: "welcome",
          title: "Build, observe, improve",
          duration: "3 min",
          checkpoint: "I understand the learning loop: build one behavior, prove it, change one value, and observe the result before moving on.",
          facilitator: "Keep the project names hidden until the afternoon unlock. The learning method is the reveal here.",
          html: `
            <section class="hero-card">
              <p class="hero-label">Your workshop mission</p>
              <h2>Presentation, focused exercises, then complete IoT projects.</h2>
              <p>The morning builds shared understanding and eight practical skills. After lunch, your team combines those skills into complete systems.</p>
            </section>
            <div class="day-plan">
              <article><span>01</span><strong>Presentation</strong><small>75 minutes · shared foundations</small></article>
              <article><span>02</span><strong>Exercise sprint</strong><small>125 minutes · eight focused builds</small></article>
              <article><span>03</span><strong>Project lab</strong><small>After lunch · three integrated POCs</small></article>
            </div>
            <h2 class="section-heading">Use the same method at every stage</h2>
            <div class="journey-grid">
              <article><span>01</span><h3>Build</h3><p>Wire or code one small behavior.</p></article>
              <article><span>02</span><h3>Observe</h3><p>Use LEDs, Serial Monitor, or a page as evidence.</p></article>
              <article><span>03</span><h3>Tune</h3><p>Change one named constant and upload again.</p></article>
              <article><span>04</span><h3>Explain</h3><p>Connect the result to sense → decide → act.</p></article>
            </div>
            <div class="callout">
              <p><strong>How to use this playbook:</strong> do the action, test the expected result, then tick the checkpoint. Your browser saves progress on this device.</p>
            </div>
            <p class="callout">The ESP32 is a small computer. Arduino IDE turns your sketch into instructions and uploads them through the USB cable. After upload, the program runs on the ESP32.</p>
          `,
        },
      ],
    },
    {
      id: "presentation",
      title: "Presentation",
      phaseLabel: "Morning · 75 min",
      steps: [
        {
          id: "presentation-deck",
          title: "From sensors to smart systems",
          duration: "75 min",
          checkpoint: "The presentation and discussion are complete, and I can describe how an ESP32 senses, decides, acts, and communicates.",
          facilitator: "The source deck labels itself as 45 minutes. Use its questions, predictions, demonstrations, and discussion prompts to deliver the planned 75-minute facilitated block.",
          html: `
            <section class="hero-card presentation-hero">
              <p class="hero-label">Morning presentation · 20 slides</p>
              <h2>From Sensors to Smart Systems</h2>
              <p>Follow one recurring challenge through ESP32 foundations, inputs, outputs, Arduino structure, communication, debugging, Wi-Fi, and the sense → decide → act → communicate model.</p>
            </section>
            <div class="presentation-actions">
              <a class="download-link primary-link" href="slides.html">Open the presentation<span aria-hidden="true">→</span></a>
              <a class="download-link" href="../presentations/From-Sensors-to-Smart-Systems.pptx" download>Download the workshop presentation<span aria-hidden="true">↓</span></a>
              <a class="download-link" href="../presentations/IOT-Workshop-Prep-Book.pptx" download>Download the prep book<span aria-hidden="true">↓</span></a>
            </div>
            <div class="concept-grid three">
              <article><p class="concept-label">Part 1</p><h3>ESP32 foundations</h3><p>Processor, memory, GPIO, ADC, PWM, and electrical safety.</p></article>
              <article><p class="concept-label">Part 2</p><h3>Physical interfaces</h3><p>Buttons, sensors, LEDs, displays, motors, buses, and wireless links.</p></article>
              <article><p class="concept-label">Part 3</p><h3>From code to IoT</h3><p>Arduino structure, compilation, Serial debugging, SoftAP, and web requests.</p></article>
            </div>
            <div class="callout"><p><strong>Use both views:</strong> the browser presentation works fullscreen and offline; the original PowerPoint is available when speaker notes or editing are needed.</p></div>
          `,
        },
      ],
    },
    {
      id: "exercise-setup",
      title: "Exercise setup",
      phaseLabel: "Morning · practice",
      steps: [
        {
          id: "exercise-briefing",
          title: "Prepare for eight short builds",
          duration: "5 min",
          checkpoint: "Our team has Arduino IDE, the ESP32 port, required libraries, and the first exercise parts ready.",
          facilitator: "Use one driver and one navigator per team. Rotate the driver after each exercise and keep teams moving from evidence, not from elapsed time alone.",
          html: `
            <section class="hero-card exercise-hero">
              <p class="hero-label">Morning exercises · 125 min</p>
              <h2>Eight small builds turn the presentation into evidence.</h2>
              <p>Each exercise isolates one idea. Open the supplied sketch, prove the baseline, change one named value, and explain the result to your team.</p>
            </section>
            <div class="challenge-grid">
              <article><span>Build</span><h3>Follow the diagram</h3><p>Disconnect USB before rewiring and check every GPIO against the current exercise.</p></article>
              <article><span>Prove</span><h3>Look for evidence</h3><p>Use the physical output, Serial Monitor at 115200, a display, or the local web page.</p></article>
              <article><span>Tune</span><h3>Change one value</h3><p>Predict first, upload once, and compare the new behavior with the baseline.</p></article>
            </div>
            <h2>Libraries used later in the sprint</h2>
            <table class="data-table"><thead><tr><th>Exercises</th><th>Arduino libraries</th></tr></thead><tbody><tr><td>1–3</td><td>No additional libraries</td></tr><tr><td>4</td><td>LiquidCrystal I2C</td></tr><tr><td>5</td><td>DHT sensor library + Adafruit Unified Sensor + LiquidCrystal I2C</td></tr><tr><td>6 and 8</td><td>Adafruit GFX Library + Adafruit SH110X</td></tr><tr><td>7</td><td>ESP32Servo; WiFi and WebServer come with ESP32 support</td></tr></tbody></table>
            <div class="callout warn"><p><strong>Pins are reused.</strong> A GPIO used in one morning exercise may have a different job later. Clear the breadboard and follow the current diagram every time.</p></div>
          `,
        },
      ],
    },
    {
      id: "exercise-1",
      title: "Exercise 1 · LED chase",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-1-run",
          title: "Sequence four LEDs",
          duration: "12 min",
          checkpoint: "All four LEDs chase forward and back, and changing STEP_DELAY_MS visibly changes the speed.",
          html: `
            <div class="exercise-badge">Exercise 1 of 8 · digital output</div>
            <p class="lede">Start with the simplest proof that code can control several physical outputs in order.</p>
            ${exerciseDiagram(1, "Four LED chase")}
            <table class="data-table"><thead><tr><th>LED</th><th>GPIO</th><th>Connection</th></tr></thead><tbody><tr><td>1 / 2 / 3 / 4</td><td>16 / 17 / 18 / 19</td><td>GPIO → current-limiting resistor → anode; cathode → GND</td></tr></tbody></table>
            ${sketchLink("exercises/Exercise1/Exercise1.ino", "Download Exercise 1 sketch")}
            ${exerciseCodeBlock("Tune the chase speed", `const uint16_t STEP_DELAY_MS = 250;

for (uint8_t i = 0; i < LED_COUNT; i++) {
  digitalWrite(LED_PINS[i], HIGH);
  delay(STEP_DELAY_MS);
  digitalWrite(LED_PINS[i], LOW);
}`)}
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Compare 80 ms, 250 ms, and 700 ms</h3><p>Predict which will feel fastest. Upload each value and decide which makes the forward/back pattern easiest to see.</p></section>
          `,
        },
      ],
    },
    {
      id: "exercise-2",
      title: "Exercise 2 · Buttons",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-2-run",
          title: "Map four buttons to four LEDs",
          duration: "15 min",
          checkpoint: "Each button controls only its matching LED, and I tested how DEBOUNCE_MS affects responsiveness.",
          html: `
            <div class="exercise-badge">Exercise 2 of 8 · digital input</div>
            <p class="lede">Each button is a digital input. Each input drives the LED at the same array position.</p>
            ${exerciseDiagram(2, "Four buttons controlling four LEDs")}
            <table class="data-table"><thead><tr><th>Channel</th><th>Button GPIO</th><th>LED GPIO</th></tr></thead><tbody><tr><td>1</td><td>25</td><td>16</td></tr><tr><td>2</td><td>26</td><td>17</td></tr><tr><td>3</td><td>27</td><td>18</td></tr><tr><td>4</td><td>32</td><td>19</td></tr></tbody></table>
            <div class="callout"><p>Each input node uses an external 10 kΩ pull-up to 3.3 V and a push button to GND. A pressed button reads <code>LOW</code>. The updated build uses software debounce only—do not add debounce capacitors.</p></div>
            ${sketchLink("exercises/Exercise2/Exercise2.ino", "Download Exercise 2 sketch")}
            ${exerciseCodeBlock("The debounce rule", `const uint32_t DEBOUNCE_MS = 25;

if (reading != buttons[i].raw) {
  buttons[i].raw = reading;
  buttons[i].changedAt = now;
}

if (now - buttons[i].changedAt >= DEBOUNCE_MS) {
  buttons[i].stable = buttons[i].raw;
}`)}
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Try 5 ms and 120 ms</h3><p>A very short filter can admit contact bounce. A long filter can feel slow. Choose a value that gives one clean, responsive action.</p></section>
          `,
        },
      ],
    },
    {
      id: "exercise-3",
      title: "Exercise 3 · Timed signal",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-3-run",
          title: "Build a traffic-light sequence",
          duration: "12 min",
          checkpoint: "The LEDs follow red → red+yellow → green → yellow, and I changed one delay and observed its effect.",
          html: `
            <div class="exercise-badge">Exercise 3 of 8 · timed outputs</div>
            <p class="lede">Reuse the output idea, but give each state a meaning and duration.</p>
            ${exerciseDiagram(3, "Timed traffic light")}
            <table class="data-table"><thead><tr><th>Light</th><th>GPIO</th></tr></thead><tbody><tr><td>Red</td><td>16 through a current-limiting resistor</td></tr><tr><td>Yellow</td><td>17 through a current-limiting resistor</td></tr><tr><td>Green</td><td>18 through a current-limiting resistor</td></tr></tbody></table>
            ${sketchLink("exercises/Exercise3/Exercise3.ino", "Download Exercise 3 sketch")}
            ${exerciseCodeBlock("Four signal states", `setLights(true, false, false);
delay(5000);
setLights(true, true, false);
delay(1000);
setLights(false, false, true);
delay(5000);
setLights(false, true, false);
delay(2000);`)}
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Make one state unmistakable</h3><p>Change only one delay. Predict the total cycle time before timing it with a phone stopwatch.</p></section>
          `,
        },
      ],
    },
    {
      id: "exercise-4",
      title: "Exercise 4 · LDR light meter",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-4-wire",
          title: "Wire the LDR and 16×2 LCD",
          duration: "8 min",
          checkpoint: "LDR A0 is on GPIO 34 with 3.3 V power, and the 16×2 LCD is connected to SDA 21 and SCL 22 with a common ground.",
          html: `
            <div class="exercise-badge">Exercise 4 of 8 · analog light + I²C LCD</div>
            ${exerciseDiagram(4, "LDR light intensity on 16×2 LCD")}
            <table class="data-table"><thead><tr><th>Part</th><th>Connection</th></tr></thead><tbody><tr><td>LDR module VCC / GND</td><td>ESP32 3.3V / shared GND</td></tr><tr><td>LDR A0</td><td>GPIO 34</td></tr><tr><td>LDR D0</td><td>Not connected</td></tr><tr><td>LCD SDA / SCL</td><td>GPIO 21 / GPIO 22</td></tr><tr><td>LCD VCC / GND</td><td>5V / shared GND, following the updated diagram</td></tr></tbody></table>
            <div class="callout danger"><p>A 5 V LCD backpack may pull SDA and SCL up to 5 V. Use a backpack with 3.3 V-safe I²C levels or the bidirectional level shifting specified for the kit. Never expose ESP32 GPIO 21 or 22 to 5 V.</p></div>
          `,
        },
        {
          id: "exercise-4-run",
          title: "Measure relative light intensity",
          duration: "10 min",
          checkpoint: "Serial and the LCD show the same ADC value and relative light percentage, and I confirmed whether my sensor needs the reversed scale.",
          html: `
            ${sketchLink("exercises/Exercise4/Exercise4.ino", "Download updated Exercise 4 sketch")}
            ${exerciseCodeBlock("Detect the LCD and map the LDR", `const uint8_t LDR_A0_PIN = 34;
const bool REVERSE_LIGHT_SCALE = true;

uint8_t lcdAddress = scanForLcd();
uint16_t raw = analogRead(LDR_A0_PIN);
uint8_t lightPercent = REVERSE_LIGHT_SCALE
  ? map(raw, 4095, 0, 0, 100)
  : map(raw, 0, 4095, 0, 100);`)}
            <ol class="steps-ol action-list"><li><strong>Install</strong><span>Install LiquidCrystal I2C from Arduino Library Manager.</span></li><li><strong>Upload</strong><span>Serial at 115200 scans the bus and reports the LCD address, usually 0x27 or 0x3F.</span></li><li><strong>Compare</strong><span>Shine light on the LDR, then shade it. Confirm the displayed percentage moves in the expected direction.</span></li><li><strong>Correct direction</strong><span>If brighter light makes the percentage fall, toggle <code>REVERSE_LIGHT_SCALE</code> and retest.</span></li></ol>
            <div class="callout"><p>The percentage is a relative light level, not calibrated lux. Use the raw ADC number when comparing sensors or lighting conditions.</p></div>
          `,
        },
      ],
    },
    {
      id: "exercise-5",
      title: "Exercise 5 · Temperature alarm",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-5-wire",
          title: "Wire DHT11, LCD, and buzzer driver",
          duration: "8 min",
          checkpoint: "DHT11 data is on GPIO 4, the LCD is on SDA 21/SCL 22, and GPIO 27 drives the 5 V passive buzzer only through the 1 kΩ resistor and NPN transistor.",
          html: `
            <div class="exercise-badge">Exercise 5 of 8 · environmental sensor + alarm</div>
            ${exerciseDiagram(5, "DHT11 temperature alarm on 16×2 LCD")}
            <table class="data-table"><thead><tr><th>Part</th><th>Connection</th></tr></thead><tbody><tr><td>DHT11 VCC / GND / DATA</td><td>3.3V / shared GND / GPIO 4</td></tr><tr><td>LCD VCC / GND</td><td>5V / shared GND</td></tr><tr><td>LCD SDA / SCL</td><td>GPIO 21 / GPIO 22 through 3.3 V-safe I²C levels</td></tr><tr><td>Buzzer positive</td><td>5V</td></tr><tr><td>Buzzer negative</td><td>NPN transistor collector</td></tr><tr><td>NPN emitter</td><td>Shared GND</td></tr><tr><td>NPN base</td><td>GPIO 27 through 1 kΩ</td></tr></tbody></table>
            <div class="callout danger"><p>Never connect the 5 V passive buzzer directly to GPIO 27. The transistor is the load driver. Also keep 5 V LCD pull-ups away from ESP32 SDA/SCL by using the kit's 3.3 V-safe interface.</p></div>
            <div class="callout"><p>A bare DHT11 needs a DATA-to-3.3V pull-up resistor. Most three-pin DHT11 modules already include it.</p></div>
          `,
        },
        {
          id: "exercise-5-run",
          title: "Display readings and test the alarm",
          duration: "9 min",
          checkpoint: "The LCD and Serial show temperature and humidity, and the buzzer alternates 500 ms on/off only when temperature exceeds the configured limit.",
          html: `
            ${sketchLink("exercises/Exercise5/Exercise5.ino", "Download updated Exercise 5 sketch")}
            ${exerciseCodeBlock("Temperature decision and non-blocking buzzer", `const float TEMPERATURE_LIMIT_C = 35.0f;
const uint16_t BUZZER_FREQUENCY_HZ = 2000;
const uint32_t BUZZER_PHASE_MS = 500;

setTemperatureAlarm(temperature > TEMPERATURE_LIMIT_C, now);

if (alarmActive && now - lastBuzzerChangeAt >= BUZZER_PHASE_MS) {
  buzzerSounding = !buzzerSounding;
  if (buzzerSounding) tone(BUZZER_PIN, BUZZER_FREQUENCY_HZ);
  else noTone(BUZZER_PIN);
}`)}
            <ol class="steps-ol action-list"><li><strong>Install</strong><span>DHT sensor library, Adafruit Unified Sensor, and LiquidCrystal I2C.</span></li><li><strong>Upload</strong><span>Serial at 115200 reports the detected LCD address and new sensor readings every two seconds.</span></li><li><strong>Prove the safe baseline</strong><span>At normal room temperature, readings update and the buzzer stays silent.</span></li><li><strong>Test without overheating</strong><span>Temporarily set <code>TEMPERATURE_LIMIT_C</code> slightly below the measured room value, verify the beep pattern, then restore 35 °C.</span></li></ol>
            <div class="callout warn"><p>If a DHT read fails, the display reports the error. Correct wiring first; do not shorten the two-second sensor interval.</p></div>
          `,
        },
      ],
    },
    {
      id: "exercise-6",
      title: "Exercise 6 · Distance",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-6-wire",
          title: "Confirm the 3.3 V ultrasonic variant",
          duration: "8 min",
          checkpoint: "I verified the supplied sensor is the specified 3.3 V-compatible HC-SR04 variant before connecting ECHO directly to GPIO 18; the SH1106 OLED is on SDA 21/SCL 22.",
          html: `
            <div class="exercise-badge">Exercise 6 of 8 · ultrasonic timing + SH1106 OLED</div>
            ${exerciseDiagram(6, "3.3 V HC-SR04 distance on SH1106 OLED")}
            <table class="data-table"><thead><tr><th>Part</th><th>Connection</th></tr></thead><tbody><tr><td>3.3 V-compatible HC-SR04 VCC / GND</td><td>3.3V / shared GND</td></tr><tr><td>TRIG</td><td>GPIO 5</td></tr><tr><td>ECHO</td><td>GPIO 18 directly—only for the specified 3.3 V-output variant</td></tr><tr><td>SH1106 OLED VCC / GND</td><td>3.3V / shared GND</td></tr><tr><td>OLED SDA / SCL</td><td>GPIO 21 / GPIO 22</td></tr><tr><td>OLED address</td><td><code>0x3C</code></td></tr></tbody></table>
            <div class="callout danger"><p><strong>Stop if the sensor is a standard 5 V-output HC-SR04.</strong> Its ECHO pin must not connect directly to the ESP32. Use the specifically supplied 3.3 V-compatible variant, or add a proper divider and follow a matching diagram.</p></div>
          `,
        },
        {
          id: "exercise-6-run",
          title: "Show measured distance on the OLED",
          duration: "10 min",
          checkpoint: "The SH1106 and Serial show the same distance, a flat target tracks toward and away, and an out-of-range test reports No echo.",
          html: `
            ${sketchLink("exercises/Exercise6/Exercise6.ino", "Download updated Exercise 6 sketch")}
            ${exerciseCodeBlock("Measure the round-trip pulse", `uint32_t duration = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
if (duration == 0) return -1.0f;
return duration * 0.0343f / 2.0f;`)}
            <ol class="steps-ol action-list"><li><strong>Install</strong><span>Adafruit GFX Library and Adafruit SH110X.</span></li><li><strong>Upload</strong><span>Open Serial at 115200 and confirm the SH1106 starts.</span></li><li><strong>Measure</strong><span>Compare a flat target at 10, 20, and 40 cm with a ruler.</span></li><li><strong>Test timeout</strong><span>Point away from a target and confirm the display reports No echo rather than a false distance.</span></li></ol>
            <div class="callout"><p>The pulse travels to the object and back, so the calculation divides by two. <code>0.0343</code> approximates the speed of sound in centimetres per microsecond.</p></div>
          `,
        },
      ],
    },
    {
      id: "exercise-7",
      title: "Exercise 7 · Wi-Fi servo",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-7-wire",
          title: "Wire a safely powered servo",
          duration: "8 min",
          checkpoint: "The servo signal is on GPIO 13, its red wire uses a suitable external 5 V supply, and the supply, servo, and ESP32 grounds are joined.",
          html: `
            <div class="exercise-badge">Exercise 7 of 8 · servo + local web page</div>
            ${exerciseDiagram(7, "Wi-Fi servo angle control")}
            <table class="data-table"><thead><tr><th>Servo wire</th><th>Connection</th></tr></thead><tbody><tr><td>Orange/yellow signal</td><td>GPIO 13</td></tr><tr><td>Red power</td><td>Suitable external regulated 5 V</td></tr><tr><td>Brown/black ground</td><td>External supply GND and ESP32 GND</td></tr></tbody></table>
            <div class="callout warn"><p>Do not power the servo from an ESP32 GPIO. Disconnect power before attaching or moving the servo arm, and begin with no mechanical load.</p></div>
            <div class="callout"><p>The updated Exercise 7 has no relay. Remove all relay wiring from the previous version before powering this circuit.</p></div>
          `,
        },
        {
          id: "exercise-7-run",
          title: "Move the servo from a browser slider",
          duration: "10 min",
          checkpoint: "I joined ESP32-Servo, opened the local page, moved the servo with the 0–180° slider, and identified a safe mechanical range.",
          html: `
            ${sketchLink("exercises/Exercise7/Exercise7.ino", "Download updated Exercise 7 sketch")}
            <ol class="steps-ol action-list"><li><strong>Install</strong><span>Install ESP32Servo. WiFi and WebServer come with the ESP32 board package.</span></li><li><strong>Upload</strong><span>Serial at 115200 prints the access-point name and local IP.</span></li><li><strong>Connect</strong><span>Join <strong>ESP32-Servo</strong> with password <code>esp32demo</code>.</span></li><li><strong>Open</strong><span>Browse to <strong>http://192.168.4.1</strong> and move the angle slider gradually.</span></li></ol>
            ${exerciseCodeBlock("Validate the requested angle", `void handleServo() {
  servoAngle = constrain(server.arg("angle").toInt(), 0, 180);
  servoMotor.write(servoAngle);
  server.send(200, "text/plain", String(servoAngle));
}`)}
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Choose a safe servo range</h3><p>Move slowly. If an attached arm approaches a stop or binds, reduce the page slider's minimum or maximum before continuing.</p></section>
          `,
        },
      ],
    },
    {
      id: "exercise-8",
      title: "Exercise 8 · Clap counter",
      phaseLabel: "Morning · exercise",
      steps: [
        {
          id: "exercise-8-calibrate",
          title: "Wire the analog microphone and SH1106",
          duration: "7 min",
          checkpoint: "Microphone A0 is on GPIO 34, D0 is unconnected, the SH1106 is on SDA 21/SCL 22, and the room stayed quiet during startup calibration.",
          html: `
            <div class="exercise-badge">Exercise 8 of 8 · analog event detection + OLED</div>
            ${exerciseDiagram(8, "Analog clap counter on SH1106 OLED")}
            <table class="data-table"><thead><tr><th>Part</th><th>Connection</th></tr></thead><tbody><tr><td>Microphone VCC / GND</td><td>3.3V / shared GND</td></tr><tr><td>Microphone A0</td><td>GPIO 34</td></tr><tr><td>Microphone D0</td><td>Not connected</td></tr><tr><td>SH1106 VCC / GND</td><td>3.3V / shared GND</td></tr><tr><td>OLED SDA / SCL</td><td>GPIO 21 / GPIO 22</td></tr><tr><td>OLED address</td><td><code>0x3C</code></td></tr></tbody></table>
            <div class="callout"><p>Keep the room quiet for the first second after reset. The sketch averages 500 microphone samples to learn the background baseline before counting claps.</p></div>
            <div class="callout warn"><p>The updated build uses microphone <strong>A0</strong>, not D0, and has no relay. Remove old relay wiring before uploading.</p></div>
          `,
        },
        {
          id: "exercise-8-run",
          title: "Count claps and tune detection",
          duration: "8 min",
          checkpoint: "Each deliberate clap increments the OLED counter once, ordinary room noise does not count, and I tuned CLAP_THRESHOLD or CLAP_LOCKOUT_MS using Serial evidence.",
          html: `
            ${sketchLink("exercises/Exercise8/Exercise8.ino", "Download updated Exercise 8 sketch")}
            ${exerciseCodeBlock("Measure deviation from the learned baseline", `uint16_t rawValue = analogRead(MIC_A0_PIN);
uint16_t signalLevel = abs((int)rawValue - (int)microphoneBaseline);

if (signalLevel >= CLAP_THRESHOLD &&
    now - lastClapAt >= CLAP_LOCKOUT_MS) {
  lastClapAt = now;
  clapCount++;
  showCounter();
}`)}
            <ol class="steps-ol action-list"><li><strong>Install</strong><span>Adafruit GFX Library and Adafruit SH110X.</span></li><li><strong>Calibrate</strong><span>Reset in a quiet room and note the baseline printed at 115200 baud.</span></li><li><strong>Observe</strong><span>Serial reports raw A0, signal level, and count every 250 ms.</span></li><li><strong>Tune one value</strong><span>Raise <code>CLAP_THRESHOLD</code> for false counts; lower it for missed claps. Adjust <code>CLAP_LOCKOUT_MS</code> only for duplicate counts.</span></li></ol>
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Separate sensitivity from lockout</h3><p>First tune the threshold so background noise stays below it. Then compare lockout values of 150, 350, and 800 ms using pairs of deliberate claps.</p></section>
          `,
        },
      ],
    },
    {
      id: "morning-complete",
      title: "Morning complete",
      phaseLabel: "Transition",
      steps: [
        {
          id: "unlock",
          title: "Open the project lab",
          duration: "After lunch",
          checkpoint: "The eight exercises are complete, the facilitator has given the code, and our project kit is ready.",
          facilitator: "Give the code AFTERNOON after lunch and after the exercise components have been reset. Preview with ?role=facilitator.",
          html: `
            <section class="unlock-hero">
              <p class="hero-label">Presentation + eight exercises complete</p>
              <h2>Move from isolated skills to complete IoT systems.</h2>
              <p>Clear the morning circuit, take the lunch break, and wait until the facilitator places the project kit on your table.</p>
              <div class="unlock-row">
                <input type="text" data-unlock-input autocomplete="off" placeholder="Enter workshop code" aria-label="Workshop unlock code" />
                <button type="button" class="nav-btn-next" data-unlock-submit>Open project lab</button>
              </div>
              <p class="unlock-feedback" data-unlock-feedback></p>
            </section>
          `,
        },
      ],
    },
    {
      id: "lab-setup",
      title: "Build lab",
      phase: "afternoon",
      phaseLabel: "Hands-on",
      teaser: "Three POCs · locked until the build session",
      steps: [
        {
          id: "lab-map",
          title: "Three systems, one method",
          duration: "4 min",
          html: `
            <section class="hero-card afternoon-hero">
              <p class="hero-label">Hands-on studio</p>
              <h2>Build three different sense → decide → act systems.</h2>
              <p>Each lab starts small. Keep working code, change one variable at a time, and use the visible hardware result as evidence before moving on.</p>
            </section>
            <div class="lab-grid">
              <article class="lab-card traffic-card"><span>Lab 01</span><h3>Adaptive traffic signal</h3><p>Cycle three LEDs, recognize repeated sound events, and hold green for priority.</p><small>Outputs → digital sound → OLED + web</small></article>
              <article class="lab-card tripwire-card"><span>Lab 02</span><h3>Laser tripwire</h3><p>Measure a laser beam with an LDR and sound a buzzer when the beam breaks.</p><small>Analog light → threshold → alarm</small></article>
              <article class="lab-card reaction-card"><span>Lab 03</span><h3>Reaction Arena</h3><p>Match one of four random LEDs with its button and compare multiplayer scores.</p><small>State machine → four inputs → local web game</small></article>
            </div>
            <div class="callout"><p><strong>Reset between labs:</strong> disconnect USB before rewiring. Check the Reference drawer for the active pin map.</p></div>
          `,
        },
        {
          id: "project-reset",
          title: "Reset the bench for projects",
          duration: "5 min",
          checkpoint: "The morning exercise circuit is removed, USB is disconnected, and our team has only the parts for the first project on the bench.",
          facilitator: "Check that all exercise wiring and relay connections have been removed before distributing project parts.",
          html: `
            <p class="lede">The afternoon projects reuse pins differently. A clean reset prevents yesterday's wire from becoming today's bug.</p>
            <ol class="steps-ol action-list">
              <li><strong>Disconnect power</strong><span>Unplug USB and every external supply.</span></li>
              <li><strong>Remove exercise wiring</strong><span>Clear LEDs, display, sensor, servo, and relay connections from the morning sprint.</span></li>
              <li><strong>Sort components</strong><span>Keep only the first project parts and current pin reference at the bench.</span></li>
              <li><strong>Inspect together</strong><span>One teammate reads the wiring list while another verifies the empty board.</span></li>
            </ol>
            <div class="callout warn"><p>Afternoon pins differ from the morning exercises. In Reaction Arena, GPIO 18 is an active LED output—not a reserved pin. Follow the current lab's diagram every time.</p></div>
          `,
        },
      ],
    },
    {
      id: "traffic",
      title: "Lab 1 · Traffic",
      phase: "afternoon",
      phaseLabel: "Hands-on",
      steps: [
        {
          id: "traffic-mission",
          title: "Mission: give an ambulance priority",
          duration: "3 min",
          checkpoint: "I can identify the KY-037 digital input, the event-count decision, and every output in the final Traffic Signal sketch.",
          html: `
            <section class="lab-intro traffic-intro">
              <div><p class="hero-label">Lab 01 · adaptive traffic</p><h2>Can repeated siren-like sound interrupt a timed signal safely?</h2><p>The final POC counts KY-037 digital sound events, switches to green for 15 seconds, and shows the same state on three LEDs, an SH1106 OLED, and a local web page.</p></div>
              <div class="signal-illustration" aria-label="Red yellow green traffic signal"><i></i><i></i><i></i></div>
            </section>
            <div class="concept-grid three">
              <article><p class="concept-label">Sense</p><h3>KY-037 DO · GPIO 17</h3><p>The module's trimpot sets its hardware sound threshold.</p></article>
              <article><p class="concept-label">Decide</p><h3>12 edges in 2 seconds</h3><p>Repeated events trigger ambulance mode; one random noise should not.</p></article>
              <article><p class="concept-label">Act + communicate</p><h3>Green, OLED, web</h3><p>The signal, countdown, mode, and controls remain visible.</p></article>
            </div>
            <div class="evidence-box"><strong>Final proof</strong><p>The LEDs cycle green → yellow → red. Repeated siren-like sound forces green, the OLED reports AMBULANCE, and the TrafficSignal web page follows the live state.</p></div>
          `,
        },
        {
          id: "traffic-wire-leds",
          title: "Stage 1: wire the three signal LEDs",
          duration: "8 min",
          checkpoint: "Red is on GPIO 4, yellow on GPIO 2, green on GPIO 16, and each LED has its own current-limiting resistor to shared GND.",
          html: `
            <p class="lede">Use the final sketch's pin map from the first wire onward.</p>
            ${projectDiagram("traffic/01_led_cycle/circuit_diagram.svg", "Traffic stage 1 · three signal LEDs")}
            <table class="data-table"><thead><tr><th>LED</th><th>ESP32 path</th><th>Final code name</th></tr></thead><tbody><tr><td><span class="wire-dot red-dot"></span>Red</td><td>GPIO 4 → 220 Ω → anode; cathode → GND</td><td><code>PIN_RED</code></td></tr><tr><td><span class="wire-dot yellow-dot"></span>Yellow</td><td>GPIO 2 → 220 Ω → anode; cathode → GND</td><td><code>PIN_YELLOW</code></td></tr><tr><td><span class="wire-dot green-dot"></span>Green</td><td>GPIO 16 → 220 Ω → anode; cathode → GND</td><td><code>PIN_GREEN</code></td></tr></tbody></table>
            <div class="callout warn"><p>Disconnect USB before rewiring. The LED's long leg is the anode. GPIO 2 is a boot strapping pin, so do not short it to 3.3 V or GND.</p></div>
          `,
        },
        {
          id: "traffic-cycle",
          title: "Stage 1: prove the automatic cycle",
          duration: "10 min",
          checkpoint: "The LEDs run green for 10 s, yellow for 3 s, and red for 10 s; changing one timing constant changes only that state.",
          facilitator: "Ask students to predict the 23-second total cycle before measuring it.",
          html: `
            ${projectDiagram("traffic/01_led_cycle/circuit_diagram.svg", "Traffic stage 1 · LED cycle wiring")}
            ${sketchLink("traffic/01_led_cycle/01_led_cycle.ino", "Download stage 1 · automatic LED cycle")}
            ${codeBlock("The final sketch's timing constants", `const unsigned long GREEN_TIME  = 10000;
const unsigned long YELLOW_TIME = 3000;
const unsigned long RED_TIME    = 10000;`)}
            <section class="experiment-card"><p class="experiment-label">Change and observe</p><h3>Change one duration only</h3><ol><li>Upload the unchanged baseline.</li><li>Predict the effect of one timing change.</li><li>Upload and time a full cycle.</li><li>Restore the final value before Stage 2.</li></ol></section>
          `,
        },
        {
          id: "traffic-sound",
          title: "Stage 2: add the KY-037 digital output",
          duration: "10 min",
          checkpoint: "KY-037 DO is on GPIO 17, VCC is on 3.3 V, grounds are shared, and AO is left unconnected.",
          html: `
            <p class="lede">The final INO reads the module's thresholded <strong>digital output</strong>, not its analog output.</p>
            ${projectDiagram("traffic/02_sound_meter/circuit_diagram.svg", "Traffic stage 2 · LEDs plus KY-037")}
            <table class="data-table"><thead><tr><th>KY-037 pin</th><th>Connection</th><th>Purpose</th></tr></thead><tbody><tr><td>VCC</td><td>ESP32 3.3V</td><td>Keeps the digital output ESP32-safe</td></tr><tr><td>GND</td><td>Shared GND</td><td>Common voltage reference</td></tr><tr><td>DO</td><td>GPIO 17</td><td>Thresholded HIGH/LOW sound events</td></tr><tr><td>AO</td><td>Not connected</td><td>The final sketch does not call <code>analogRead</code></td></tr></tbody></table>
            ${sketchLink("traffic/02_sound_meter/02_sound_meter.ino", "Download stage 2 · digital sound-event meter")}
            <div class="callout"><p>The KY-037 trimpot is the threshold control. Turn it gradually until quiet produces no events but a nearby siren or repeated sharp sound produces several transitions.</p></div>
          `,
        },
        {
          id: "traffic-calibrate",
          title: "Stage 2: calibrate events, not an ADC number",
          duration: "8 min",
          checkpoint: "Quiet stays below 12 events per 2 seconds, while my repeated test sound reaches at least 12; I corrected SOUND_ACTIVE_LEVEL if my module is inverted.",
          facilitator: "Use the event count printed by the stage sketch. Do not ask students to invent an analog SOUND_THRESHOLD; the final code has none.",
          html: `
            ${projectDiagram("traffic/02_sound_meter/circuit_diagram.svg", "Traffic stage 2 · KY-037 calibration wiring")}
            ${codeBlock("The final event detector", `const int SOUND_ACTIVE_LEVEL = HIGH;
const unsigned long SOUND_WINDOW = 2000;
const int REQUIRED_SOUND_EVENTS = 12;

bool soundActive = digitalRead(PIN_MIC) == SOUND_ACTIVE_LEVEL;
if (soundActive && !lastSoundState) {
  soundEvents[soundEventCount++] = millis();
}`)}
            <ol class="steps-ol action-list"><li><strong>Prove quiet</strong><span>Watch the rolling event count for 10 seconds. It should not climb continuously.</span></li><li><strong>Prove the test sound</strong><span>Play a warbling siren or make repeated sharp sounds for two seconds.</span></li><li><strong>Adjust the module</strong><span>Turn the KY-037 trimpot a little, then repeat both tests.</span></li><li><strong>Check polarity</strong><span>If the event logic is backwards, change <code>SOUND_ACTIVE_LEVEL</code> from <code>HIGH</code> to <code>LOW</code>.</span></li></ol>
            <div class="callout warn"><p>A single sustained HIGH creates only one rising edge. The final code intentionally looks for repeated transitions, so use a changing siren-like sound rather than one steady tone.</p></div>
          `,
        },
        {
          id: "traffic-priority",
          title: "Stage 3: trigger ambulance mode",
          duration: "12 min",
          checkpoint: "Twelve valid sound events within two seconds force green for 15 seconds, then automatic mode resumes at green.",
          html: `
            ${projectDiagram("traffic/03_priority_logic/circuit_diagram.svg", "Traffic stage 3 · sound-priority wiring")}
            ${sketchLink("traffic/03_priority_logic/03_priority_logic.ino", "Download stage 3 · ambulance priority logic")}
            ${codeBlock("The final decision", `if (soundEventCount >= REQUIRED_SOUND_EVENTS && currentMode == MODE_AUTO) {
  soundEventCount = 0;
  startAmbulanceOverride();
}

if (millis() - overrideStartedAt >= OVERRIDE_TIME) {
  currentMode = MODE_AUTO;
  setSignal(SIGNAL_GREEN);
}`)}
            <div class="concept-grid"><article><p class="concept-label">Noise immunity</p><h3>Count a pattern</h3><p>One random edge is ignored. A repeated sound pattern within the rolling window is evidence.</p></article><article><p class="concept-label">Responsiveness</p><h3>No long blocking delay</h3><p><code>millis()</code> keeps sound sampling, web requests, and display updates alive during every mode.</p></article></div>
          `,
        },
        {
          id: "traffic-dashboard",
          title: "Final stage: add OLED and local web control",
          duration: "15 min",
          checkpoint: "The SH1106 OLED works on SDA 22/SCL 21, and I joined TrafficSignal with password traffic123 to verify status, manual green, and return-to-auto controls.",
          html: `
            <p class="lede">The authoritative <code>TrafficSignal.ino</code> keeps its OLED and web page in one file.</p>
            ${projectDiagram("traffic/circuit_diagram.svg", "Traffic final · LEDs, KY-037, and SH1106 OLED")}
            <table class="data-table"><thead><tr><th>SH1106 OLED</th><th>ESP32</th></tr></thead><tbody><tr><td>VCC / GND</td><td>3.3V / shared GND</td></tr><tr><td>SDA</td><td>GPIO 22</td></tr><tr><td>SCL</td><td>GPIO 21</td></tr><tr><td>I²C address</td><td><code>0x3C</code></td></tr></tbody></table>
            <div class="callout warn"><p>The source deliberately calls <code>Wire.begin(22, 21)</code>. Follow this final POC mapping even though many ESP32 examples use SDA 21 and SCL 22.</p></div>
            ${sketchLink("traffic/traffic.ino", "Download final Traffic Signal POC")}
            <ol class="steps-ol action-list"><li><strong>Install libraries</strong><span>Arduino Library Manager: Adafruit GFX Library and Adafruit SH110X.</span></li><li><strong>Upload one file</strong><span>No <code>page.h</code> tab is needed; the page is embedded in <code>traffic.ino</code>.</span></li><li><strong>Check OLED and Serial</strong><span>The OLED shows signal, mode, next state, and countdown. Serial prints the access-point details.</span></li><li><strong>Join Wi-Fi</strong><span>Network <strong>TrafficSignal</strong>, password <strong>traffic123</strong>; open the IP printed by Serial (normally <strong>http://192.168.4.1</strong>).</span></li><li><strong>Prove all modes</strong><span>Observe AUTO, trigger AMBULANCE, request MANUAL GREEN, then RETURN TO AUTO.</span></li></ol>
            <div class="evidence-box"><strong>Definition of done</strong><p>The physical LEDs, OLED, and browser agree; repeated sound starts a 15-second green override; both web controls work.</p></div>
          `,
        },
        {
          id: "traffic-tune",
          title: "Tune it like an engineer",
          duration: "8 min",
          checkpoint: "I changed one final-sketch constant or the KY-037 trimpot, compared before and after, and restored or justified the final setting.",
          html: `
            <p class="lede">Tune parameters that actually exist in <code>TrafficSignal.ino</code>.</p>
            <div class="challenge-grid"><article><span>Experiment A</span><h3>Event requirement</h3><p>Compare <code>REQUIRED_SOUND_EVENTS</code> at 6 and 16. Record false triggers and missed triggers.</p></article><article><span>Experiment B</span><h3>Detection window</h3><p>Compare <code>SOUND_WINDOW</code> at 1000 and 3000 ms while keeping the same sound source.</p></article><article><span>Experiment C</span><h3>Override duration</h3><p>Compare <code>OVERRIDE_TIME</code> at 5000 and 15000 ms. Confirm web and OLED countdowns match.</p></article></div>
            <div class="callout"><p><strong>Control the experiment:</strong> change one value only; keep sound source, volume, and distance as consistent as possible.</p></div>
          `,
        },
      ],
    },
    {
      id: "tripwire",
      title: "Lab 2 · Tripwire",
      phase: "afternoon",
      phaseLabel: "Hands-on",
      steps: [
        {
          id: "tripwire-goal",
          title: "Mission: detect a broken beam",
          duration: "3 min",
          checkpoint: "I can explain the updated Tripwire: the laser makes the line, the LDR measures it, and the buzzer sounds when the measured beam disappears.",
          html: `
            <section class="lab-intro tripwire-intro"><div><p class="hero-label">Lab 02 · intruder detection</p><h2>Turn a silent line of light into an audible alarm.</h2><p>This updated build uses only the ESP32, laser module, LDR module, and active buzzer module. It has no servo, alarm LED, or web page.</p></div><div class="beam-illustration"><i></i><span></span><b></b></div></section>
            <div class="concept-grid three"><article><p class="concept-label">Sense</p><h3>LDR AO · GPIO 34</h3><p>Read light as a value from 0 to 4095.</p></article><article><p class="concept-label">Decide</p><h3>Your measured threshold</h3><p>On this kit, a blocked beam gives a lower value.</p></article><article><p class="concept-label">Act</p><h3>Buzzer SIG · GPIO 27</h3><p>HIGH sounds the alarm; LOW keeps it quiet.</p></article></div>
            <div class="evidence-box"><strong>Final proof</strong><p>Beam present: Serial says NORMAL and the buzzer is quiet. Hand through the beam: Serial says INTRUDER DETECTED and the buzzer sounds.</p></div>
          `,
        },
        {
          id: "tripwire-wire-sensor",
          title: "Stage 1: wire the laser and LDR",
          duration: "10 min",
          checkpoint: "LDR AO is on GPIO 34, laser S is on GPIO 25, both modules share GND, and the laser dot is fixed on the LDR window.",
          html: `
            <p class="lede">Build the sensing path before adding the alarm.</p>
            ${projectDiagram("tripwire/beam_test_diagram.svg", "Tripwire stage 1 · laser and LDR")}
            <table class="data-table"><thead><tr><th>Module pin</th><th>Connection</th><th>Job</th></tr></thead><tbody><tr><td>LDR AO</td><td>GPIO 34</td><td>Analog input, 0–4095</td></tr><tr><td>LDR VCC / GND</td><td>3.3V / shared GND</td><td>ESP32-safe sensor power</td></tr><tr><td>Laser S</td><td>GPIO 25</td><td>Digital output; HIGH keeps the beam on</td></tr><tr><td>Laser VCC</td><td>3.3V or 5V per module label</td><td>Power only; control remains on GPIO 25</td></tr><tr><td>Laser GND</td><td>Shared GND</td><td>Common reference</td></tr></tbody></table>
            <div class="callout danger"><p>Never aim the laser at a face or reflective surface. Disconnect USB while moving wires, then fix the laser close to the LDR for the first test.</p></div>
          `,
        },
        {
          id: "tripwire-calibrate",
          title: "Stage 1: measure beam on and beam blocked",
          duration: "10 min",
          checkpoint: "I recorded both readings at 115200 baud, confirmed blocked is lower on this module, and calculated a midpoint between my values.",
          facilitator: "Require two written readings. The supplied 1800 is only a starting point if it falls between that team's measured values.",
          html: `
            ${projectDiagram("tripwire/beam_test_diagram.svg", "Tripwire stage 1 · calibration wiring")}
            ${codeBlock("beam_test.ino", `const int LDR_PIN = 34;
const int LASER_PIN = 25;

void setup() {
  Serial.begin(115200);
  pinMode(LASER_PIN, OUTPUT);
  digitalWrite(LASER_PIN, HIGH);
}

void loop() {
  Serial.println(analogRead(LDR_PIN));
  delay(200);
}`)}
            <ol class="steps-ol action-list"><li><strong>Beam on</strong><span>Write a stable reading while the laser hits the LDR.</span></li><li><strong>Beam blocked</strong><span>Place a hand in the path and write the new reading.</span></li><li><strong>Check direction</strong><span>The updated final code expects the blocked reading to be lower.</span></li><li><strong>Calculate</strong><span><code>THRESHOLD = (beam-on + blocked) / 2</code>.</span></li></ol>
            <div class="callout warn"><p>If your hardware reads higher when blocked, do not guess: reverse the final comparison from <code>&lt;</code> to <code>&gt;</code> and retest both conditions.</p></div>
          `,
        },
        {
          id: "tripwire-buzzer",
          title: "Stage 2: add the buzzer output",
          duration: "8 min",
          checkpoint: "The active buzzer module's SIG pin is on GPIO 27, its supply matches its label, and every ground is common.",
          html: `
            ${projectDiagram("tripwire/circuit_diagram.svg", "Tripwire final · laser, LDR, and buzzer")}
            <table class="data-table"><thead><tr><th>Buzzer pin</th><th>Connection</th><th>Job</th></tr></thead><tbody><tr><td>SIG, S, or I/O</td><td>GPIO 27</td><td>HIGH = alarm; LOW = quiet</td></tr><tr><td>VCC</td><td>3.3V or 5V per module label</td><td>Module power</td></tr><tr><td>GND</td><td>Shared ESP32 GND</td><td>Common reference</td></tr></tbody></table>
            <div class="callout warn"><p>The supplied sketch assumes an active buzzer module with a signal input. Do not drive a high-current bare buzzer directly from GPIO 27; use the provided module or a proper driver circuit.</p></div>
          `,
        },
        {
          id: "tripwire-run",
          title: "Final stage: upload and prove the alarm",
          duration: "10 min",
          checkpoint: "Beam present produces NORMAL and silence; a broken beam produces INTRUDER DETECTED and an audible alarm using my measured threshold.",
          html: `
            ${projectDiagram("tripwire/circuit_diagram.svg", "Tripwire final · complete wiring")}
            ${sketchLink("tripwire/tripwire.ino", "Download the final Tripwire POC")}
            ${codeBlock("The decision in tripwire.ino", `int lightValue = analogRead(LDR_PIN);

if (lightValue < THRESHOLD) {
  Serial.println("INTRUDER DETECTED");
  digitalWrite(BUZZER_PIN, HIGH);
} else {
  Serial.println("NORMAL");
  digitalWrite(BUZZER_PIN, LOW);
}`)}
            <ol class="steps-ol action-list"><li><strong>Enter your midpoint</strong><span>Replace <code>1800</code> if it is not between your two readings.</span></li><li><strong>Upload</strong><span>Open Serial Monitor at 115200 baud.</span></li><li><strong>Prove normal</strong><span>Keep the dot on the LDR; expect NORMAL and silence.</span></li><li><strong>Prove intrusion</strong><span>Break the beam; expect INTRUDER DETECTED and the buzzer.</span></li><li><strong>Restore</strong><span>Remove your hand; the alarm must stop.</span></li></ol>
          `,
        },
        {
          id: "tripwire-tune",
          title: "Tune reliability",
          duration: "6 min",
          checkpoint: "I tested the final threshold under at least two room-light conditions and can explain one cause of false alarms.",
          html: `
            <div class="challenge-grid"><article><span>Alignment</span><h3>Move the laser slightly</h3><p>Observe how a partial miss changes the beam-on number before fixing the module firmly.</p></article><article><span>Ambient light</span><h3>Shade the sensor</h3><p>Compare readings with room lights or sunlight changed. A short tube around the LDR can reject side light.</p></article><article><span>Boundary</span><h3>Move the threshold</h3><p>Change only <code>THRESHOLD</code>. Keep it far enough from both normal readings to avoid flicker.</p></article></div>
            <div class="callout"><p>The current sketch samples every 200 ms. A very fast object can cross between samples; reducing the delay increases responsiveness but also increases Serial traffic.</p></div>
          `,
        },
      ],
    },
    {
      id: "reaction",
      title: "Lab 3 · Reaction Arena",
      phase: "afternoon",
      phaseLabel: "Hands-on",
      steps: [
        {
          id: "reaction-mission",
          title: "Mission: build a multiplayer reaction arena",
          duration: "4 min",
          checkpoint: "I understand that each of four LEDs has one matching button, phones join the local arena, and early, wrong, or late presses score as fouls.",
          html: `
            <section class="lab-intro reaction-intro"><div><p class="hero-label">Lab 03 · Reaction Arena</p><h2>Can four physical input channels support a fair multiplayer game?</h2><p>The final INO hosts a 1–4 player web lobby, runs three rounds per player, chooses one of four LED/button pairs, measures reaction time with <code>micros()</code>, and ranks total scores.</p></div><div class="reaction-number">247<small>ms</small></div></section>
            <div class="concept-grid three"><article><p class="concept-label">Prepare</p><h3>Countdown + LED chase</h3><p>Any button press before the target is a foul.</p></article><article><p class="concept-label">React</p><h3>Match LED to button</h3><p>The wrong button is a foul even if it is fast.</p></article><article><p class="concept-label">Communicate</p><h3>Open local web arena</h3><p>Phones join, ready up, follow turns, and see rankings.</p></article></div>
          `,
        },
        {
          id: "reaction-wire-leds",
          title: "Stage 1: wire and prove four LEDs",
          duration: "8 min",
          checkpoint: "LEDs 1–4 light in order on GPIO 16, 17, 18, and 19, with one 220 Ω resistor per LED and common GND.",
          html: `
            ${projectDiagram("reaction/01_led_chase/circuit_diagram.svg", "Reaction stage 1 · four LEDs")}
            <table class="data-table"><thead><tr><th>Channel</th><th>ESP32 path</th></tr></thead><tbody><tr><td>LED 1</td><td>GPIO 16 → 220 Ω → anode; cathode → GND</td></tr><tr><td>LED 2</td><td>GPIO 17 → 220 Ω → anode; cathode → GND</td></tr><tr><td>LED 3</td><td>GPIO 18 → 220 Ω → anode; cathode → GND</td></tr><tr><td>LED 4</td><td>GPIO 19 → 220 Ω → anode; cathode → GND</td></tr></tbody></table>
            ${sketchLink("reaction/01_led_chase/01_led_chase.ino", "Download stage 1 · four-LED chase")}
            ${codeBlock("The authoritative LED array", `const uint8_t LED_PINS[4] = {16, 17, 18, 19};`)}
            <section class="experiment-card"><p class="experiment-label">Prove every output</p><h3>Slow it down, then restore it</h3><p>Try <code>TEST_DELAY_MS</code> at 100 and 1000. Label each LED 1–4 while the slow chase makes the order obvious.</p></section>
          `,
        },
        {
          id: "reaction-button",
          title: "Stage 2: add four matching buttons",
          duration: "12 min",
          checkpoint: "Buttons 1–4 are on GPIO 25, 26, 27, and 32; every press lights only its matching LED and prints one debounced event.",
          html: `
            <p class="lede">Each button connects its GPIO to GND. <code>INPUT_PULLUP</code> means released is HIGH and pressed is LOW.</p>
            ${projectDiagram("reaction/02_button_test/circuit_diagram.svg", "Reaction stage 2 · four matched LED/button channels")}
            <table class="data-table"><thead><tr><th>Channel</th><th>LED GPIO</th><th>Button GPIO → opposite side</th></tr></thead><tbody><tr><td>1</td><td>16</td><td>25 → GND</td></tr><tr><td>2</td><td>17</td><td>26 → GND</td></tr><tr><td>3</td><td>18</td><td>27 → GND</td></tr><tr><td>4</td><td>19</td><td>32 → GND</td></tr></tbody></table>
            ${sketchLink("reaction/02_button_test/02_button_test.ino", "Download stage 2 · four-button pairing test")}
            ${codeBlock("The authoritative button array", `const uint8_t BUTTON_PINS[4] = {25, 26, 27, 32};
const uint32_t BUTTON_DEBOUNCE_MS = 25;

for (uint8_t i = 0; i < 4; i++) {
  pinMode(BUTTON_PINS[i], INPUT_PULLUP);
}`)}
            <div class="callout warn"><p>A four-leg tactile button has two internally connected pairs. If a channel is always LOW, rotate that button 90° or move the GND wire to the opposite side.</p></div>
          `,
        },
        {
          id: "reaction-preview",
          title: "Preview the matching rule",
          duration: "5 min",
          checkpoint: "I produced one valid reaction, one too-early foul, and one wrong-button foul in the four-channel simulator.",
          html: `
            <p>The browser demo models the final hardware rule: wait for one of four lights, then press the button with the same number.</p>
            <div class="reaction-simulator" data-reaction-sim>
              <div class="reaction-lights"><i></i><i></i><i></i><i></i></div>
              <p class="reaction-status" data-reaction-status>Press Start round, then wait for a target.</p>
              <p class="reaction-result" data-reaction-result>—</p>
              <div class="reaction-actions"><button type="button" class="ghost-btn" data-reaction-start>Start round</button><button type="button" class="nav-btn-next" data-reaction-press="0" disabled>Button 1</button><button type="button" class="nav-btn-next" data-reaction-press="1" disabled>Button 2</button><button type="button" class="nav-btn-next" data-reaction-press="2" disabled>Button 3</button><button type="button" class="nav-btn-next" data-reaction-press="3" disabled>Button 4</button></div>
            </div>
            <div class="callout"><p>Start a round and press before a light to test TOO EARLY. Start again, wait for a target, then deliberately press a different number to test WRONG BUTTON.</p></div>
          `,
        },
        {
          id: "reaction-code",
          title: "Final stage: understand the game state machine",
          duration: "12 min",
          checkpoint: "I can trace countdown → LED sequence → random wait → target → result, including all three foul paths.",
          html: `
            ${projectDiagram("reaction/circuit_diagram.svg", "Reaction Arena final · complete four-channel wiring")}
            ${sketchLink("reaction/reaction.ino", "Download the final Reaction Arena POC")}
            ${codeBlock("Target selection and timer start", `void beginTarget() {
  targetLed = random(0, 4);
  setOnlyLed(targetLed);
  targetStartedAtMs = millis();
  targetStartedAtUs = micros();
  gameState = TARGET_ACTIVE;
}`)}
            ${codeBlock("Correct, wrong, and timed-out reactions", `if (wrongPressed) {
  finishTurn(true, "WRONG_BUTTON", 0);
} else if (correctPressed) {
  uint32_t reaction = (micros() - targetStartedAtUs) / 1000UL;
  finishTurn(false, "", reaction);
} else if (millis() - targetStartedAtMs >= TARGET_TIMEOUT_MS) {
  finishTurn(true, "TIME_OUT", 0);
}`)}
            <div class="callout"><p>Pressing during TURN_INTRO, LED_SEQUENCE, or RANDOM_WAIT becomes <strong>TOO_EARLY</strong>. During TARGET_ACTIVE, any nonmatching channel becomes <strong>WRONG_BUTTON</strong>. No valid press within 3000 ms becomes <strong>TIME_OUT</strong>.</p></div>
          `,
        },
        {
          id: "reaction-web",
          title: "Launch the local multiplayer arena",
          duration: "12 min",
          checkpoint: "One to four phones joined Reaction Arena, all players readied up, Player 1 started the game, and the web screens followed the physical turns and scores.",
          html: `
            ${projectDiagram("reaction/circuit_diagram.svg", "Reaction Arena final · wiring before power-up")}
            <ol class="steps-ol action-list"><li><strong>Upload and open Serial</strong><span>Use 115200 baud and look for <code>Reaction Arena ready</code>.</span></li><li><strong>Join the open AP</strong><span>Connect each phone to <strong>Reaction Arena</strong>. There is no Wi-Fi password and no internet is required.</span></li><li><strong>Open the arena</strong><span>Browse to the IP printed by Serial, normally <strong>http://192.168.4.1</strong>.</span></li><li><strong>Select players once</strong><span>The first accepted 1–4 player selection locks the lobby size.</span></li><li><strong>Join and ready</strong><span>Each phone enters a name. After everyone is ready, Player 1 starts.</span></li><li><strong>Play three rounds</strong><span>Watch the physical LEDs; press the matching physical button only on your turn.</span></li></ol>
            <div class="callout warn"><p>The final source's OLED hooks are intentionally disabled. Do not wire an OLED for this build, even though an old header comment mentions one.</p></div>
            <div class="evidence-box"><strong>Definition of done</strong><p>The hardware accepts correct matches, rejects early/wrong/late presses, all phones stay synchronized, and the final ranking shows three rounds per player.</p></div>
          `,
        },
        {
          id: "reaction-tune",
          title: "Tune difficulty and reliability",
          duration: "10 min",
          checkpoint: "I changed one constant that exists in ReactionTime.ino, played enough turns to compare behavior, and restored or justified the final value.",
          html: `
            <div class="challenge-grid"><article><span>Reliability</span><h3>Button debounce</h3><p>Compare <code>BUTTON_DEBOUNCE_MS</code> at 5, 25, and 60. Watch Serial for duplicate or sluggish events.</p></article><article><span>Difficulty</span><h3>Target timeout</h3><p>Compare <code>TARGET_TIMEOUT_MS</code> at 1500 and 3000. Count how often players time out.</p></article><article><span>Scoring</span><h3>Point boundaries</h3><p>Inspect <code>pointsForReaction()</code>. Predict the score at 400, 401, 900, and 1801 ms before testing.</p></article></div>
            <table class="data-table"><thead><tr><th>Constant or boundary</th><th>Before</th><th>After</th><th>Evidence</th></tr></thead><tbody><tr><td>Your choice</td><td>Record it</td><td>Record it</td><td>Use at least one complete round</td></tr></tbody></table>
          `,
        },
        {
          id: "reaction-tournament",
          title: "Run a fair arena match",
          duration: "10 min",
          checkpoint: "Our group completed a three-round match and identified at least two sources of reaction-time variation.",
          facilitator: "The final code already uses equal turns and fixed score bands. Ask teams why physical button placement can still bias results.",
          html: `
            <ol class="steps-ol action-list"><li><strong>Fix the hardware</strong><span>Keep all four buttons equally reachable and every player in the same position.</span></li><li><strong>Lock the firmware</strong><span>Use the same debounce, timeout, wait range, and scoring function for everyone.</span></li><li><strong>Complete the match</strong><span>Each player receives one turn in each of three rounds.</span></li><li><strong>Review fouls</strong><span>Separate too-early, wrong-button, and timeout results from valid reaction times.</span></li><li><strong>Explain variation</strong><span>Attention, anticipation, button travel, hand choice, and Wi-Fi display delay can differ; the physical LED starts the official timer.</span></li></ol>
            <div class="callout"><p>The phone page communicates whose turn it is, but the physical target LED and physical button determine reaction time. Do not time from a phone-screen refresh.</p></div>
          `,
        },
      ],
    },
    {
      id: "finish",
      title: "Finish",
      phase: "afternoon",
      phaseLabel: "Reflect",
      steps: [
        {
          id: "troubleshoot",
          title: "Diagnose by symptom",
          duration: "As needed",
          html: `
            <p class="lede">Change one thing at a time. Use the last working stage to isolate the fault.</p>
            <div class="accordion">
              <details open><summary>No board under Tools → Port</summary><p>Try another USB data cable first. Then confirm the CP2102 or CH340 driver and reconnect.</p></details>
              <details><summary>LED never lights</summary><p>Check the selected GPIO, shared GND, resistor, and polarity. Return to the LED-only stage.</p></details>
              <details><summary>Traffic sound triggers constantly or never triggers</summary><p>Return to the digital sound-event meter. Adjust the KY-037 trimpot, verify DO is on GPIO 17, and change <code>SOUND_ACTIVE_LEVEL</code> only if your module's output is inverted.</p></details>
              <details><summary>Traffic page does not open</summary><p>Confirm the final sketch uploaded, join <strong>TrafficSignal</strong> with password <strong>traffic123</strong>, ignore “no internet,” disable VPN, and open the IP printed by Serial.</p></details>
              <details><summary>Tripwire always alarms or never alarms</summary><p>Re-measure beam-on and blocked values. Confirm the laser hits the LDR, put <code>THRESHOLD</code> between the readings, and verify whether blocked is lower before choosing <code>&lt;</code> or <code>&gt;</code>.</p></details>
              <details><summary>A Reaction button is always pressed</summary><p>Rotate that four-leg tactile switch 90° or move its GND wire to the opposite side. Verify the channel uses GPIO 25, 26, 27, or 32.</p></details>
              <details><summary>Reaction Arena records odd presses</summary><p>Run the four-button pairing test and confirm one event per action. Then tune <code>BUTTON_DEBOUNCE_MS</code> rather than adding blocking delays.</p></details>
              <details><summary>Reaction Arena page does not open</summary><p>Join the open <strong>Reaction Arena</strong> network, ignore “no internet,” disable mobile data or VPN if needed, and open the IP printed by Serial.</p></details>
            </div>
          `,
        },
        {
          id: "wrap",
          title: "You built three connected systems",
          duration: "5 min",
          checkpoint: "I can explain how one of today's POCs senses, decides, acts, and how tuning changed its behavior.",
          html: `
            <section class="hero-card finish-hero"><p class="hero-label">Workshop complete</p><h2>You moved from wiring to evidence.</h2><p>The important result is not three copied sketches. It is the ability to isolate a behavior, measure it, tune it, and explain why the complete system works.</p></section>
            <div class="journey-grid reflection-grid"><article><span>Traffic</span><h3>Sound changed a state machine</h3><p>Threshold and timing made the system responsive.</p></article><article><span>Tripwire</span><h3>Light changed a physical door</h3><p>Calibration connected an analog reading to action.</p></article><article><span>Reaction</span><h3>State made timing fair</h3><p>Random wait, debounce, and false-start logic protected the measurement.</p></article></div>
            <section class="experiment-card"><p class="experiment-label">Explain to a partner</p><h3>Pick one POC</h3><p>Point to its sensor, rule, outputs, and one value you tuned. Describe the evidence that convinced you it worked.</p></section>
          `,
        },
      ],
    },
  ],
};
