#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"

extern "C" {
  uint8_t temprature_sens_read();
}

WebServer server(80);

WiFiManager wifiManager;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

Servo servoA, servoB, servoC, servoD, servoE, servoF, servoG, servoH;

const String baseTopic = "esp32/" + WiFi.macAddress();
const String teacherTopic = "esp32/Teacher";

const int init_angleA = 90;
const int init_angleB = 90;
const int init_angleC = 75;
const int init_angleD = 145;
const int init_angleE = 160;
const int init_angleF = 90;
const int init_angleG = 75;
const int init_angleH = 90;

const int buttonPin = 18;
int prevBtnState = HIGH;

int angleA;
int angleB;
int angleC;
int angleD;
int angleE;
int angleF;
int angleG;
int angleH;

void handleResetWifi();
void handleResetWifiWrapper();
void handleCheckButton();
void handleRoot();
void correctAct();
void grabAct();
void resetArm();
void handleSetAxisAngle(String message);
void handleGetAngles();
void handleGetEsp32Status();
void speakingAct();

void setup() {
  Serial.begin(115200);

  attachServos();
  initializedAngles();
  Serial.println("Servos attached and initialized");

  pinMode(buttonPin, INPUT_PULLUP);

  setupWifiManager();

  server.on("/", handleRoot);
  server.on("/resetWifi", handleResetWifiWrapper);
  server.begin();
  Serial.println("Web server started");


  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
  reconnectMqtt();
}

void loop() {

  handleCheckButton();

  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();
  server.handleClient();
  delay(10);
}

void handleCheckButton() {
  // 检查按鈕状态
  int currentBtnState = digitalRead(buttonPin);
  if (currentBtnState == LOW && prevBtnState == HIGH) {
    handleResetWifi();
  }

  prevBtnState = currentBtnState;
}

void handleRoot() {
  String html = R"(
    <html>
    <body>
    <h1>Hello, world!</h1>
    <p>MAC Address: )"
                + WiFi.macAddress() + R"(</p>
    <button id="resetButton">Reset Wi-Fi</button>
    <script>
    document.getElementById('resetButton').addEventListener('click', function() {
      fetch('/resetWifi');
    });
    </script>
    </body>
    </html>
  )";
  server.send(200, "text/html", html);
}

void handleResetWifiWrapper() {
  handleResetWifi();
  server.send(200, "text/plain", "Wi-Fi reset");
}

void setupWifiManager() {
  wifiManager.setConfigPortalTimeout(180);

  if (!wifiManager.autoConnect(("ESP32_AP_" + WiFi.macAddress()).c_str(), "")) {
    Serial.println("無法連接到WiFi，請重新設置");
    ESP.restart();
  }

  Serial.println("Connected to WiFi");
}

void handleResetWifi() {
  wifiManager.resetSettings();
  ESP.restart();
  server.send(204);

  Serial.println("Wi-Fi reset");
}

void attachServos() {
  // 左手
  
  servoA.attach(26);
  servoB.attach(27);
  servoC.attach(14);
  servoD.attach(12);

  // 右手
  servoE.attach(19);
  servoF.attach(17);
  servoG.attach(16);
  servoH.attach(33);
}

void initializedAngles() {
  servoA.write(init_angleA);
  servoB.write(init_angleB);
  servoC.write(init_angleC);
  servoD.write(init_angleD);
  servoE.write(init_angleE);
  servoF.write(init_angleF);
  servoG.write(init_angleG);
  servoH.write(init_angleH);
}

void reconnectMqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");

    String clientId = "ESP32Client_" + WiFi.macAddress();

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("connected");

      // subscribe to teacher topic
      mqttClient.subscribe((teacherTopic + "/control/set-axis-angle").c_str());
      mqttClient.subscribe((teacherTopic + "/control/correct-act").c_str());
      mqttClient.subscribe((teacherTopic + "/control/wrong-act").c_str());
      mqttClient.subscribe((teacherTopic + "/control/grab-act").c_str());
      mqttClient.subscribe((teacherTopic + "/control/reset-arm").c_str());
      mqttClient.subscribe((teacherTopic + "/control/speak-act").c_str());

      // subscribe to default topic
      mqttClient.subscribe((baseTopic + "/control/reset-wifi").c_str());
      mqttClient.subscribe((baseTopic + "/control/set-axis-angle").c_str());
      mqttClient.subscribe((baseTopic + "/control/correct-act").c_str());
      mqttClient.subscribe((baseTopic + "/control/wrong-act").c_str());
      mqttClient.subscribe((baseTopic + "/control/grab-act").c_str());
      mqttClient.subscribe((baseTopic + "/control/reset-arm").c_str());
      mqttClient.subscribe((baseTopic + "/control/get-angles").c_str());
      mqttClient.subscribe((baseTopic + "/control/get-esp32Status").c_str());
      mqttClient.subscribe((baseTopic + "/control/speak-act").c_str());
    } else {
      Serial.print("MQTT connection failed with state: ");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == (baseTopic + "/control/set-axis-angle") || String(topic) == (teacherTopic + "/control/set-axis-angle")) {
    Serial.println("topic: " + String(topic));
    handleSetAxisAngle(message);
  } else if (String(topic) == (baseTopic + "/control/correct-act") || String(topic) == (teacherTopic + "/control/correct-act")) {
    Serial.println("topic: " + String(topic));
    correctAct();
  } else if (String(topic) == (baseTopic + "/control/wrong-act") || String(topic) == (teacherTopic + "/control/wrong-act")) {
    Serial.println("topic: " + String(topic));
    wrongAct();
  } else if (String(topic) == (baseTopic + "/control/grab-act") || String(topic) == (teacherTopic + "/control/grab-act")) {
    Serial.println("topic: " + String(topic));
    grabAct();
  } else if (String(topic) == (baseTopic + "/control/reset-arm") || String(topic) == (teacherTopic + "/control/reset-arm")) {
    Serial.println("topic: " + String(topic));
    resetArm();
  } else if (String(topic) == (baseTopic + "/control/speak-act") || String(topic) == (teacherTopic + "/control/speak-act")) {
    Serial.println("topic: " + String(topic));
    speakingAct();
  } else if (String(topic) == (baseTopic + "/control/reset-wifi")) {
    Serial.println("topic: " + String(topic));
    handleResetWifi();
  } else if (String(topic) == (baseTopic + "/control/get-angles")) {
    handleGetAngles();
  } else if (String(topic) == (baseTopic + "/control/get-esp32Status")) {
    handleGetEsp32Status();
  }
}

