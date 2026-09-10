/*
  Lab 2 — Laser tripwire + servo door + web open/close
  Arduino IDE: File -> Open this file (folder name must match tripwire.ino).
  This sketch uses a second tab: page.h. Keep both files in this folder.

  Board: Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module
  After upload: Tools -> Serial Monitor, baud 115200
  Join Wi-Fi "IntruderLab" and open http://192.168.4.1

  Wiring:
    LDR VCC -> 3.3V
    LDR GND -> GND
    LDR AO  -> GPIO 34
    LED: GPIO 5 -> 220 ohm -> LED anode, cathode -> GND
    Servo signal -> GPIO 13
    Servo VCC -> 5V (external 5V if USB browns out), GND common
    Laser: power per module rating, aimed at the LDR
    GPIO 18 reserved for a later buzzer -- do not use

  No push button in this PoC.
  Set THRESHOLD from your own beam-on and beam-off Serial readings.
  Set OPEN_DEG / CLOSED_DEG so the cardboard door looks open vs shut.
*/

#include <WiFi.h>
#include <WebServer.h>
#include "page.h"

#define LDR_PIN 34
#define LED_PIN 5
#define SERVO_PIN 13
#define THRESHOLD 2500
#define OPEN_DEG 90
#define CLOSED_DEG 0
// #define BUZZER_PIN 18  // add after this setup; do not use this pin for anything else

#define AP_SSID "IntruderLab"
#define SERVO_FREQ 50
#define SERVO_RES 16
#define SERVO_CH 0

WebServer server(80);

int lightValue = 0;
int intruder = 0;
int doorClosed = 0;
unsigned long lastSerialMs = 0;

void servoWriteDeg(int deg) {
  if (deg < 0) deg = 0;
  if (deg > 180) deg = 180;
  int us = 500 + (deg * 1900) / 180;
  uint32_t duty = ((uint32_t)us * 65535UL) / 20000UL;
#if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcWrite(SERVO_PIN, duty);
#else
  ledcWrite(SERVO_CH, duty);
#endif
}

void closeDoor() {
  doorClosed = 1;
  servoWriteDeg(CLOSED_DEG);
}

void openDoor() {
  doorClosed = 0;
  servoWriteDeg(OPEN_DEG);
}

void handleRoot() {
  server.send_P(200, "text/html", PAGE_HTML);
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
  json += ",\"door\":\"";
  json += doorClosed ? "CLOSED" : "OPEN";
  json += "\"}";
  server.send(200, "application/json", json);
}

void handleOpen() {
  openDoor();
  handleStatus();
}

void handleClose() {
  closeDoor();
  handleStatus();
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

#if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcAttach(SERVO_PIN, SERVO_FREQ, SERVO_RES);
#else
  ledcSetup(SERVO_CH, SERVO_FREQ, SERVO_RES);
  ledcAttachPin(SERVO_PIN, SERVO_CH);
#endif

  openDoor();

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID);
  server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.on("/open", handleOpen);
  server.on("/close", handleClose);
  server.begin();

  Serial.println();
  Serial.println("Access point: IntruderLab");
  Serial.print("Dashboard: http://");
  Serial.println(WiFi.softAPIP());
  Serial.println("Join that Wi-Fi, then open the URL.");
}

void loop() {
  lightValue = analogRead(LDR_PIN);

  if (lightValue > THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
    if (intruder == 0) closeDoor();
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
