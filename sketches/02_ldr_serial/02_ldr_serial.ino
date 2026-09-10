/*
  02 LDR Serial
  Arduino IDE: File -> Open this file (folder name must match 02_ldr_serial.ino).
  After upload: Tools -> Serial Monitor, baud 115200

  Wiring:
    LDR VCC -> 3.3V
    LDR GND -> GND
    LDR AO  -> GPIO 34
    LDR DO  -> not connected
    GPIO 18 reserved for a later buzzer -- do not use
*/

#define LDR_PIN 34

void setup() {
  Serial.begin(115200);
}

void loop() {
  int lightValue = analogRead(LDR_PIN);
  Serial.println(lightValue);
  delay(200);
}
