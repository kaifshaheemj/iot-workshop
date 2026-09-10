/*
  04 Laser tripwire + live dashboard
  Arduino IDE: File -> Open this file (folder name must match 04_tripwire_dashboard.ino).
  This sketch uses a second tab: dashboard.h (HTML page). Keep both files in this folder.

  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
  After upload: Tools -> Serial Monitor, baud 115200
  Then join Wi-Fi "IntruderLab" and open http://192.168.4.1

  Wiring:
    LDR VCC -> 3.3V
    LDR GND -> GND
    LDR AO  -> GPIO 34
    LED: GPIO 5 -> 220 ohm -> LED anode, cathode -> GND
    Laser: power per module rating, aimed at the LDR
    GPIO 18 reserved for a later buzzer -- do not use

  Set THRESHOLD from your own beam-on and beam-off Serial readings.
*/

#include <WiFi.h>
#include <WebServer.h>
#include "dashboard.h"

#define LDR_PIN 34
#define LED_PIN 5
#define THRESHOLD 2500
// #define BUZZER_PIN 18  // add after this setup; do not use this pin for anything else

#define AP_SSID "IntruderLab"

WebServer server(80);

int lightValue = 0;
int intruder = 0;
unsigned long lastSerialMs = 0;

void handleRoot() {
  server.send_P(200, "text/html", DASHBOARD_HTML);
}

void handleStatus() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Cache-Control", "no-store");

  String json = "{";
  json += "\"intruder\":";
  json += intruder ? "true" : "false";
  json += ",\"light\":";
  json += lightValue;
  json += ",\"threshold\":";
  json += THRESHOLD;
  json += "}";

  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID);

  server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.begin();

  Serial.println();
  Serial.println("Access point: IntruderLab");
  Serial.print("Dashboard: http://");
  Serial.println(WiFi.softAPIP());
  Serial.println("Join that Wi-Fi, then open the URL in a browser.");
}

void loop() {
  lightValue = analogRead(LDR_PIN);

  if (lightValue > THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    if (intruder == 0 || millis() - lastSerialMs > 500) {
      Serial.println("INTRUDER DETECTED");
      lastSerialMs = millis();
    }
    intruder = 1;
  } else {
    digitalWrite(LED_PIN, LOW);
    if (intruder == 1 || millis() - lastSerialMs > 500) {
      Serial.println("NORMAL");
      lastSerialMs = millis();
    }
    intruder = 0;
  }

  server.handleClient();
}
