# Team context — Lab 1 only (Traffic Signal)

Use `POC Projects/TrafficSignal.ino` as the source of truth. Do not reuse the older analog-sound TrafficLab pin map.

## POC

```
Name: Traffic Signal with ambulance and manual green override
Proof: Green/yellow/red cycle automatically. Twelve KY-037 digital sound events inside two seconds start a 15-second green ambulance override. An SH1106 OLED and local web page show signal, mode, next state, and remaining time. The page can also request manual green or return to auto.
```

## Final hardware and software

```
Board: ESP32 Dev Module
Red LED: GPIO 4 through 220 ohm to GND
Yellow LED: GPIO 2 through 220 ohm to GND
Green LED: GPIO 16 through 220 ohm to GND
KY-037: DO GPIO 17, VCC 3.3V, shared GND; AO unused
SH1106 128x64 OLED: SDA GPIO 22, SCL GPIO 21, address 0x3C
Wi-Fi: TrafficSignal / traffic123
Libraries: WiFi, WebServer, Wire, Adafruit GFX, Adafruit SH110X
Serial: 115200
```

The final source uses `SOUND_ACTIVE_LEVEL`, `REQUIRED_SOUND_EVENTS`, and `SOUND_WINDOW`; it does not use an analog `SOUND_THRESHOLD`.
