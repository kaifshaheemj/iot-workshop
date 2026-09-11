/*
  Exercise 6: HC-SR04 distance measurement on an OLED
  Board: ESP32 Dev Module

  This sketch assumes the 3.3 V-compatible HC-SR04 variant.

  Wiring:
    HC-SR04 VCC  -> ESP32 3.3 V
    HC-SR04 GND  -> ESP32 GND
    HC-SR04 TRIG -> GPIO 5
    HC-SR04 ECHO -> GPIO 18 directly (no voltage divider required)

  Do not use this direct ECHO connection with a standard 5 V-output HC-SR04.

  Required libraries:
    Adafruit GFX Library
    Adafruit SH110X
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const uint8_t SCREEN_WIDTH = 128;
const uint8_t SCREEN_HEIGHT = 64;
const uint8_t OLED_ADDRESS = 0x3C;
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

const uint8_t TRIG_PIN = 5;
const uint8_t ECHO_PIN = 18;
const uint8_t SDA_PIN = 21;
const uint8_t SCL_PIN = 22;
const uint32_t ECHO_TIMEOUT_US = 30000;

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  uint32_t duration = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  if (duration == 0) return -1.0f;
  return duration * 0.0343f / 2.0f;
}

void showDistance(float distance) {
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);
  display.setTextSize(2);
  display.setCursor(16, 0);
  display.println("Distance");
  display.setCursor(12, 32);
  if (distance < 0) display.print("No echo");
  else {
    display.print(distance, 1);
    display.print(" cm");
  }
  display.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);
  Wire.begin(SDA_PIN, SCL_PIN);

  if (!display.begin(OLED_ADDRESS, true)) {
    Serial.println("SH1106 initialization failed");
    while (true) delay(1000);
  }
}

void loop() {
  float distance = readDistanceCm();
  if (distance < 0) Serial.println("No echo / out of range");
  else Serial.printf("Distance: %.1f cm\n", distance);
  showDistance(distance);
  delay(250);
}
