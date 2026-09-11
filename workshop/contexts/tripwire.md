# Team context — Lab 2 only (laser tripwire + buzzer)

Paste **this file** into the copilot with the workshop playbook prompt. Do not describe Labs 1 or 3 here. Do not change morning theory cards.

No web page. Success is Serial plus the buzzer.

---

## PoC / problem (required)

```
Name: Laser + LDR tripwire with active buzzer
What the demo proves when it works: A laser aimed at an LDR is a silent beam. Breaking the beam flags an intruder. Serial says INTRUDER DETECTED and the buzzer sounds. Restoring the beam returns NORMAL and silences the buzzer.
How a human can tell it worked: Serial Monitor at 115200 prints INTRUDER DETECTED; buzzer on GPIO 27 is on while the beam is blocked.
```

## Audience

```
Department / year (optional): University workshop, mixed skill
Languages they know (optional): None required
```

## Hardware and software that actually exist

```
Board / laptop / tools: ESP32 Dev Module, USB data cable, Arduino IDE, breadboard, jumper wires
Sensors / actuators:
  - LDR analog out on GPIO 34 (ADC1), VCC 3.3V, GND
  - Laser module control on GPIO 25 (HIGH in setup keeps the beam on). VCC 3.3V or 5V per module rating. Aim at the LDR.
  - Active buzzer signal on GPIO 27 (HIGH = alarm), VCC/GND per module, common GND
Cables / power: USB from laptop. Shared GND for every module.
IDE or software: Arduino IDE, ESP32 board package, Serial 115200
Pin or port map:
  LDR_PIN 34
  LASER_PIN 25
  BUZZER_PIN 27
  THRESHOLD 1800 starting guess — students replace from beam-on vs beam-off Serial
  Comparison: lightValue < THRESHOLD (this module reads darker as a smaller number)
No push button. No servo. No alarm LED. No Wi-Fi page.
```

## Out of scope this session

```
Later add-on: Web status page after Serial + buzzer work.
Pin or resource to reserve: none required. Pull Lab 1 LED wires off GPIO 25 and 27 before this lab.
```
