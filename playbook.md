# ESP32 Workshop Playbook

**Students:** open [`playbook/index.html`](playbook/index.html) in a browser (double-click the file — no install, no internet). Follow the steps in order. Do not skip checkpoints.

**Facilitators:** this markdown is your paper copy and session notes. The interactive playbook is what participants should use.

Arduino sketches (File → Open the folder in Arduino IDE):

| Sketch | Folder |
|---|---|
| Blink | [`sketches/00_blink/`](sketches/00_blink/) |
| LDR Serial | [`sketches/02_ldr_serial/`](sketches/02_ldr_serial/) |
| Laser tripwire (Serial + LED) | [`sketches/03_tripwire_serial/`](sketches/03_tripwire_serial/) |
| Tripwire + live dashboard | [`sketches/04_tripwire_dashboard/`](sketches/04_tripwire_dashboard/) |

Live dashboard (after sketch 04): join Wi-Fi **IntruderLab**, open **http://192.168.4.1**.

Facilitator mode in the web playbook: append `?role=facilitator` to the file URL so teaching prompts appear.

---

## Before You Arrive — What You Need

**Hardware (per participant or per pair) — buzzer is not required today:**
- [ ] ESP32 Dev Board
- [ ] USB cable (data cable, not charge-only — this trips people up constantly)
- [ ] Breadboard
- [ ] Jumper wires (Male-to-Male, Female-to-Male)
- [ ] LDR sensor module
- [ ] LED + 220Ω resistor (alarm lamp — no push button in this build)
- [ ] Laser module (KY-008 style) — for the final build

**Not this session:** active buzzer. GPIO **18** is reserved for a follow-on module after Serial + LED + dashboard work. Leave that pin unwired.

**Software (install BEFORE the workshop, not during — this alone can eat 20 minutes of session time):**
- [ ] Arduino IDE (latest version) — https://www.arduino.cc/en/software
- [ ] ESP32 board support installed via Board Manager (see Setup Module below)
- [ ] USB-to-serial driver (CP2102 or CH340, depending on your board — check the chip near the USB port)

**Locked pin map**

| GPIO | Use | This pass |
|---|---|---|
| 2 | Onboard LED | Blink only |
| 5 | Alarm LED | On when the beam is broken |
| 34 | LDR analog (ADC1) | Module 1+ |
| 18 | Active buzzer | Reserved — do not wire |

---

## Setup Module — Do This First, As a Group

**Where you code:** Arduino IDE, on your laptop. Every sketch is a `.ino` file.
**Where it runs:** on the ESP32 chip itself, after being compiled on your laptop and uploaded over USB.

### Step 1 — Install ESP32 Board Support
1. Open Arduino IDE → **File → Preferences**
2. In "Additional Boards Manager URLs," paste:
   `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
3. Go to **Tools → Board → Boards Manager**, search "esp32", install the package by Espressif Systems.
4. Restart Arduino IDE.

### Step 2 — Select Your Board
1. **Tools → Board → ESP32 Arduino →** pick your specific board (commonly "ESP32 Dev Module" if unsure).
2. **Tools → Port →** select the COM port (Windows) or `/dev/cu.usbserial-...` (Mac) that appears when you plug in the board. If nothing appears, that's a driver issue — check the USB cable first (most common cause), then the driver.

### Step 3 — Sanity Check: Blink
Open `sketches/00_blink/`, upload, and confirm the onboard LED blinks.

**Checkpoint:** If the onboard LED blinks, your full toolchain (IDE → compiler → upload → chip) is confirmed working. Don't move on until every participant hits this checkpoint — everything downstream depends on it.

---

## Module 1 — Reading the LDR (Analog Input)

**Goal:** watch light levels change in real time on the Serial Monitor.

### Wiring
| LDR Module Pin | ESP32 Pin |
|---|---|
| VCC | 3.3V |
| GND | GND |
| AO | GPIO 34 |
| DO | Not connected |

Sketch: `sketches/02_ldr_serial/`. After upload, open **Tools → Serial Monitor** and set baud to **115200**.

**Interactive moment:** Have each participant cover their LDR and call out their number. Different ambient lighting per seat is why they calibrate a threshold instead of hardcoding one.

**Checkpoint:** Serial Monitor shows changing numbers as light changes.

---

## Module 2 — The Laser Tripwire Build

**Goal:** laser + LDR + alarm LED. No button. No buzzer yet.

1. Aim the laser at the LDR, about 15–20 cm for a first test. Do not look into the beam.
2. Power the laser from 3.3V or 5V (per its rating) and confirm it lights **before** debugging code.
3. Keep LDR on GPIO 34. Wire GPIO 5 as the alarm LED (on = beam broken).
4. Record beam-on and beam-off Serial numbers. Set `THRESHOLD` between them. Many modules read **higher** when darker, so the sketches use `lightValue > THRESHOLD` for INTRUDER.

Sketch: `sketches/03_tripwire_serial/`.

**Checkpoint:** Waving a hand through the beam flips Serial from NORMAL to INTRUDER DETECTED and turns the GPIO 5 LED on.

---

## Live dashboard

Sketch: `sketches/04_tripwire_dashboard/` — same sensing as Module 2, plus `WiFi.softAP("IntruderLab")`.

1. Upload and confirm Serial prints `Access point: IntruderLab`.
2. Join Wi-Fi **IntruderLab** (open network). Ignore “no internet” warnings.
3. Open **http://192.168.4.1**.
4. Beam on LDR → page says NORMAL. Hand through beam → **INTRUDER DETECTED**, LED on.

The playbook file (`playbook/index.html`) still works while the laptop is on the board’s Wi-Fi.

---

## Coming next — Buzzer (not this session)

After Serial + LED + dashboard are reliable:

- Active buzzer on **GPIO 18** only
- `digitalWrite(BUZZER_PIN, HIGH)` while `intruder` is true (optionally pulsed)
- Same `/status` JSON on the dashboard — no new network protocol

Do not write or wire that in this session.

---

## Facilitator Notes — Keeping It Interactive

- **Never do a checkpoint step for someone silently.** If their LED doesn't blink, ask them what they'd check first, before telling them.
- **Plant a wrong guess before revealing an answer** (threshold value).
- **Pair up whoever finishes early with whoever is stuck.**
- **Keep one working reference board at the front**, wired and running the laser tripwire (sketch 03 or 04).
- Skill picker: beginners see extra GPIO / analog cards; people who know ESP32 see wiring and code only.
- Open the playbook with `?role=facilitator` to show the in-page prompts.

---

## Quick Troubleshooting Reference

| Symptom | Likely Cause |
|---|---|
| Board doesn't show up in Tools → Port | Bad USB cable (try a different one first), or missing CP2102/CH340 driver |
| Serial Monitor shows garbled symbols | Baud rate mismatch — check both code and Serial Monitor dropdown |
| LED never turns on | Check GND is shared, check resistor, check polarity (long leg = anode/+) |
| analogRead() always returns 0 or 4095 | Wrong pin (must be ADC-capable), or LDR not receiving power (check 3.3V/GND) |
| Analog readings become unreliable after WiFi | You're on an ADC2 pin — this workshop uses GPIO 34 (ADC1) on purpose |
| Board won't upload / gets stuck at "Connecting..." | Hold the BOOT button on the board during upload |
| ESP32 restarts randomly | Often power-related — try a shorter/better USB cable or powered USB hub |
| Can't see IntruderLab or 192.168.4.1 | Sketch 04 uploaded? Disable VPN. Stay on the open AP even if the OS says no internet |
