/*
  Exercise 7: Read LDR light intensity from A0 and show it on an LCD
  Board: ESP32 Dev Module

  LDR module wiring:
    A0  -> GPIO 34
    VCC -> 3.3 V
    GND -> GND

  Required library: LiquidCrystal I2C
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C *display = nullptr;

const uint8_t LDR_A0_PIN = 34;
const uint8_t SDA_PIN = 21;
const uint8_t SCL_PIN = 22;
const bool REVERSE_LIGHT_SCALE = true;

uint8_t scanForLcd() {
  uint8_t firstAddress = 0;
  uint8_t preferredAddress = 0;

  Serial.println("Scanning I2C bus...");

  for (uint8_t address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    uint8_t error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C device found at 0x");
      if (address < 0x10) Serial.print("0");
      Serial.println(address, HEX);

      if (firstAddress == 0) firstAddress = address;
      if (address == 0x27 || address == 0x3F) preferredAddress = address;
    }
  }

  return preferredAddress != 0 ? preferredAddress : firstAddress;
}

void showReading(uint16_t raw, uint8_t lightPercent) {
  display->setCursor(0, 0);
  display->print("Light:");
  display->print(lightPercent);
  display->print("%     ");

  display->setCursor(0, 1);
  display->print("ADC:");
  display->print(raw);
  display->print("        ");
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(LDR_A0_PIN, ADC_11db);
  Wire.begin(SDA_PIN, SCL_PIN);

  uint8_t lcdAddress = scanForLcd();
  while (lcdAddress == 0) {
    Serial.println("No I2C device found. Check SDA, SCL, power and GND.");
    delay(2000);
    lcdAddress = scanForLcd();
  }

  Serial.print("Using LCD address 0x");
  if (lcdAddress < 0x10) Serial.print("0");
  Serial.println(lcdAddress, HEX);

  display = new LiquidCrystal_I2C(lcdAddress, 16, 2);
  display->init();
  display->backlight();
  display->clear();
}

void loop() {
  uint16_t raw = analogRead(LDR_A0_PIN);
  uint8_t lightPercent;

  if (REVERSE_LIGHT_SCALE) lightPercent = map(raw, 4095, 0, 0, 100);
  else lightPercent = map(raw, 0, 4095, 0, 100);

  Serial.printf("LDR A0=%u, Light intensity=%u%%\n", raw, lightPercent);
  showReading(raw, lightPercent);
  delay(250);
}
