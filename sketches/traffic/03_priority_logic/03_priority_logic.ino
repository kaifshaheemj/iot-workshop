/*
  Traffic Signal - Stage 3: repeated sound triggers ambulance priority

  Wiring:
    Red LED GPIO 4, yellow LED GPIO 2, green LED GPIO 16
    Each LED uses a 220 ohm resistor and returns to GND
    KY-037 VCC -> 3.3V, GND -> GND, DO -> GPIO 17
*/

const int PIN_YELLOW = 2;
const int PIN_RED = 4;
const int PIN_GREEN = 16;
const int PIN_MIC = 17;

const unsigned long GREEN_TIME = 10000;
const unsigned long YELLOW_TIME = 3000;
const unsigned long RED_TIME = 10000;
const unsigned long OVERRIDE_TIME = 15000;

const int SOUND_ACTIVE_LEVEL = HIGH;
const unsigned long SOUND_SAMPLE_INTERVAL = 5;
const unsigned long SOUND_WINDOW = 2000;
const int REQUIRED_SOUND_EVENTS = 12;

enum SignalState { SIGNAL_RED, SIGNAL_YELLOW, SIGNAL_GREEN };
enum OperatingMode { MODE_AUTO, MODE_AMBULANCE };

SignalState currentSignal = SIGNAL_GREEN;
OperatingMode currentMode = MODE_AUTO;
unsigned long stateStartedAt = 0;
unsigned long overrideStartedAt = 0;
bool lastSoundState = false;
unsigned long lastSoundSample = 0;
unsigned long soundEvents[30];
int soundEventCount = 0;

void setSignalOutputs() {
  digitalWrite(PIN_RED, currentSignal == SIGNAL_RED ? HIGH : LOW);
  digitalWrite(PIN_YELLOW, currentSignal == SIGNAL_YELLOW ? HIGH : LOW);
  digitalWrite(PIN_GREEN, currentSignal == SIGNAL_GREEN ? HIGH : LOW);
}

void setSignal(SignalState newState) {
  currentSignal = newState;
  stateStartedAt = millis();
  setSignalOutputs();
}

void updateAutomaticMode() {
  unsigned long elapsed = millis() - stateStartedAt;
  if (currentSignal == SIGNAL_GREEN && elapsed >= GREEN_TIME) setSignal(SIGNAL_YELLOW);
  else if (currentSignal == SIGNAL_YELLOW && elapsed >= YELLOW_TIME) setSignal(SIGNAL_RED);
  else if (currentSignal == SIGNAL_RED && elapsed >= RED_TIME) setSignal(SIGNAL_GREEN);
}

void startAmbulanceOverride() {
  currentMode = MODE_AMBULANCE;
  overrideStartedAt = millis();
  setSignal(SIGNAL_GREEN);
  Serial.println("AMBULANCE DETECTED - GREEN override");
}

void updateSoundDetection() {
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
    if (now - soundEvents[i] <= SOUND_WINDOW) soundEvents[newCount++] = soundEvents[i];
  }
  soundEventCount = newCount;

  if (soundEventCount >= REQUIRED_SOUND_EVENTS && currentMode == MODE_AUTO) {
    soundEventCount = 0;
    startAmbulanceOverride();
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_YELLOW, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_MIC, INPUT);
  setSignal(SIGNAL_GREEN);
}

void loop() {
  updateSoundDetection();

  if (currentMode == MODE_AUTO) {
    updateAutomaticMode();
  } else if (millis() - overrideStartedAt >= OVERRIDE_TIME) {
    currentMode = MODE_AUTO;
    setSignal(SIGNAL_GREEN);
    Serial.println("Ambulance override finished");
  }
}
