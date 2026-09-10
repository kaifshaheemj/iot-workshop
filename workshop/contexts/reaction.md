# Team context — Lab 3 only (reaction time LEDs)

Paste **this file** into the copilot with the workshop playbook prompt. Do not describe Labs 1 or 2 here. Do not change morning theory cards.

This PoC needs a react input. A button on GPIO 4 is part of **this** lab only — do not add it to Lab 2.

---

## PoC / problem (required)

```
Name: Reaction-time LED tester
What the demo proves when it works: The board waits a random time, lights one of three LEDs, and measures how long until the student presses the react button. Serial prints the time in milliseconds. A press before the LED (false start) is not counted as a valid time.
How a human can tell it worked: An LED lights after a pause; press; Serial Monitor (115200) prints a number of ms. False start is flagged.
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
  - LED A GPIO 25 through 220 ohm to GND
  - LED B GPIO 26 through 220 ohm to GND
  - LED C GPIO 27 through 220 ohm to GND
  - React button GPIO 4 to GND, INPUT_PULLUP (pressed = LOW)
Cables / power: USB
IDE or software: Arduino IDE, ESP32 board package, Serial 115200
Pin or port map if you already locked one:
  LED_A 25, LED_B 26, LED_C 27, BUTTON_PIN 4
No Wi-Fi page in this PoC unless CONTEXT is updated later.
```

## Out of scope this session

```
Later add-on: Do not add traffic sound sensing or laser/LDR/servo in this module.
Pin or resource to reserve and leave unused: GPIO 18 if reserved on the shared kit.
```
