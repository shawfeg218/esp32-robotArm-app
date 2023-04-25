#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h"

extern "C"
{
    uint8_t temprature_sens_read();
}


WebServer server(80);

WiFiManager wifiManager;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

Servo servoA, servoB, servoC, servoD, servoE, servoF; 

const int init_angleA = 0; 
const int init_angleB = 0; 
const int init_angleC = 180; 
const int init_angleD = 0; 
const int init_angleE = 180; 
const int init_angleF = 18; 

int angleA;
int angleB;
int angleC;
int angleD;
int angleE;
int angleF;

void handleResetWifi();
void correctAct();
void wrongAct();
void grabAct();
void resetArm();
void handleSetAxisAngle();
void handleGetAngles();
void handleGetEsp32Status();
void heartbeat();

void setup() {
  Serial.begin(115200); 

  // 嘗試連接到已知的 WiFi 網絡，如果無法連接，開啟熱點
  setupWifiManager();

  server.begin(); 
  Serial.println("Web server started");

  attachServos();
  initializedAngles();
  Serial.println("Servos attached and initialized");

  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
  reconnectMqtt();

}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();
  server.handleClient();
  delay(10);
}

void setupWifiManager() {
  wifiManager.setConfigPortalTimeout(180);

  if (!wifiManager.autoConnect("ESP32_AP", "")) {
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
  servoA.attach(17);
  servoB.attach(18);
  servoC.attach(26);
  servoD.attach(25);
  servoE.attach(33);
  servoF.attach(32);
}

void initializedAngles() {
  servoA.write(init_angleA);
  servoB.write(init_angleB);
  servoC.write(init_angleC);
  servoD.write(init_angleD);
  servoE.write(init_angleE);
  servoF.write(init_angleF);
}

void reconnectMqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("ESP32Client")) {
      Serial.println("connected");
      mqttClient.subscribe("esp32/control/reset-wifi");
      mqttClient.subscribe("esp32/control/set-axis-angle");
      mqttClient.subscribe("esp32/control/correct-act");
      mqttClient.subscribe("esp32/control/wrong-act");
      mqttClient.subscribe("esp32/control/grab-act");
      mqttClient.subscribe("esp32/control/reset-arm");
      mqttClient.subscribe("esp32/control/get-angles");
      mqttClient.subscribe("esp32/control/get-esp32Status");
      mqttClient.subscribe("esp32/control/get-heartbeat");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }  
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for(unsigned int i=0; i<length; i++) {
    message += (char)payload[i];
  }

  if(String(topic) == "esp32/control/reset-wifi") {
    Serial.println("topic: esp32/control/reset-wifi");
    handleResetWifi();
  } else if(String(topic) == "esp32/control/set-axis-angle") {
    Serial.println("topic: esp32/control/set-axis-angle");
    handleSetAxisAngle(message);
  } else if(String(topic) == "esp32/control/correct-act") {
    Serial.println("topic: esp32/control/correct-act");
    correctAct();
  } else if(String(topic) == "esp32/control/wrong-act") {
    Serial.println("topic: esp32/control/wrong-act");
    wrongAct();
  } else if(String(topic) == "esp32/control/grab-act") {
    Serial.println("topic: esp32/control/grab-act");
    grabAct();
  } else if(String(topic) == "esp32/control/reset-arm") {
    Serial.println("topic: esp32/control/reset-arm");
    resetArm();
  } else if(String(topic) == "esp32/control/get-angles") {
    handleGetAngles();
  } else if(String(topic) == "esp32/control/get-esp32Status") {
    handleGetEsp32Status();    
  } else if(String(topic) == "esp32/control/get-heartbeat") {
    heartbeat();
  }


}

void correctAct() {
  Serial.println("correct-action");
  for (int i = 0; i < 3; i++) {
    angleD = init_angleD;
    servoD.write(angleD);
    delay(10);
    angleD = init_angleD + 40;
    servoD.write(angleD);
    delay(200);

    angleD = init_angleD;
    servoD.write(angleD);
    delay(200);
  }
}

void wrongAct() {
  Serial.println("wrong-action");
  for (int i = 0; i < 3; i++) {
    angleA = init_angleA;
    servoA.write(angleA);
    delay(10);

    angleA = init_angleA + 40;
    servoA.write(angleA);
    delay(200);

    angleA = init_angleA;
    servoA.write(angleA);
    delay(200);
  }
}

void grabAct() {
  Serial.println("grab-action");
  angleF = init_angleF;
  servoF.write(angleF);
  delay(500);

  angleF = init_angleF - 18;
  servoF.write(angleF);
  delay(500);
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

  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + "}"; 
  Serial.println(angles);
}


void handleGetAngles() {
  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + "}";
  mqttClient.publish("esp32/angles", angles.c_str());
}

void heartbeat(){
  mqttClient.publish("esp32/heartbeat", "");
}

void handleGetEsp32Status() {
  String esp32Status = "{";
  esp32Status += "\"uptime\": " + String(millis()) + ",";
  esp32Status += "\"freeHeap\": " + String(ESP.getFreeHeap()) + ",";
  esp32Status += "\"macAddress\": \"" + WiFi.macAddress() + "\",";
  esp32Status += "\"chipRevision\": " + String(ESP.getChipRevision()) + ",";
  esp32Status += "\"cpuFrequency\": " + String(ESP.getCpuFreqMHz()) + ",";
  esp32Status += "\"flashSize\": " + String(ESP.getFlashChipSize()) + ",";
  esp32Status += "\"temperature\": " + String((temprature_sens_read() - 32) * 0.5554) + ",";
  esp32Status += "\"hallEffect\": " + String(hallRead()) + ",";
  esp32Status += "\"ssid\": \"" + WiFi.SSID() + "\",";
  esp32Status += "\"localIP\": \"" + WiFi.localIP().toString() + "\",";
  esp32Status += "\"rssi\": " + String(WiFi.RSSI());
  esp32Status += "}";

  Serial.println(esp32Status);
  mqttClient.publish("esp32/esp32Status", esp32Status.c_str());
}
