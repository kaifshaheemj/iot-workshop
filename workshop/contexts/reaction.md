# Team context — Lab 3 only (Reaction Arena)

Use `POC Projects/ReactionTime.ino` as the source of truth. Do not reuse the older three-LED, one-button serial timer.

## POC

```
Name: Reaction Arena multiplayer game
Proof: One to four phones join the ESP32's local web lobby. Each player completes three turns. A countdown and LED chase are followed by a random wait and one of four target LEDs. The matching physical button records reaction time; early, wrong, and late presses are fouls. The web UI shows turns, scores, and final ranking.
```

## Final hardware and software

```
Board: ESP32 Dev Module
LEDs 1-4: GPIO 16, 17, 18, 19 through individual 220 ohm resistors to GND
Buttons 1-4: GPIO 25, 26, 27, 32 to GND using INPUT_PULLUP
Channel pairs: 16/25, 17/26, 18/27, 19/32
Wi-Fi: open network "Reaction Arena"
Web page: ESP32 access-point IP, normally http://192.168.4.1
Serial: 115200
BUTTON_DEBOUNCE_MS: 25
TARGET_TIMEOUT_MS: 3000
Rounds: 3
```

OLED/I2C hooks are intentionally disabled in the final source. Do not wire an OLED for this POC.
