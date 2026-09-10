# Team context — Lab 2 only (tripwire + servo door)

Paste **this file** into the copilot with the workshop playbook prompt. Do not describe Labs 1 or 3 here. Do not change morning theory cards.

Pins below are defaults until the kit is confirmed.

---

## PoC / problem (required)

```
Name: Laser + LDR tripwire with servo door and web open/close
What the demo proves when it works: A laser aimed at an LDR is a beam. Breaking the beam flags an intruder, turns on an alarm LED, and a servo closes a cardboard door. A page on the ESP32 can also open or close that door.
How a human can tell it worked: Serial says INTRUDER DETECTED; GPIO 5 LED on; servo moves to closed; join Wi-Fi IntruderLab and open http://192.168.4.1 — status plus Open door / Close door buttons.
```

## Audience

```
Department / year (optional): University workshop, mixed skill
Languages they know (optional): None required
```

## Hardware and software that actually exist

```
Board / laptop / tools: ESP32 Dev Module, USB data cable, Arduino IDE, breadboard
Sensors / actuators:
  - LDR analog out on GPIO 34 (ADC1)
  - Alarm LED on GPIO 5 through 220 ohm
  - KY-008 or similar laser aimed at the LDR (power per module rating)
  - Servo signal on GPIO 13 (VCC 5V if the servo needs it; external 5V if USB browns out)
Cables / power: USB; servo may need 5V
IDE or software: Arduino IDE, ESP32 board package, Serial 115200
Pin or port map if you already locked one:
  LDR_PIN 34
  LED_PIN 5
  SERVO_PIN 13
  THRESHOLD from beam-on vs beam-off Serial readings
  AP SSID IntruderLab
No push button in this PoC.
```

## Out of scope this session

```
Later add-on: Buzzer after this setup works.
Pin or resource to reserve and leave unused: GPIO 18 — comment only, do not drive.
```
