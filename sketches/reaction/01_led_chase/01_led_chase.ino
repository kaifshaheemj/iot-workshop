/*
  Reaction Arena - Stage 1: prove all four LEDs

  Wiring:
    GPIO 16 -> 220 ohm -> LED 1 anode; cathode -> GND
    GPIO 17 -> 220 ohm -> LED 2 anode; cathode -> GND
    GPIO 18 -> 220 ohm -> LED 3 anode; cathode -> GND
    GPIO 19 -> 220 ohm -> LED 4 anode; cathode -> GND
*/

const uint8_t LED_PINS[4] = {16, 17, 18, 19};
const uint8_t LED_COUNT = 4;
const unsigned long TEST_DELAY_MS = 500;

void setOnlyLed(int8_t selected) {
  for (uint8_t i = 0; i < LED_COUNT; i++) {
    digitalWrite(LED_PINS[i], i == selected ? HIGH : LOW);
  }
}

void setup() {
  for (uint8_t i = 0; i < LED_COUNT; i++) pinMode(LED_PINS[i], OUTPUT);
}

void loop() {
  for (uint8_t i = 0; i < LED_COUNT; i++) {
    setOnlyLed(i);
    delay(TEST_DELAY_MS);
  }
}
