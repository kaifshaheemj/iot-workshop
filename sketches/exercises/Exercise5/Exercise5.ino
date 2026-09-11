/*
  Exercise 5: DHT11 temperature and humidity on an LCD
  Board: ESP32 Dev Module

  A bare DHT11 needs a pull-up resistor from DATA to 3.3 V. Most DHT11
  modules already include one.

  5 V passive buzzer wiring (use an NPN transistor driver):
    Buzzer positive (+) -> 5 V
    Buzzer negative (-) -> transistor collector
    Transistor emitter  -> GND
    GPIO 27 -> 1K resistor -> transistor base

  Required libraries:
    DHT sensor library, Adafruit Unified Sensor
    LiquidCrystal I2C
*/

#include <Wire.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C *display = nullptr;

const uint8_t DHT_PIN = 4;
const uint8_t SDA_PIN = 21;
const uint8_t SCL_PIN = 22;
const uint8_t BUZZER_PIN = 27;
const float TEMPERATURE_LIMIT_C = 35.0f;
const uint16_t BUZZER_FREQUENCY_HZ = 2000;
const uint32_t BUZZER_PHASE_MS = 500;
const uint32_t SENSOR_INTERVAL_MS = 2000;

DHT dht(DHT_PIN, DHT11);
bool alarmActive = false;
bool buzzerSounding = false;
bool firstSensorRead = true;
uint32_t lastSensorReadAt = 0;
uint32_t lastBuzzerChangeAt = 0;

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
      if (address == 0x27 || address == 0x3F) {
        preferredAddress = address;
      }
    }
  }

  // Prefer the two common LCD backpack addresses when several devices exist.
  return preferredAddress != 0 ? preferredAddress : firstAddress;
}

void setTemperatureAlarm(bool active, uint32_t now) {
  if (active == alarmActive) return;

  alarmActive = active;
  buzzerSounding = active;
  lastBuzzerChangeAt = now;

  if (buzzerSounding) tone(BUZZER_PIN, BUZZER_FREQUENCY_HZ);
  else noTone(BUZZER_PIN);
}

void updateBuzzer(uint32_t now) {
  if (!alarmActive || now - lastBuzzerChangeAt < BUZZER_PHASE_MS) return;

  lastBuzzerChangeAt = now;
  buzzerSounding = !buzzerSounding;

  if (buzzerSounding) tone(BUZZER_PIN, BUZZER_FREQUENCY_HZ);
  else noTone(BUZZER_PIN);
}

void showError() {
  display->clear();
  display->setCursor(0, 0);
  display->print("DHT read failed");
  display->setCursor(0, 1);
  display->print("Check wiring");
}

void showReading(float temperature, float humidity) {
  display->setCursor(0, 0);
  display->print("Temp:");
  display->print(temperature, 1);
  display->print((char)223);
  display->print("C  ");
  display->setCursor(0, 1);
  display->print("Hum :");
  display->print(humidity, 1);
  display->print("%   ");
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  noTone(BUZZER_PIN);
  dht.begin();
  Wire.begin(SDA_PIN, SCL_PIN);

  uint8_t lcdAddress = scanForLcd();
  while (lcdAddress == 0) {
    Serial.println("No I2C device found. Check LCD wiring.");
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
  uint32_t now = millis();

  if (firstSensorRead || now - lastSensorReadAt >= SENSOR_INTERVAL_MS) {
    firstSensorRead = false;
    lastSensorReadAt = now;

    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("DHT11 read failed");
      showError();
    } else {
      Serial.printf("Temperature: %.1f C, Humidity: %.1f %%\n", temperature, humidity);
      showReading(temperature, humidity);
      setTemperatureAlarm(temperature > TEMPERATURE_LIMIT_C, now);
    }
  }

  updateBuzzer(now);
  delay(1);
}
