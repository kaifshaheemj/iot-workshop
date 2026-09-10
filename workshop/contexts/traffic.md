# Team context — Lab 1 only (traffic + ambulance)

Paste **this file** into the copilot with the workshop playbook prompt. Do not describe Labs 2 or 3 here. Do not change morning theory cards.

Pins below are defaults until the kit is confirmed. If your table uses different pins, edit only this file, then regenerate the Lab 1 module and `sketches/traffic/`.

---

## PoC / problem (required)

```
Name: Traffic light with ambulance interrupt and web status
What the demo proves when it works: A three-colour signal cycles red / yellow / green. A loud ambulance-like sound (or a clap into the sound sensor) interrupts the cycle and forces green. A page served by the ESP32 shows the same colour/state.
How a human can tell it worked: LEDs cycle; siren/clap jumps to green; join Wi-Fi TrafficLab and open http://192.168.4.1 — the heading matches the LEDs.
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
  - Red LED on GPIO 25 through 220 ohm to GND
  - Yellow LED on GPIO 26 through 220 ohm to GND
  - Green LED on GPIO 27 through 220 ohm to GND
  - Sound sensor analog out on GPIO 34 (ADC1). Tune SOUND_THRESHOLD from Serial.
Cables / power: USB from laptop. Sound module VCC 3.3V unless the module requires 5V.
IDE or software: Arduino IDE, ESP32 board package, Serial 115200
Pin or port map if you already locked one:
  RED_PIN 25
  YELLOW_PIN 26
  GREEN_PIN 27
  SOUND_PIN 34
  AP SSID TrafficLab
```

## Out of scope this session

```
Later add-on: Do not add a practice button. Do not add Lab 2 laser/LDR/servo or Lab 3 reaction LEDs in this module.
Pin or resource to reserve and leave unused: GPIO 18 if the shared kit reserved it for a later buzzer — do not drive it in this sketch.
```
