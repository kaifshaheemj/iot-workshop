/*
  Lab 1 — Traffic light + ambulance interrupt + web status
  Arduino IDE: File -> Open this file (folder name must match traffic.ino).
  This sketch uses a second tab: page.h. Keep both files in this folder.

  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
  After upload: Tools -> Serial Monitor, baud 115200
  Join Wi-Fi "TrafficLab" and open http://192.168.4.1

  Wiring (defaults — change the #define lines if CONTEXT uses other pins):
    Red LED    GPIO 25 -> 220 ohm -> LED -> GND
    Yellow LED GPIO 26 -> 220 ohm -> LED -> GND
    Green LED  GPIO 27 -> 220 ohm -> LED -> GND
    Sound AO   GPIO 34 (ADC1)
    Sound VCC  3.3V    Sound GND -> GND
    GPIO 18 reserved — do not use

  Tune SOUND_THRESHOLD from Serial (quiet vs siren/clap).
*/

#include <WiFi.h>
#include <WebServer.h>
#include "page.h"

#define RED_PIN 25
#define YELLOW_PIN 26
#define GREEN_PIN 27
#define SOUND_PIN 34
#define SOUND_THRESHOLD 2800
// #define BUZZER_PIN 18  // reserved; do not use

#define AP_SSID "TrafficLab"

#define T_RED_MS 3000
#define T_YELLOW_MS 1000
#define T_GREEN_MS 3000
#define T_AMBULANCE_GREEN_MS 4000

enum LightState { ST_RED, ST_YELLOW, ST_GREEN };

WebServer server(80);
LightState light = ST_RED;
unsigned long stateSince = 0;
int ambulance = 0;
int soundPeak = 0;

const char *stateName() {
  if (light == ST_RED) return "RED";
  if (light == ST_YELLOW) return "YELLOW";
  return "GREEN";
}

void setLights(int r, int y, int g) {
  digitalWrite(RED_PIN, r ? HIGH : LOW);
  digitalWrite(YELLOW_PIN, y ? HIGH : LOW);
  digitalWrite(GREEN_PIN, g ? HIGH : LOW);
}

void applyLight() {
  if (light == ST_RED) setLights(1, 0, 0);
  else if (light == ST_YELLOW) setLights(0, 1, 0);
  else setLights(0, 0, 1);
}

void enter(LightState next) {
  light = next;
  stateSince = millis();
  applyLight();
}

int readSoundPeak() {
  int peak = 0;
  unsigned long t0 = millis();
  while (millis() - t0 < 40) {
    int v = analogRead(SOUND_PIN);
    if (v > peak) peak = v;
  }
  return peak;
}

void handleRoot() {
  server.send_P(200, "text/html", PAGE_HTML);
}

void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Cache-Control", "no-store");
  String json = "{";
  json += "\"state\":\"";
  json += stateName();
  json += "\",\"ambulance\":";
  json += ambulance ? "true" : "false";
  json += ",\"sound\":";
  json += soundPeak;
  json += ",\"threshold\":";
  json += SOUND_THRESHOLD;
  json += "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  enter(ST_RED);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID);
  server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.begin();

  Serial.println();
  Serial.println("Access point: TrafficLab");
  Serial.print("Status page: http://");
  Serial.println(WiFi.softAPIP());
  Serial.println("Tune SOUND_THRESHOLD from the sound numbers below.");
}

void loop() {
  soundPeak = readSoundPeak();

  if (soundPeak > SOUND_THRESHOLD) {
    if (!ambulance || light != ST_GREEN) {
      Serial.println("AMBULANCE — green");
    }
    ambulance = 1;
    enter(ST_GREEN);
  }

  unsigned long hold = T_RED_MS;
  if (light == ST_YELLOW) hold = T_YELLOW_MS;
  if (light == ST_GREEN) hold = ambulance ? T_AMBULANCE_GREEN_MS : T_GREEN_MS;

  if (millis() - stateSince >= hold) {
    ambulance = 0;
    if (light == ST_RED) enter(ST_YELLOW);
    else if (light == ST_YELLOW) enter(ST_GREEN);
    else enter(ST_RED);
  }

  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 400) {
    lastPrint = millis();
    Serial.print("state=");
    Serial.print(stateName());
    Serial.print(" sound=");
    Serial.println(soundPeak);
  }

  server.handleClient();
}
