/*
  Exercise 5: DHT11 temperature and humidity on an LCD
  Board: ESP32 Dev Module

  DHT11 module:
    DATA -> GPIO 4
    VCC  -> 3.3 V
    GND  -> GND

  Buzzer module:
    IN   -> GPIO 27
    VCC  -> 5 V
    GND  -> GND

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
const uint8_t BUZZER_ACTIVE_LEVEL = HIGH;
const float TEMPERATURE_LIMIT_C = 35.0f;
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
      if (address == 0x27 || address == 0x3F) preferredAddress = address;
    }
  }

  return preferredAddress != 0 ? preferredAddress : firstAddress;
}

void writeBuzzer(bool on) {
  digitalWrite(BUZZER_PIN, on ? BUZZER_ACTIVE_LEVEL : !BUZZER_ACTIVE_LEVEL);
}

void setTemperatureAlarm(bool active, uint32_t now) {
  if (active == alarmActive) return;

  alarmActive = active;
  buzzerSounding = active;
  lastBuzzerChangeAt = now;
  writeBuzzer(buzzerSounding);
}

void updateBuzzer(uint32_t now) {
  if (!alarmActive || now - lastBuzzerChangeAt < BUZZER_PHASE_MS) return;

  lastBuzzerChangeAt = now;
  buzzerSounding = !buzzerSounding;
  writeBuzzer(buzzerSounding);
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
  writeBuzzer(false);
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
