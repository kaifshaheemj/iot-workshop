// Traffic lab Stage 3: observe analog sound levels before integrating.
// Sound sensor AO -> GPIO 34, VCC -> 3.3 V, GND -> GND.

const int SOUND_PIN = 34;

void setup() {
  Serial.begin(115200);
  pinMode(SOUND_PIN, INPUT);
  Serial.println("Sound check ready");
}

void loop() {
  int soundLevel = analogRead(SOUND_PIN);
  Serial.print("sound=");
  Serial.println(soundLevel);
  delay(100);
}
