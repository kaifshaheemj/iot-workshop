#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const int PIN_YELLOW = 2;
const int PIN_RED = 4;
const int PIN_GREEN = 16;
const int PIN_MIC = 17;
const int I2C_SDA = 22;
const int I2C_SCL = 21;
const uint8_t OLED_ADDRESS = 0x3C;
const int SCREEN_WIDTH = 128;
const int SCREEN_HEIGHT = 64;

const char *AP_SSID = "TrafficSignal";
const char *AP_PASSWORD = "traffic123";

const unsigned long GREEN_TIME = 10000;
const unsigned long YELLOW_TIME = 3000;
const unsigned long RED_TIME = 10000;
const unsigned long OVERRIDE_TIME = 15000;

const int SOUND_ACTIVE_LEVEL = HIGH;
const unsigned long SOUND_SAMPLE_INTERVAL = 5;
const unsigned long SOUND_WINDOW = 2000;
const int REQUIRED_SOUND_EVENTS = 12;
const unsigned long OLED_UPDATE_INTERVAL = 250;

Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
WebServer server(80);

enum SignalState { SIGNAL_RED, SIGNAL_YELLOW, SIGNAL_GREEN };
enum OperatingMode { MODE_AUTO, MODE_AMBULANCE, MODE_MANUAL };

SignalState currentSignal = SIGNAL_GREEN;
OperatingMode currentMode = MODE_AUTO;
unsigned long stateStartedAt = 0;
unsigned long overrideStartedAt = 0;
unsigned long lastSoundSample = 0;
unsigned long lastOLEDUpdate = 0;
bool lastSoundState = false;
unsigned long soundEvents[30];
int soundEventCount = 0;

const char MAIN_PAGE[] PROGMEM = R"HTML(
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ESP32 Traffic Signal</title><style>
body{font-family:Arial,sans-serif;background:#eef2f5;margin:0;padding:20px;text-align:center}.card{max-width:520px;margin:auto;background:#fff;padding:26px;border-radius:18px;box-shadow:0 8px 30px #0002}.lights{display:flex;justify-content:center;gap:14px;margin:22px}.light{width:54px;height:54px;border-radius:50%;background:#d8dee4;border:2px solid #334}.red{background:#e53e3e}.yellow{background:#f6c344}.green{background:#38a169}.status{font-size:28px;font-weight:700}.info{font-size:18px;margin:10px}button{width:100%;padding:15px;margin-top:10px;border:0;border-radius:10px;background:#1f2937;color:#fff;font-size:17px;font-weight:700}button.alt{background:#d8dee4;color:#111827}
</style></head><body><main class="card"><h1>Traffic Signal</h1><div class="lights"><i id="r" class="light"></i><i id="y" class="light"></i><i id="g" class="light"></i></div><div class="status">Signal: <span id="signal">---</span></div><div class="info">Mode: <b id="mode">---</b></div><div class="info">Next: <b id="next">---</b></div><div class="info">Time: <b id="time">---</b></div><button onclick="command('/manual')">MANUAL GREEN OVERRIDE</button><button class="alt" onclick="command('/auto')">RETURN TO AUTO</button><p id="message"></p></main><script>
var signalEl=document.getElementById('signal'),modeEl=document.getElementById('mode'),nextEl=document.getElementById('next'),timeEl=document.getElementById('time'),redEl=document.getElementById('r'),yellowEl=document.getElementById('y'),greenEl=document.getElementById('g'),messageEl=document.getElementById('message');function update(){fetch('/status').then(response=>response.json()).then(s=>{signalEl.textContent=s.signal;modeEl.textContent=s.mode;nextEl.textContent=s.next;timeEl.textContent=s.remaining+' seconds';redEl.className='light'+(s.signal==='RED'?' red':'');yellowEl.className='light'+(s.signal==='YELLOW'?' yellow':'');greenEl.className='light'+(s.signal==='GREEN'?' green':'')})}function command(path){fetch(path).then(response=>response.text()).then(text=>{messageEl.textContent=text;update()})}setInterval(update,500);update();
</script></body></html>
)HTML";

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

String signalName() {
  if (currentSignal == SIGNAL_RED) return "RED";
  if (currentSignal == SIGNAL_YELLOW) return "YELLOW";
  return "GREEN";
}

String modeName() {
  if (currentMode == MODE_AMBULANCE) return "AMBULANCE";
  if (currentMode == MODE_MANUAL) return "MANUAL";
  return "AUTO";
}

String nextStateName() {
  if (currentMode != MODE_AUTO) return "AUTO";
  if (currentSignal == SIGNAL_GREEN) return "YELLOW";
  if (currentSignal == SIGNAL_YELLOW) return "RED";
  return "GREEN";
}

