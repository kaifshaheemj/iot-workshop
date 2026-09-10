window.PREPBOOK_SLIDES = [
  {
    theme: "prep-hero",
    htmlFull:
      '<div class="prep-body">' +
      '<p class="prep-kicker">Anna University IoT Workshop</p>' +
      "<h1>IOT Workshop Prep-Book</h1>" +
      '<p class="prep-sub">Your Pre-Workshop Setup Guide — Get Ready to Build!</p>' +
      "<p>Hi guys! Super excited to have you all at the workshop. This guide walks you through everything — step by step — so on workshop day you just plug in your ESP32 and start coding. No stress, promise!</p>" +
      "</div>" +
      '<p class="prep-footer">Anna University IoT Workshop | September 2026</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>What You Will Need Before You Start</h1>" +
      '<div class="prep-cards">' +
      '<div class="prep-card"><strong>Your Windows Laptop</strong><span>Windows 10 or Windows 11 — both are fine</span></div>' +
      '<div class="prep-card"><strong>A Stable Internet Connection</strong><span>Needed to download software and board packages</span></div>' +
      '<div class="prep-card"><strong>About 20–25 Minutes of Free Time</strong><span>Set aside some time to go through this guide without rushing</span></div>' +
      '<div class="prep-card"><strong>You\'re Ready to Build!</strong><span>Once these are sorted, the fun part begins on workshop day</span></div>' +
      '<div class="prep-card"><strong>Your ESP32 Development Board <em>(Will be provided)</em></strong><span>30-pin ESP32 with Micro-USB interface</span></div>' +
      "</div></div>" +
      '<p class="prep-footer">Anna University IoT Workshop | September 2026</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>Step 1 — Download and Install Arduino IDE</h1>" +
      '<p class="prep-lede">Arduino IDE 2.x is the modern standard — download it once and you are set for the entire workshop.</p>' +
      '<div class="prep-cols prep-cols-fill">' +
      '<div class="prep-col"><span class="prep-num">1</span><p class="prep-col-title">Download</p><p>Go to <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">arduino.cc/en/software</a> and download the latest Arduino IDE 2.x installer for Windows.</p><img class="prep-col-img" src="slides/images/media/s3_7.png" alt="Arduino software download page"></div>' +
      '<div class="prep-col"><span class="prep-num">2</span><p class="prep-col-title">Run the installer</p><p>Run the downloaded .exe file — click through the install wizard.</p><p><strong>Next → Agree → Install → Finish</strong></p></div>' +
      '<div class="prep-col"><span class="prep-num">3</span><p class="prep-col-title">Allow changes</p><p>When Windows asks about allowing app changes — click Yes.</p></div>' +
      '<div class="prep-col"><span class="prep-num">4</span><p class="prep-col-title">Launch Arduino IDE</p><p>If it opens without errors, you are good to move on.</p><img class="prep-col-img" src="slides/images/media/s3_8.png" alt="Arduino IDE window"></div>' +
      "</div></div>" +
      '<p class="prep-footer prep-footer-tip">Pro tip: Arduino IDE 2.x is the recommended standard for ESP32 projects.</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>Step 2 — Install the CP2102 USB Driver</h1>" +
      "<p>Without this driver, your laptop will never see your ESP32 — this is the most important step.</p>" +
      '<ol class="prep-steps">' +
      "<li>Most ESP32 boards use a CP210x USB-to-UART bridge chip (Silicon Labs) to communicate with your laptop.</li>" +
      "<li>If the driver is missing, your board will not appear in Device Manager and no COM port will show in Arduino IDE.</li>" +
      "<li>Download the CP210x package from Silicon Labs (<a href=\"https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers\" target=\"_blank\" rel=\"noopener\">silabs.com USB to UART drivers</a>).</li>" +
      "<li>Extract the zip, right-click <code>silabser.inf</code> and click Install. Agree to the dialogs. Restart your laptop.</li>" +
      "</ol></div>" +
      '<p class="prep-footer">Anna University IoT Workshop | September 2026</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>Step 3 — Add the ESP32 Board Manager URL</h1>" +
      '<p class="prep-lede">This one URL is the key that unlocks ESP32 support inside Arduino IDE.</p>' +
      '<div class="prep-cols prep-cols-fill">' +
      '<div class="prep-col"><span class="prep-num">1</span><p class="prep-col-title">Open Preferences</p><p>Open Arduino IDE → go to File → Preferences.</p><img class="prep-col-img" src="slides/images/media/s5_8.png" alt="Arduino IDE Preferences"></div>' +
      '<div class="prep-col"><span class="prep-num">2</span><p class="prep-col-title">Paste the URL</p><p>Find “Additional boards manager URLs” and paste this URL exactly:</p><a class="prep-url-pill" href="https://espressif.github.io/arduino-esp32/package_esp32_index.json" target="_blank" rel="noopener">https://espressif.github.io/arduino-esp32/package_esp32_index.json</a></div>' +
      '<div class="prep-col"><span class="prep-num">3</span><p class="prep-col-title">Save Settings</p><p>Click OK to save your preferences.</p></div>' +
      '<div class="prep-col"><span class="prep-num">4</span><p class="prep-col-title">You\'re Set!</p><p>Arduino IDE now knows where to find the ESP32 board package — like telling Arduino where to go shopping for ESP32 stuff!</p><p class="prep-note">Next up: we will download and install the ESP32 board package in Step 4.</p></div>' +
      "</div></div>" +
      '<p class="prep-footer">Anna University IoT Workshop | September 2026</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>Step 4 — Install the ESP32 Board Package</h1>" +
      "<p>Installing the board package is what lets Arduino IDE compile and upload code to your ESP32.</p>" +
      '<ol class="prep-steps">' +
      "<li><strong>Open Boards Manager</strong> — Tools → Board → Boards Manager.</li>" +
      "<li><strong>Search for ESP32</strong> — in the search box, type <code>esp32</code>.</li>" +
      "<li><strong>Install the package</strong> — find <em>esp32 by Espressif Systems</em> and click Install.</li>" +
      "<li><strong>Wait for download</strong> — this can take a few minutes.</li>" +
      "<li><strong>Select your board</strong> — Tools → Board. Now esp32 should be visible.</li>" +
      "</ol></div>" +
      '<p class="prep-footer">Anna University IoT Workshop | September 2026</p>',
  },
  {
    theme: "prep-light",
    htmlFull:
      '<div class="prep-body">' +
      "<h1>Quick Pre-Workshop Checklist</h1>" +
      "<p>Run through this list the night before the workshop — if all boxes are checked, you are fully ready.</p>" +
      '<ul class="prep-check">' +
      "<li>Arduino IDE 2.x installed and opens without errors</li>" +
      "<li>CP2102 driver installed</li>" +
      "<li>ESP32 board manager URL added in Preferences</li>" +
      "<li>“esp32 by Espressif Systems” installed via Boards Manager</li>" +
      "</ul></div>" +
      '<p class="prep-footer prep-footer-tip">Tick every box and you are workshop-ready — see you there!</p>',
  },
];
