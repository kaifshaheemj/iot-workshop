// Traffic lab Stage 2: cycle three LEDs without the sensor or web page.
// Each GPIO goes through its own 220 ohm resistor to an LED anode.

const int RED_PIN = 25;
const int YELLOW_PIN = 26;
const int GREEN_PIN = 27;

void allOff() {
  digitalWrite(RED_PIN, LOW);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
}

void showOnly(int pin, unsigned long duration) {
  allOff();
  digitalWrite(pin, HIGH);
  delay(duration);
}

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  allOff();
}

void loop() {
  showOnly(GREEN_PIN, 3000);
  showOnly(YELLOW_PIN, 1000);
  showOnly(RED_PIN, 3000);
}