void correctAct() {
  Serial.println("correct-action");
  for (int i = 0; i < 4; i++) {
    servoE.write(128);
    servoF.write(90);
    servoG.write(0);
    servoH.write(90);

    servoA.write(9);
    servoB.write(56);
    servoC.write(90);
    servoD.write(145);
    delay(900);

    servoG.write(90);
    servoC.write(153);
    delay(800);
  }
  initializedAngles();
}

void wrongAct() {
  Serial.println("wrong-action");
  for (int i = 0; i < 3; i++) {
    servoE.write(100);
    servoF.write(116);
    servoG.write(50);
    servoH.write(90);

    servoA.write(47);
    servoB.write(50);
    servoC.write(120);
    servoD.write(140);
    delay(1000);

    // 右手
    servoG.write(112);
    servoF.write(60);

    // 左手
    servoC.write(48);
    servoB.write(70);
    delay(1000);
  }
  initializedAngles();
}

void grabAct() {
  Serial.println("grab-action");

  servoG.write(110);
  servoF.write(150);
  delay(500);
  for (int i = 0; i < 3; i++) {
    servoE.write(random(50, 120));
  }
  delay(1000);
  initializedAngles();
}

void speakingAct() {

  servoE.write(128);
  servoF.write(90);
  servoG.write(50);
  servoH.write(90);

  servoA.write(9);
  servoB.write(56);
  servoC.write(30);  // 150
  servoD.write(145);
  delay(100);

  int R = random(5);
  if (R == 0) {
    // 右手
    Serial.println("speaking-action1");
    servoG.write(110);
    delay(500);
  }

  // 左手
  else if (R == 1) {
    Serial.println("speaking-action2");
    servoC.write(80);
    delay(500);
  }

  else if (R == 2) {
    // 右手2
    Serial.println("speaking-action3");
    servoF.write(48);
    servoG.write(120);
    servoH.write(120);
    delay(500);
  }
  // 左手2
  else if (R == 3) {
    Serial.println("speaking-action4");
    servoB.write(88);
    servoC.write(80);
    servoD.write(150);
    delay(500);
  }

  else if (R == 4) {
    Serial.println("speaking-action5");
    servoG.write(70);
    servoH.write(110);
    delay(500);
  }
}

void resetArm() {
  Serial.println("Servos reseted");
  angleA = init_angleA;
  angleB = init_angleB;
  angleC = init_angleC;
  angleD = init_angleD;
  angleE = init_angleE;
  angleF = init_angleF;

  servoA.write(angleA);
  servoB.write(angleB);
  servoC.write(angleC);
  servoD.write(angleD);
  servoE.write(angleE);
  servoF.write(angleF);
}

void handleSetAxisAngle(String message) {
  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, message);

  if (angleA != jsonDoc["A"]) {
    angleA = jsonDoc["A"];
    servoA.write(angleA);
  }
  if (angleB != jsonDoc["B"]) {
    angleB = jsonDoc["B"];
    servoB.write(angleB);
  }
  if (angleC != jsonDoc["C"]) {
    angleC = jsonDoc["C"];
    servoC.write(angleC);
  }
  if (angleD != jsonDoc["D"]) {
    angleD = jsonDoc["D"];
    servoD.write(angleD);
  }
  if (angleE != jsonDoc["E"]) {
    angleE = jsonDoc["E"];
    servoE.write(angleE);
  }
  if (angleF != jsonDoc["F"]) {
    angleF = jsonDoc["F"];
    servoF.write(angleF);
  }
  if (angleG != jsonDoc["G"]) {
    angleG = jsonDoc["G"];
    servoG.write(angleG);
  }
  if (angleH != jsonDoc["H"]) {
    angleH = jsonDoc["H"];
    servoH.write(angleH);
  }

  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + ", \"G\": " + String(angleG) + ", \"H\": " + String(angleH) + "}";
  Serial.println(angles);
}

void handleGetAngles() {
  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + ", \"G\": " + String(angleG) + ", \"H\": " + String(angleH) + "}";
  mqttClient.publish((baseTopic + "/angles").c_str(), angles.c_str());
}

void handleGetEsp32Status() {

  DynamicJsonDocument doc(1024);

  doc["uptime"] = millis();
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["macAddress"] = WiFi.macAddress();
  doc["chipRevision"] = ESP.getChipRevision();
  doc["cpuFrequency"] = ESP.getCpuFreqMHz();
  doc["flashSize"] = ESP.getFlashChipSize();
  doc["temperature"] = (temprature_sens_read() - 32) * 0.5554;
  doc["hallEffect"] = hallRead();
  doc["ssid"] = WiFi.SSID();
  doc["localIP"] = WiFi.localIP().toString();
  doc["rssi"] = WiFi.RSSI();

  String esp32Status;
  serializeJson(doc, esp32Status);
  // Serial.println(esp32Status);
  mqttClient.publish((baseTopic + "/esp32Status").c_str(), (esp32Status.c_str()));
}
