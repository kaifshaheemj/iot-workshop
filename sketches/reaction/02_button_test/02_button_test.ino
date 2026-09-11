/*
  Reaction Arena - Stage 2: prove all four LED/button pairs
  INPUT_PULLUP means released is HIGH and pressed is LOW.

  Channel 1: LED GPIO 16, button GPIO 25 -> GND
  Channel 2: LED GPIO 17, button GPIO 26 -> GND
  Channel 3: LED GPIO 18, button GPIO 27 -> GND
  Channel 4: LED GPIO 19, button GPIO 32 -> GND
*/

const uint8_t LED_PINS[4] = {16, 17, 18, 19};
const uint8_t BUTTON_PINS[4] = {25, 26, 27, 32};
const uint32_t BUTTON_DEBOUNCE_MS = 25;

bool rawState[4];
bool stableState[4];
uint32_t changedAt[4];

void setup() {
  Serial.begin(115200);
  for (uint8_t i = 0; i < 4; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);
    rawState[i] = digitalRead(BUTTON_PINS[i]);
    stableState[i] = rawState[i];
    changedAt[i] = millis();
  }
}

void loop() {
  uint32_t now = millis();
  for (uint8_t i = 0; i < 4; i++) {
    bool reading = digitalRead(BUTTON_PINS[i]);
    if (reading != rawState[i]) {
      rawState[i] = reading;
      changedAt[i] = now;
    }

    if (reading != stableState[i] && now - changedAt[i] >= BUTTON_DEBOUNCE_MS) {
      stableState[i] = reading;
      Serial.print("Button ");
      Serial.print(i + 1);
      Serial.println(reading == LOW ? " PRESSED" : " RELEASED");
    }

    digitalWrite(LED_PINS[i], stableState[i] == LOW ? HIGH : LOW);
  }
  delay(1);
}
