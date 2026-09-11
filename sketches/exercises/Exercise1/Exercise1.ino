/*
  Exercise 1: Blink four LEDs in sequence
  Board: ESP32 Dev Module

  Wiring (repeat for every LED):
  GPIO -> current-limiting resistor -> LED anode; LED cathode -> GND
*/

const uint8_t LED_PINS[] = {16, 17, 18, 19};
const uint8_t LED_COUNT = sizeof(LED_PINS) / sizeof(LED_PINS[0]);
const uint16_t STEP_DELAY_MS = 250;

void setup() {
  for (uint8_t i = 0; i < LED_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void loop() {
  // Chase from LED 1 to LED 4.
  for (uint8_t i = 0; i < LED_COUNT; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(STEP_DELAY_MS);
    digitalWrite(LED_PINS[i], LOW);
  }

  // Chase back from LED 3 to LED 2 without repeating the end LEDs.
  for (int8_t i = LED_COUNT - 2; i > 0; i--) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(STEP_DELAY_MS);
    digitalWrite(LED_PINS[i], LOW);
  }
}
