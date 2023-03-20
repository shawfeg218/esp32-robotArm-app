#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const char* ssid = "Shawn"; // WiFi熱點名稱
const char* password = "zxcvbnm0000"; // WiFi密碼
WebServer server(80); // 創建Web Server

Servo servoA, servoB, servoC, servoD, servoE, servoF; 

// 初始角度
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

// correct-act
void correctAct() {
  for(int i=0; i<3; i++) {
    angleD = init_angleD;
    servoD.write(angleD);
    delay(10);
    angleD = 65;
    servoD.write(angleD);
    delay(10);
  }
  angleD = init_angleD;
  servoD.write(angleD);
}  

// wrong-act
void wrongAct() {
  angleD = 24;
  servoD.write(angleD);
  delay(10);    
  angleF = 18;
  servoF.write(angleF);
  delay(10);    
  for(int i=0; i<2; i++) {
    angleF = 64;
    servoF.write(angleF);
    delay(10);    
    angleF = 18;
    servoF.write(angleF);
    delay(10);    
  }
  angleD = 0;
  servoD.write(angleD);
}

// grab-act
void grabAct() {
  angleD = 59;
  servoD.write(angleD);
  delay(10);
  angleE = 112;
  servoE.write(angleE);
  delay(10);
    
  angleC = init_angleC;
  servoC.write(angleC);
  delay(10);
  angleC = 108;
  servoC.write(angleC);

  angleB = init_angleB;
  servoB.write(angleB);
  delay(10);
  angleB = 59;
  servoB.write(angleB);
  delay(10);
  angleB = init_angleB;
  servoB.write(angleB);

  angleC = init_angleC;
  servoC.write(angleC);


  angleE = init_angleE;
  servoE.write(angleE);
  angleD = init_angleD;
  servoD.write(angleD);  
}

void setup() {
  Serial.begin(115200); 
    
  WiFi.begin(ssid, password); // 連接WiFi
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");


  server.begin(); // 啟動Web Server
  Serial.println("Web server started");

  // 為每個servo分配控制板上的GPIO引腳號
  servoA.attach(17);
  servoB.attach(18);
  servoC.attach(26);
  servoD.attach(25);
  servoE.attach(33);
  servoF.attach(32);

  // 將每個servo移動到初始角度
  servoA.write(init_angleA);
  servoB.write(init_angleB);
  servoC.write(init_angleC);
  servoD.write(init_angleD);
  servoE.write(init_angleE);
  servoF.write(init_angleF);
  Serial.println("Servos attached and initialized");
  
  // 處理/api/set-axis-angle路由的POST請求
  server.on("/api/set-axis-angle", HTTP_POST, []() {
    
    String targetAxis = server.arg("axis"); // 獲取軸的編號
    int targetAngle = server.arg("angle").toInt(); // 獲取目標角度
    
    if (targetAxis == "A") { 
      angleA = targetAngle; 
      servoA.write(angleA); 
    } else if (targetAxis == "B") { 
      angleB = targetAngle; 
      servoB.write(angleB); 
    } else if (targetAxis == "C") { 
      angleC = targetAngle; 
      servoC.write(angleC); 
    } else if (targetAxis == "D") { 
      angleD = targetAngle;
      servoD.write(angleD);
    } else if (targetAxis == "E") { 
      angleE = targetAngle; 
      servoE.write(angleE); 
    } else if (targetAxis == "F") { 
      angleF = targetAngle; 
      servoF.write(angleF); 
    }
    server.send(200); // 發送回應碼200，表示請求已成功處理

    Serial.println("servo" + targetAxis + " move to " + targetAngle);
  });

  // 處理/api/correct-act路由的POST請求
  server.on("/api/correct-act", HTTP_POST, []() {
    //correctAct
    correctAct();
    // for(int i=0; i<3; i++) {
    //   angleD = init_angleD;
    //   servoD.write(angleD);
    //   delay(10);
    //   angleD = 65;
    //   servoD.write(angleD);
    //   delay(10);
    // }
    // angleD = init_angleD;
    // servoD.write(angleD);

    server.send(200);

    Serial.println("correct-action");
  });

  // 處理/api/wrong-act路由的POST請求
  server.on("/api/wrong-act", HTTP_POST, []() {
    // wrongAct
    wrongAct();
    // angleD = 24;
    // servoD.write(angleD);
    // delay(10);    
    // angleF = 18;
    // servoF.write(angleF);
    // delay(10);    
    // for(int i=0; i<2; i++) {
    //   angleF = 64;
    //   servoF.write(angleF);
    //   delay(10);    
    //   angleF = 18;
    //   servoF.write(angleF);
    //   delay(10);    
    // }
    // angleD = 0;
    // servoD.write(angleD);

    server.send(200); // 發送回應碼200，表示請求已成功處理

    Serial.println("wrong-action");
  });

  // 處理/api/grab-act路由的POST請求
  server.on("/api/grab-act", HTTP_POST, []() {
    // grabAct
    grabAct();
    // angleD = 59;
    // servoD.write(angleD);
    // delay(10);
    // angleE = 112;
    // servoE.write(angleE);
    // delay(10);
    
    // angleC = init_angleC;
    // servoC.write(angleC);
    // delay(10);
    // angleC = 108;
    // servoC.write(angleC);

    // angleB = init_angleB;
    // servoB.write(angleB);
    // delay(10);
    // angleB = 59;
    // servoB.write(angleB);
    // delay(10);
    // angleB = init_angleB;
    // servoB.write(angleB);

    // angleC = init_angleC;
    // servoC.write(angleC);


    // angleE = init_angleE;
    // servoE.write(angleE);
    // angleD = init_angleD;
    // servoD.write(angleD);

    server.send(200); // 發送回應碼200，表示請求已成功處理

    Serial.println("grab-action");
  });

  // 處理/api/reset-arm路由的POST請求
  server.on("/api/reset-arm", HTTP_POST, []() {

    angleA = init_angleA;   // 將各角度還原為預設值
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
    
    server.send(200);
    
    Serial.println("Servos reseted");
  });

  // 處理/get-angles路由的GET請求
  server.on("/api/get-angles", HTTP_GET, []() {
    String response = "{\"A\":" + String(angleA) +
                      ",\"B\":" + String(angleB) +
                      ",\"C\":" + String(angleC) +
                      ",\"D\":" + String(angleD) +
                      ",\"E\":" + String(angleE) +
                      ",\"F\":" + String(angleF) + "}";
    server.send(200, "application/json", response); // 發送包含角度信息的JSON response
  });


}

void loop() {
  // server.handleClient();
  correctAct();
  delay(10); 
  wrongAct();
  delay(10); 
  grabAct();
  delay(10);
}