unsigned long remainingSeconds() {
  unsigned long elapsed;
  unsigned long duration;
  if (currentMode == MODE_AUTO) {
    elapsed = millis() - stateStartedAt;
    duration = currentSignal == SIGNAL_GREEN ? GREEN_TIME : currentSignal == SIGNAL_YELLOW ? YELLOW_TIME : RED_TIME;
  } else {
    elapsed = millis() - overrideStartedAt;
    duration = OVERRIDE_TIME;
  }
  return elapsed >= duration ? 0 : (duration - elapsed + 999) / 1000;
}

void updateAutomaticMode() {
  unsigned long elapsed = millis() - stateStartedAt;
  if (currentSignal == SIGNAL_GREEN && elapsed >= GREEN_TIME) setSignal(SIGNAL_YELLOW);
  else if (currentSignal == SIGNAL_YELLOW && elapsed >= YELLOW_TIME) setSignal(SIGNAL_RED);
  else if (currentSignal == SIGNAL_RED && elapsed >= RED_TIME) setSignal(SIGNAL_GREEN);
}

void startAmbulanceOverride() {
  Serial.println("AMBULANCE DETECTED - starting GREEN override");
  currentMode = MODE_AMBULANCE;
  overrideStartedAt = millis();
  setSignal(SIGNAL_GREEN);
}

void startManualOverride() {
  Serial.println("MANUAL GREEN override requested");
  currentMode = MODE_MANUAL;
  overrideStartedAt = millis();
  setSignal(SIGNAL_GREEN);
}

void cancelOverride() {
  Serial.println("Override cancelled - returning to AUTO");
  currentMode = MODE_AUTO;
  setSignal(SIGNAL_GREEN);
}

void updateSoundDetection() {
  unsigned long now = millis();
  if (now - lastSoundSample < SOUND_SAMPLE_INTERVAL) return;
  lastSoundSample = now;

  bool soundActive = digitalRead(PIN_MIC) == SOUND_ACTIVE_LEVEL;
  if (soundActive && !lastSoundState && soundEventCount < 30) soundEvents[soundEventCount++] = now;
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

void updateOLED() {
  unsigned long now = millis();
  if (now - lastOLEDUpdate < OLED_UPDATE_INTERVAL) return;
  lastOLEDUpdate = now;
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("TRAFFIC SIGNAL");
  display.drawLine(0, 10, 127, 10, SH110X_WHITE);
  display.setCursor(0, 15);
  display.print("MODE: ");
  display.println(modeName());
  display.setTextSize(2);
  display.setCursor(0, 27);
  display.println(signalName());
  display.setTextSize(1);
  display.setCursor(0, 48);
  if (currentMode == MODE_AUTO) {
    display.print("NEXT: ");
    display.println(nextStateName());
    display.setCursor(0, 57);
    display.print("SWITCH IN: ");
  } else {
    display.print("RETURN AUTO IN: ");
  }
  display.print(remainingSeconds());
  display.println("s");
  display.display();
}

void handleStatus() {
  String json = "{\"signal\":\"" + signalName() + "\",\"mode\":\"" + modeName();
  json += "\",\"next\":\"" + nextStateName() + "\",\"remaining\":" + String(remainingSeconds()) + "}";
  server.sendHeader("Cache-Control", "no-store");
  server.send(200, "application/json", json);
}

void handleManual() {
  if (currentMode == MODE_AMBULANCE) {
    server.send(200, "text/plain", "Ambulance override is active.");
    return;
  }
  startManualOverride();
  server.send(200, "text/plain", "Manual GREEN override activated.");
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RED, OUTPUT);
  pinMode(PIN_YELLOW, OUTPUT);
  pinMode(PIN_GREEN, OUTPUT);
  pinMode(PIN_MIC, INPUT);

  Wire.begin(I2C_SDA, I2C_SCL);
  if (!display.begin(OLED_ADDRESS, true)) {
    Serial.println("OLED initialization failed!");
    while (true) delay(100);
  }

  currentMode = MODE_AUTO;
  setSignal(SIGNAL_GREEN);
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  server.on("/", HTTP_GET, []() { server.send_P(200, "text/html", MAIN_PAGE); });
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/manual", HTTP_GET, handleManual);
  server.on("/auto", HTTP_GET, []() { cancelOverride(); server.send(200, "text/plain", "Returned to automatic mode."); });
  server.begin();

  Serial.print("Wi-Fi Network: ");
  Serial.println(AP_SSID);
  Serial.print("Password: ");
  Serial.println(AP_PASSWORD);
  Serial.print("Web page: http://");
  Serial.println(WiFi.softAPIP());
  updateOLED();
}

void loop() {
  server.handleClient();
  updateSoundDetection();

  if (currentMode == MODE_AUTO) {
    updateAutomaticMode();
  } else if (millis() - overrideStartedAt >= OVERRIDE_TIME) {
    currentMode = MODE_AUTO;
    setSignal(SIGNAL_GREEN);
    Serial.println("Override finished - AUTO resumed");
  }

  updateOLED();
}
