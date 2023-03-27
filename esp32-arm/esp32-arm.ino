#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

WebServer server(80);

WiFiManager wifiManager;

const char* mqtt_server = "0.tcp.jp.ngrok.io";
const int mqtt_port = 17096;

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
  String targetAxis = jsonDoc["axis"];
  int targetAngle  = jsonDoc["angle"];

  if (targetAxis == "A") {
    angleA = targetAngle ;
    servoA.write(angleA);
  } else if (targetAxis == "B") {
    angleB = targetAngle ;
    servoB.write(angleB);
  } else if (targetAxis == "C") {
    angleC = targetAngle ;
    servoC.write(angleC);
  } else if (targetAxis == "D") {
    angleD = targetAngle ;
    servoD.write(angleD);
  } else if (targetAxis == "E") {
    angleE = targetAngle ;
    servoE.write(angleE);
  } else if (targetAxis == "F") {
    angleF = targetAngle ;
    servoF.write(angleF);
  } else {
    server.send(400);
    return;
  }

  Serial.println("servo" + targetAxis + " move to " + targetAngle);
}


void handleGetAngles() {
  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + "}";
  mqttClient.publish("esp32/angles", angles.c_str());
}
