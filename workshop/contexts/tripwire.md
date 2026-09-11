# Team context — Lab 2 only (laser tripwire)

Use the updated laser/LDR/buzzer playbook from `updated with trip wire/iot-workshop` as the source of truth. Ignore its older servo, LED, and dashboard files.

## POC

```
Name: Laser tripwire with audible intruder alarm
Proof: The laser remains aimed at the LDR. Beam present prints NORMAL and keeps the active buzzer quiet. Blocking the beam lowers the LDR reading below the measured threshold, prints INTRUDER DETECTED, and sounds the buzzer.
```

## Final hardware and software

```
Board: ESP32 Dev Module
LDR module: AO GPIO 34, VCC 3.3V, shared GND
Laser module: S GPIO 25, VCC per module rating, shared GND
Active buzzer module: SIG GPIO 27, VCC per module rating, shared GND
Serial: 115200
Threshold: midpoint of measured beam-on and blocked readings
Decision for the supplied kit: lightValue < THRESHOLD means intruder
```

There is no alarm LED, servo, push button, Wi-Fi page, or `page.h` dependency in the updated POC.
