/*
  Exercise 8: Clap-based counter on an OLED display
  Board: ESP32 Dev Module

  Microphone module (analog output):
    A0  -> GPIO 34
    VCC -> 3.3 V
    GND -> GND

  SH1106 OLED (128 x 64, I2C):
    SDA -> GPIO 21
    SCL -> GPIO 22
    VCC -> 3.3 V
    GND -> GND

  Required libraries:
    Adafruit GFX Library
    Adafruit SH110X

  Each detected clap increments the counter once. The counter resets whenever
  the ESP32 restarts. Increase CLAP_THRESHOLD if noise causes false counts, or
  decrease it if claps are not detected.
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const uint8_t MIC_A0_PIN = 34;
const uint8_t SDA_PIN = 21;
const uint8_t SCL_PIN = 22;

const uint8_t SCREEN_WIDTH = 128;
const uint8_t SCREEN_HEIGHT = 64;
const uint8_t OLED_ADDRESS = 0x3C;

const uint16_t CLAP_THRESHOLD = 350;
const uint32_t CLAP_LOCKOUT_MS = 350;
const uint32_t SERIAL_INTERVAL_MS = 250;

Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

uint32_t clapCount = 0;
uint32_t lastClapAt = 0;
uint32_t lastSerialAt = 0;
float microphoneBaseline = 0.0f;

void showCounter() {
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);

  String message = "Count : " + String(clapCount);
  uint8_t textSize = message.length() <= 10 ? 2 : 1;
  display.setTextSize(textSize);

  int16_t boundsX;
  int16_t boundsY;
  uint16_t textWidth;
  uint16_t textHeight;
  display.getTextBounds(message, 0, 0, &boundsX, &boundsY,
                        &textWidth, &textHeight);

  int16_t cursorX = (SCREEN_WIDTH - textWidth) / 2;
  int16_t cursorY = (SCREEN_HEIGHT - textHeight) / 2;
  display.setCursor(cursorX, cursorY);
  display.print(message);
  display.display();
}

void calibrateMicrophone() {
  const uint16_t sampleCount = 500;
  uint32_t total = 0;

  for (uint16_t i = 0; i < sampleCount; i++) {
    total += analogRead(MIC_A0_PIN);
    delay(2);
  }

  microphoneBaseline = (float)total / sampleCount;
  Serial.print("Microphone baseline: ");
  Serial.println(microphoneBaseline, 1);
}

void setup() {
  Serial.begin(115200);
  pinMode(MIC_A0_PIN, INPUT);
  analogReadResolution(12);
  analogSetPinAttenuation(MIC_A0_PIN, ADC_11db);

  Wire.begin(SDA_PIN, SCL_PIN);
  if (!display.begin(OLED_ADDRESS, true)) {
    Serial.println("SH1106 initialization failed");
    while (true) delay(1000);
  }

  calibrateMicrophone();
  showCounter();
  Serial.println("Clap counter ready");
}

void loop() {
  uint32_t now = millis();
  uint16_t rawValue = analogRead(MIC_A0_PIN);
  uint16_t signalLevel = abs((int)rawValue - (int)microphoneBaseline);

  // Slowly follow normal background drift, but do not follow a loud clap.
  if (signalLevel < CLAP_THRESHOLD) {
    microphoneBaseline = microphoneBaseline * 0.995f + rawValue * 0.005f;
  }

  if (signalLevel >= CLAP_THRESHOLD &&
      now - lastClapAt >= CLAP_LOCKOUT_MS) {
    lastClapAt = now;
    clapCount++;
    Serial.print("Clap detected! Count: ");
    Serial.println(clapCount);
    showCounter();
  }

  if (now - lastSerialAt >= SERIAL_INTERVAL_MS) {
    lastSerialAt = now;
    Serial.print("A0: ");
    Serial.print(rawValue);
    Serial.print("  Signal: ");
    Serial.print(signalLevel);
    Serial.print("  Count: ");
    Serial.println(clapCount);
  }

  delay(1);
}
