/*
  Exercise 7: Servo angle slider from an ESP32 SoftAP
  Board: ESP32 Dev Module

  Connect a phone to Wi-Fi "ESP32-Servo", then open 192.168.4.1.
  Power the servo from a suitable external 5 V supply and join its GND to
  ESP32 GND.

  Required library: ESP32Servo
*/

#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const uint8_t SERVO_PIN = 13;
const char *AP_SSID = "ESP32-Servo";
const char *AP_PASSWORD = "esp32demo";  // Eight or more characters

Servo servoMotor;
WebServer server(80);
int servoAngle = 90;

const char PAGE[] PROGMEM = R"HTML(
<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ESP32 Servo Control</title>
<style>
body{font-family:Arial,sans-serif;max-width:480px;margin:40px auto;padding:0 18px;background:#eef2f7;color:#172033}
.card{background:white;padding:24px;border-radius:18px;box-shadow:0 8px 28px #0002}
input{width:100%}#value{font-size:2rem;font-weight:bold}
</style></head><body><div class="card"><h1>Servo Control</h1>
<p>Servo angle: <span id="value">90</span>&deg;</p>
<input id="angle" type="range" min="0" max="180" value="90"></div>
<script>
const slider=document.getElementById('angle'),value=document.getElementById('value');
let timer;slider.oninput=()=>{value.textContent=slider.value;clearTimeout(timer);timer=setTimeout(()=>fetch('/servo?angle='+slider.value),80)};
</script></body></html>
)HTML";

void handleServo() {
  if (!server.hasArg("angle")) {
    server.send(400, "text/plain", "Missing angle");
    return;
  }
  servoAngle = constrain(server.arg("angle").toInt(), 0, 180);
  servoMotor.write(servoAngle);
  server.send(200, "text/plain", String(servoAngle));
}

void setup() {
  Serial.begin(115200);

  servoMotor.setPeriodHertz(50);
  servoMotor.attach(SERVO_PIN, 500, 2400);
  servoMotor.write(servoAngle);

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASSWORD);

  server.on("/", HTTP_GET, []() { server.send_P(200, "text/html", PAGE); });
  server.on("/servo", HTTP_GET, handleServo);
  server.onNotFound([]() { server.send(404, "text/plain", "Not found"); });
  server.begin();

  Serial.println("SoftAP ready");
  Serial.print("Wi-Fi: ");
  Serial.println(AP_SSID);
  Serial.print("Open: http://");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  server.handleClient();
  delay(2);
}
