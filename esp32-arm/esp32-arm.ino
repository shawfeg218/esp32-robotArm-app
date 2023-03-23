#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <WiFiManager.h>
#include <HTTPClient.h>

WebServer server(80);

WiFiManager wifiManager;

const char* serverURL = "http://192.168.0.10:5000";

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

void updateEsp32Ip();
void handleResetWifi();
void correctAct();
void wrongAct();
void grabAct();
void resetArm();
void handleSetAxisAngle();
void handleCorrectAct();
void handleWrongAct();
void handleGrabAct();
void handleResetArm();
void handleGetAngles();

void setup() {
  Serial.begin(115200); 

  // 嘗試連接到已知的 WiFi 網絡，如果無法連接，開啟熱點
  setupWifiManager();

  server.begin(); 
  Serial.println("Web server started");

  // 向網頁server更新Esp32Ip
  updateEsp32Ip();

  attachServos();
  initializedAngles();
  Serial.println("Servos attached and initialized");

  server.on("/api/reset-wifi", HTTP_POST, handleResetWifi);
  server.on("/api/set-axis-angle", HTTP_POST, handleSetAxisAngle);
  server.on("/api/correct-act", HTTP_POST, handleCorrectAct);
  server.on("/api/wrong-act", HTTP_POST, handleWrongAct);
  server.on("/api/grab-act", HTTP_POST, handleGrabAct);
  server.on("/api/reset-arm", HTTP_POST, handleResetArm);
  server.on("/api/get-angles", HTTP_GET, handleGetAngles);
}

void loop() {
  server.handleClient();
  delay(10);
}

void setupWifiManager() {
  wifiManager.setConfigPortalTimeout(20);

  if (!wifiManager.autoConnect("ESP32_AP", "")) {
    Serial.println("無法連接到WiFi，請重新設置");
    ESP.restart();
  } else {
    updateEsp32Ip();
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

void updateEsp32Ip() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverURL) + "/api/update-esp32-ip";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String requestBody = "{\"ip\":\"" + WiFi.localIP().toString() + "\"}";

    int httpResponseCode = http.POST(requestBody);
    String responseMessage = http.getString();

    if (httpResponseCode == 200) {
      Serial.println(responseMessage);
    } else {
      Serial.println(responseMessage);
    }

    http.end();
  } else {
    Serial.println("Not connected to WiFi");
  }
}

void correctAct() {
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
  angleF = init_angleF;
  servoF.write(angleF);
  delay(500);

  angleF = init_angleF - 18;
  servoF.write(angleF);
  delay(500);
}

void resetArm() {
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

void handleSetAxisAngle() {
  String targetAxis = server.arg("axis");
  int targetAngle  = server.arg("angle").toInt();

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
  server.send(204);
}

void handleCorrectAct() {
  correctAct();
  server.send(204);

  Serial.println("correct-action");
}

void handleWrongAct() {
  wrongAct();
  server.send(204);

  Serial.println("wrong-action");
}

void handleGrabAct() {
  grabAct();
  server.send(204);

  Serial.println("grab-action");
}

void handleResetArm() {
  resetArm();
  server.send(204);

  Serial.println("Servos reseted");
}

void handleGetAngles() {
  String angles = "{\"A\": " + String(angleA) + ", \"B\": " + String(angleB) + ", \"C\": " + String(angleC) + ", \"D\": " + String(angleD) + ", \"E\": " + String(angleE) + ", \"F\": " + String(angleF) + "}";
  server.send(200, "application/json", angles);
}
