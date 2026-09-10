// Traffic lab Stage 1: test one external LED.
// GPIO 25 -> 220 ohm resistor -> LED anode; LED cathode -> GND.

const int RED_PIN = 25;

void setup() {
  pinMode(RED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(RED_PIN, HIGH);
  delay(1000);
  digitalWrite(RED_PIN, LOW);
  delay(1000);
}
