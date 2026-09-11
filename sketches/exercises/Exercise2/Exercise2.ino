/*
  Exercise 2: Four push buttons control four LEDs
  Board: ESP32 Dev Module

  Each button input has an external pull-up resistor to 3.3 V and a push
  button to GND. A pressed button reads LOW. Debounce is handled in software;
  no debounce capacitors are used. Each LED requires a current-limiting resistor.
*/

const uint8_t LED_PINS[4] = {16, 17, 18, 19};
const uint8_t BUTTON_PINS[4] = {25, 26, 27, 32};
const uint8_t BUTTON_COUNT = 4;
const uint32_t DEBOUNCE_MS = 25;

struct ButtonState {
  uint8_t raw;
  uint8_t stable;
  uint32_t changedAt;
};

ButtonState buttons[BUTTON_COUNT];

void setup() {
  for (uint8_t i = 0; i < BUTTON_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
    pinMode(BUTTON_PINS[i], INPUT);
    uint8_t initial = digitalRead(BUTTON_PINS[i]);
    buttons[i] = {initial, initial, millis()};
  }
}

void loop() {
  uint32_t now = millis();

  for (uint8_t i = 0; i < BUTTON_COUNT; i++) {
    uint8_t reading = digitalRead(BUTTON_PINS[i]);

    if (reading != buttons[i].raw) {
      buttons[i].raw = reading;
      buttons[i].changedAt = now;
    }

    if (now - buttons[i].changedAt >= DEBOUNCE_MS) {
      buttons[i].stable = buttons[i].raw;
    }

    bool pressed = buttons[i].stable == LOW;
    digitalWrite(LED_PINS[i], pressed ? HIGH : LOW);
  }

  delay(1);
}
