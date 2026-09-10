/*
  03 Laser tripwire (Serial + LED)
  Arduino IDE: File -> Open this file (folder name must match 03_tripwire_serial.ino).
  After upload: Tools -> Serial Monitor, baud 115200

  Wiring:
    LDR VCC -> 3.3V
    LDR GND -> GND
    LDR AO  -> GPIO 34
    LED: GPIO 5 -> 220 ohm -> LED anode, cathode -> GND
    Laser: power per module rating, aimed at the LDR
    GPIO 18 reserved for a later buzzer -- do not use

  Set THRESHOLD from your own beam-on and beam-off Serial readings.
*/

#define LDR_PIN 34
#define LED_PIN 5
#define THRESHOLD 2500
// #define BUZZER_PIN 18  // add after this setup; do not use this pin for anything else

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightValue = analogRead(LDR_PIN);

  if (lightValue > THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("INTRUDER DETECTED");
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("NORMAL");
  }

  delay(200);
}
