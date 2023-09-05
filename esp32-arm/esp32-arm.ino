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

unsigned long prevMillisWifiFail = 0;
unsigned long prevMillisMqttReconnect = 0;
unsigned long buttonPressTimestamp = 0;
int onWifiFailedServoStep = 0;
int onMqttFailedServoStep = 0;

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

void attachServos();
void initializedAngles();
void onAPOpen(WiFiManager *wifiManagerInstance);
void onWifiFail();
void onMqttFailServoAct();
void wifiSetConSucc();
void setupWifiManager();
void handleRoot();
void handleResetWifiWrapper();
void mqttCallback(char *topic, byte *payload, unsigned int length);
void reconnectMqtt();

void handleResetWifi();
void handleCheckButton();
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
}

void loop() {

  handleCheckButton();

  if (WiFi.status() == WL_CONNECTED) {

    if (!mqttClient.connected()) {
      reconnectMqtt();
    }
    mqttClient.loop();
    server.handleClient();

  } else {
    wifiManager.process();
    onWifiFail();
  }

  delay(10);
}


void handleCheckButton() {
    int currentBtnState = digitalRead(buttonPin);
    
    if (currentBtnState == LOW && prevBtnState == HIGH) {
        // 当按键按下时, 记录时间戳
        buttonPressTimestamp = millis();
    } 
    else if (currentBtnState == LOW && (millis() - buttonPressTimestamp) >= 2000) {
        // 如果按键持续按下并且达到了预设的时长，触发事件并重置时间戳
        handleResetWifi();
        buttonPressTimestamp = millis();  // 重置时间戳防止多次触发
    } 
    else if (currentBtnState == HIGH) {
        // 如果按键被释放，重置时间戳
        buttonPressTimestamp = 0;
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
  wifiManager.setAPCallback(onAPOpen);
  wifiManager.setConfigPortalBlocking(false);

  // wifi connect success after user changed wifi setting
  wifiManager.setSaveConfigCallback(wifiSetConSucc);

  bool res = wifiManager.autoConnect(("ESP32_AP_" + WiFi.macAddress()).c_str(), "");
  // wifi connect success in setup()
  if (res == true) {
    wifiSetConSucc();
  }
}

void wifiSetConSucc() {
  Serial.println("ESP32 connected to SSID: " + WiFi.SSID());

  server.on("/", handleRoot);
  server.on("/resetWifi", handleResetWifiWrapper);
  server.begin();
  Serial.println("Web server started on " + WiFi.localIP());

  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
  reconnectMqtt();
}

void onAPOpen(WiFiManager *wifiManagerInstance) {
  String portalSSID = wifiManagerInstance->getConfigPortalSSID();
  Serial.println("ESP32 has opened an Access Point with SSID: " + portalSSID);
  Serial.println("ServoA move on wifi connect failed...");
}

void onWifiFail() {
  unsigned long currentMillis = millis();
  if (currentMillis - prevMillisWifiFail >= 2000) {
    prevMillisWifiFail = currentMillis;

    bool res = wifiManager.autoConnect();
    if (res == true) {
      wifiManager.stopWebPortal();
      wifiSetConSucc();
    }

    switch (onWifiFailedServoStep) {
      case 0:
        angleA = 90;
        servoA.write(angleA);
        onWifiFailedServoStep++;
        Serial.println("WiFi Failed Servo step 1");
        break;
      case 1:
        angleA = 0;
        servoA.write(angleA);
        onWifiFailedServoStep = 0;
        Serial.println("WiFi Failed Servo step 2");
        break;
    }
  }
}

void onMqttFailServoAct() {
  switch (onMqttFailedServoStep) {
    case 0:
      angleE = 160;
      servoE.write(angleE);
      onMqttFailedServoStep++;
      Serial.println("MQTT Failed Servo step 1");
      break;
    case 1:
      angleE = 50;
      servoE.write(angleE);
      onMqttFailedServoStep = 0;
      Serial.println("MQTT Failed Servo step 2");
      break;
  }
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
  unsigned long currentMillis = millis();
  if (currentMillis - prevMillisMqttReconnect >= 5000 && WiFi.status() == WL_CONNECTED) {
    prevMillisMqttReconnect = currentMillis;

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
      Serial.println("connection failed, try again in 5 seconds");
      onMqttFailServoAct();
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
    angleE = 128;
    servoE.write(angleE);

    angleF = 90;
    servoF.write(angleF);

    angleG = 0;
    servoG.write(angleG);

    angleH = 90;
    servoH.write(angleH);

    angleA = 9;
    servoA.write(angleA);

    angleB = 56;
    servoB.write(angleB);

    angleC = 90;
    servoC.write(angleC);

    angleD = 145;
    servoD.write(angleD);

    delay(900);

    angleG = 90;
    servoG.write(angleG);

    angleC = 153;
    servoC.write(angleC);

    delay(800);
  }
  initializedAngles();
}

void wrongAct() {
  Serial.println("wrong-action");
  for (int i = 0; i < 3; i++) {

    angleE = 100;
    servoE.write(angleE);

    angleF = 116;
    servoF.write(angleF);

    angleG = 50;
    servoG.write(angleG);

    angleH = 90;
    servoH.write(angleH);

    angleA = 47;
    servoA.write(angleA);

    angleB = 50;
    servoB.write(angleB);

    angleC = 120;
    servoC.write(angleC);

    angleD = 140;
    servoD.write(angleD);

    delay(1000);

    // 右手
    angleG = 112;
    servoG.write(angleG);

    angleF = 60;
    servoF.write(angleF);

    // 左手
    angleC = 48;
    servoC.write(angleC);

    angleB = 70;
    servoB.write(angleB);

    delay(1000);
  }
  initializedAngles();
}

void grabAct() {
  Serial.println("grab-action");

  angleG = 50;
  servoG.write(angleG);

  angleF = 30;
  servoF.write(angleF);
  delay(500);

  for (int i = 0; i < 3; i++) {
    angleE = random(50, 120);
    servoE.write(angleE);
    delay(300);
  }
  delay(1000);

  initializedAngles();
}

void speakingAct() {
  angleE = 128;
  servoE.write(angleE);

  angleF = 90;
  servoF.write(angleF);

  angleG = 50;
  servoG.write(angleG);

  angleH = 90;
  servoH.write(angleH);

  angleA = 9;
  servoA.write(angleA);

  angleB = 56;
  servoB.write(angleB);

  angleC = 30;
  servoC.write(angleC);

  angleD = 145;
  servoD.write(angleD);
  delay(100);

  int R = random(5);
  if (R == 0) {
    // 右手
    Serial.println("speaking-action1");
    angleG = 110;
    servoG.write(angleG);
    delay(500);
  }

  // 左手
  else if (R == 1) {
    Serial.println("speaking-action2");
    angleC = 80;
    servoC.write(angleC);
    delay(500);
  }

  else if (R == 2) {
    // 右手2
    Serial.println("speaking-action3");
    angleF = 48;
    servoF.write(angleF);

    angleG = 120;
    servoG.write(angleG);

    angleH = 120;
    servoH.write(angleH);
    delay(500);
  }
  // 左手2
  else if (R == 3) {
    Serial.println("speaking-action4");
    angleB = 88;
    servoB.write(angleB);

    angleC = 80;
    servoC.write(angleC);

    angleD = 150;
    servoD.write(angleD);
    delay(500);
  }

  else if (R == 4) {
    Serial.println("speaking-action5");
    angleG = 70;
    servoG.write(angleG);

    angleH = 110;
    servoH.write(angleH);
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