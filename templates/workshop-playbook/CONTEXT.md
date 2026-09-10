# Team context (this is all they fill)

Your teammate does **not** design the playbook. They paste their PoC here, then paste `PROMPT.md` into any copilot with this folder.

For the **one-day university workshop** in this repo, do not invent a new morning. Copy **one** file from `workshop/contexts/` (`traffic.md`, `tripwire.md`, or `reaction.md`) into this file — or attach that file instead. Never paste all three PoCs at once.

Copy the block below, fill it, and attach it.

---

## PoC / problem (required)

What are students building today? Describe the real demo, like we did for laser + LDR intruder detection.

```
Name:
What the demo proves when it works:
How a human can tell it worked (LED, serial text, web page, etc.):
```

## Audience

University workshop students. Mixed room: some have never done this, some already have.

```
Department / year (optional):
Languages they know (optional):
```

## Hardware and software that actually exist

List only parts on the table. Do not list “nice to have” tutorials.

```
Board / laptop / tools:
Sensors / actuators:
Cables / power:
IDE or software (install before the room if possible):
Pin or port map if you already locked one:
```

## Out of scope this session

What you will add later (example: buzzer after the dashboard works).

```
Later add-on:
Pin or resource to reserve and leave unused:
```

## Example (intruder detection — do not copy unless that is your lab)

```
Name: Laser tripwire intruder detection on ESP32
Proves: breaking the beam flags an intruder
How you tell: Serial says INTRUDER DETECTED, GPIO 5 LED on, optional page at http://192.168.4.1
Hardware: ESP32, data USB cable, breadboard, LDR on GPIO 34, alarm LED on GPIO 5, KY-008 laser aimed at LDR
No push button. Buzzer later on GPIO 18, not this session.
Software: Arduino IDE, ESP32 board package
```
