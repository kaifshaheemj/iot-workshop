/*
  Lab 3 — Reaction time LEDs
  Arduino IDE: File -> Open this file (folder name must match reaction.ino).
  After upload: Tools -> Serial Monitor, baud 115200

  Wiring (this PoC includes a react button — do not add it to Lab 2):
    LED A GPIO 25 -> 220 ohm -> LED -> GND
    LED B GPIO 26 -> 220 ohm -> LED -> GND
    LED C GPIO 27 -> 220 ohm -> LED -> GND
    Button GPIO 4 to GND (INPUT_PULLUP, pressed = LOW)
    GPIO 18 reserved — do not use

  Wait for an LED, then press. Serial prints milliseconds.
  A press before the LED is a false start.
*/

#define LED_A 25
#define LED_B 26
#define LED_C 27
#define BUTTON_PIN 4
#define WAIT_MIN_MS 1000
#define WAIT_MAX_MS 4000
// #define BUZZER_PIN 18  // reserved; do not use

const int LEDS[3] = { LED_A, LED_B, LED_C };

enum Phase { IDLE, WAIT, GO, RESULT };

Phase phase = IDLE;
int activeLed = 0;
unsigned long waitUntil = 0;
unsigned long goAt = 0;

void allOff() {
  digitalWrite(LED_A, LOW);
  digitalWrite(LED_B, LOW);
  digitalWrite(LED_C, LOW);
}

int pressed() {
  return digitalRead(BUTTON_PIN) == LOW;
}

void waitRelease() {
  while (pressed()) delay(10);
}

void startRound() {
  allOff();
  phase = WAIT;
  activeLed = random(0, 3);
  unsigned long delayMs = WAIT_MIN_MS + (unsigned long)random(0, WAIT_MAX_MS - WAIT_MIN_MS + 1);
  waitUntil = millis() + delayMs;
  Serial.println("Wait for an LED...");
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_A, OUTPUT);
  pinMode(LED_B, OUTPUT);
  pinMode(LED_C, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  allOff();
  randomSeed((unsigned long)analogRead(36) ^ millis());
  Serial.println("Reaction tester. Press the button to start a round.");
}

void loop() {
  if (phase == IDLE) {
    if (pressed()) {
      waitRelease();
      startRound();
    }
    return;
  }

  if (phase == WAIT) {
    if (pressed()) {
      waitRelease();
      allOff();
      phase = IDLE;
      Serial.println("FALSE START — wait until an LED lights. Press to try again.");
      return;
    }
    if ((long)(millis() - waitUntil) >= 0) {
      digitalWrite(LEDS[activeLed], HIGH);
      goAt = millis();
      phase = GO;
    }
    return;
  }

  if (phase == GO) {
    if (pressed()) {
      unsigned long ms = millis() - goAt;
      waitRelease();
      allOff();
      phase = IDLE;
      Serial.print("Reaction time: ");
      Serial.print(ms);
      Serial.println(" ms. Press to go again.");
    }
  }
}
