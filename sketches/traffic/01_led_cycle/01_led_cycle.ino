/*
  Traffic Signal - Stage 1: automatic LED cycle

  Wiring:
    GPIO 4  -> 220 ohm -> red LED anode; cathode -> GND
    GPIO 2  -> 220 ohm -> yellow LED anode; cathode -> GND
    GPIO 16 -> 220 ohm -> green LED anode; cathode -> GND
*/

const int PIN_YELLOW = 2;
const int PIN_RED = 4;
const int PIN_GREEN = 16;

const unsigned long GREEN_TIME = 10000;
const unsigned long YELLOW_TIME = 3000;
const unsigned long RED_TIME = 10000;

enum SignalState {
  SIGNAL_RED,
  SIGNAL_YELLOW,
  SIGNAL_GREEN
};

SignalState currentSignal = SIGNAL_GREEN;
unsigned long stateStartedAt = 0;

void setSignalOutputs() {
  digitalWrite(PIN_RED, LOW);
  digitalWrite(PIN_YELLOW, LOW);
  digitalWrite(PIN_GREEN, LOW);

  if (currentSignal == SIGNAL_RED) digitalWrite(PIN_RED, HIGH);
  else if (currentSignal == SIGNAL_YELLOW) digitalWrite(PIN_YELLOW, HIGH);
  else digitalWrite(PIN_GREEN, HIGH);
}

void setSignal(SignalState newState) {
  currentSignal = newState;
  stateStartedAt = millis();
  setSignalOutputs();
}

void setup() {
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_YELLOW, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  setSignal(SIGNAL_GREEN);
}

void loop() {
  unsigned long elapsed = millis() - stateStartedAt;

  if (currentSignal == SIGNAL_GREEN && elapsed >= GREEN_TIME) {
    setSignal(SIGNAL_YELLOW);
  } else if (currentSignal == SIGNAL_YELLOW && elapsed >= YELLOW_TIME) {
    setSignal(SIGNAL_RED);
  } else if (currentSignal == SIGNAL_RED && elapsed >= RED_TIME) {
    setSignal(SIGNAL_GREEN);
  }
}
