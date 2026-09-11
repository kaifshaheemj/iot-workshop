/*
  Traffic Signal - Stage 2: KY-037 digital sound-event meter
  Open Serial Monitor at 115200 and tune the module's trimpot.

  Wiring:
    KY-037 VCC -> 3.3V
    KY-037 GND -> GND
    KY-037 DO  -> GPIO 17
    KY-037 AO  -> not connected
*/

const int PIN_MIC = 17;
const int SOUND_ACTIVE_LEVEL = HIGH;
const unsigned long SOUND_SAMPLE_INTERVAL = 5;
const unsigned long SOUND_WINDOW = 2000;

bool lastSoundState = false;
unsigned long lastSoundSample = 0;
unsigned long lastReportAt = 0;
unsigned long soundEvents[30];
int soundEventCount = 0;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_MIC, INPUT);
  Serial.println("KY-037 digital event meter");
}

void loop() {
  unsigned long now = millis();
  if (now - lastSoundSample < SOUND_SAMPLE_INTERVAL) return;
  lastSoundSample = now;

  bool soundActive = digitalRead(PIN_MIC) == SOUND_ACTIVE_LEVEL;
  if (soundActive && !lastSoundState && soundEventCount < 30) {
    soundEvents[soundEventCount++] = now;
  }
  lastSoundState = soundActive;

  int newCount = 0;
  for (int i = 0; i < soundEventCount; i++) {
    if (now - soundEvents[i] <= SOUND_WINDOW) {
      soundEvents[newCount++] = soundEvents[i];
    }
  }
  soundEventCount = newCount;

  if (now - lastReportAt >= 250) {
    lastReportAt = now;
    Serial.print("Events in last 2 s: ");
    Serial.println(soundEventCount);
  }
}
