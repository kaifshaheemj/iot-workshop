/*
  Lab 2 — Laser tripwire + buzzer
  Arduino IDE: File -> Open this file (folder name must match tripwire.ino).

  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
  After upload: Tools -> Serial Monitor, baud 115200

  Wiring:
    LDR AO  -> GPIO 34
    LDR VCC -> 3.3V
    LDR GND -> GND
    Laser S   -> GPIO 25
    Laser VCC -> 3.3V or 5V per the module
    Laser GND -> GND
    Buzzer SIG -> GPIO 27
    Buzzer VCC -> 3.3V or 5V per the module
    Buzzer GND -> GND
    All GND pins share ESP32 GND

  This module reads darker when the beam is blocked.
  INTRUDER when lightValue < THRESHOLD.
  Replace 1800 with the midpoint of your beam-on and beam-off Serial numbers.
*/

const int LDR_PIN = 34;
const int LASER_PIN = 25;
const int BUZZER_PIN = 27;

const int THRESHOLD = 1800;

void setup() {
  Serial.begin(115200);

  pinMode(LDR_PIN, INPUT);
  pinMode(LASER_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(LASER_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println();
  Serial.println("ESP32 INTRUDER DETECTION");
  Serial.println("Laser tripwire started. Status: NORMAL");
  Serial.println("Tune THRESHOLD from your beam-on and beam-off numbers.");
}

void loop() {
  int lightValue = analogRead(LDR_PIN);

  Serial.print("Light Value: ");
  Serial.println(lightValue);

  if (lightValue < THRESHOLD) {
    Serial.println("INTRUDER DETECTED");
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    Serial.println("NORMAL");
    digitalWrite(BUZZER_PIN, LOW);
  }

  delay(200);
}
