/*
  00 Blink
  Arduino IDE: File -> Open this file (folder name must match 00_blink.ino).
  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
  Port:  Tools -> Port -> pick the COM port that appears when the board is plugged in

  Upload this first. If the onboard LED blinks, the toolchain works.

  Wiring: none. Onboard LED is GPIO 2 on most ESP32 DevKit boards.

  Pin map (leave GPIO 18 empty -- reserved for a later buzzer):
    GPIO 2  onboard LED
    GPIO 5  alarm LED (later)
    GPIO 34 LDR (later)
    GPIO 18 reserved, unused
*/

#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#endif

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
