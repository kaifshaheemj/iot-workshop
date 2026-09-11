/*
  Exercise 3: Traffic light sequence
  Board: ESP32 Dev Module

  GPIO -> current-limiting resistor -> LED anode; LED cathode -> GND
*/

const uint8_t RED_LED_PIN = 16;
const uint8_t YELLOW_LED_PIN = 17;
const uint8_t GREEN_LED_PIN = 18;

void setLights(bool red, bool yellow, bool green) {
  digitalWrite(RED_LED_PIN, red);
  digitalWrite(YELLOW_LED_PIN, yellow);
  digitalWrite(GREEN_LED_PIN, green);
}

void setup() {
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  setLights(false, false, false);
}

void loop() {
  setLights(true, false, false);   // Stop
  delay(5000);

  setLights(true, true, false);    // Get ready
  delay(1000);

  setLights(false, false, true);   // Go
  delay(5000);

  setLights(false, true, false);   // Prepare to stop
  delay(2000);
}
