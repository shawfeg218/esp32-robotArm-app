#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

const char* ssid = "108-3-1"; // WiFi熱點名稱
const char* password = "0987352372"; // WiFi密碼
WebServer server(80); // 創建Web Server

Servo servoA, servoB, servoC, servoD, servoE, servoF; 

// 初始化角度
int angleA = 0; 
int angleB = 0; 
int angleC = 0; 
int angleD = 0; 
int angleE = 0; 
int angleF = 0; 

void setup() {
  Serial.begin(115200); // 开启串口调试
  WiFi.begin(ssid, password); // 连接WiFi
  while (WiFi.status() != WL_CONNECTED) { // 等待连接
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // 处理/set-axis-angle路由的POST请求
  server.on("/set-axis-angle", HTTP_POST, []() {
    String axis = server.arg("axis"); // 获取轴的编号
    int angle = server.arg("angle").toInt(); // 获取目标角度
    if (axis == "A") { // 如果是A轴
      angleA = angle; // 更新A轴的角度
      servoA.write(angleA); // 将A轴的舵机转动到目标角度
    } else if (axis == "B") { // 如果是B轴
      angleB = angle; // 更新B轴的角度
      servoB.write(angleB); // 将B轴的舵机转动到目标角度
    } else if (axis == "C") { // 如果是C轴
      angleC = angle; // 更新C轴的角度
      servoC.write(angleC); // 将C轴的舵机转动到目标角度
    } else if (axis == "D") { // 如果是D轴
      angleD = angle; // 更新D轴的角度
      servoD.write(angleD); // 将D轴的舵机转动到目标角度
    } else if (axis == "E") { // 如果是E轴
      angleE = angle; // 更新E轴的角度
      servoE.write(angleE); // 将E轴的舵机转动到目标角度
    } else if (axis == "F") { // 如果是F轴
      angleF = angle; // 更新F轴的角度
      servoF.write(angleF); // 将F轴的舵机转动到目标角度
    }
    server.send(200); // 发送响应码200，表示请求已被成功处理
  });

  // 處理/reset-arm路由的POST請求
  server.on("/reset-arm", HTTP_POST, []() {

    angleA = angleB = angleC = angleD =  angleE = angleF = 0;

    servoA.write(angleA);
    servoB.write(angleB);
    servoC.write(angleC);
    servoD.write(angleD);
    servoE.write(angleE);
    servoF.write(angleF);
    
    server.send(200);
    Serial.println("Servos reseted");
  });

  // 处理/get-angles路由的GET请求
  server.on("/get-angles", HTTP_GET, []() {
    String response = "{\"A\":" + String(angleA) +
                      ",\"B\":" + String(angleB) +
                      ",\"C\":" + String(angleC) +
                      ",\"D\":" + String(angleD) +
                      ",\"E\":" + String(angleE) +
                      ",\"F\":" + String(angleF) + "}";
    server.send(200, "application/json", response); // 发送包含角度信息的JSON响应
  });

  server.begin(); // 启动Web服务器
  Serial.println("Web server started");

  // 为每个舵机对象分配控制板上的GPIO引脚号
  servoA.attach(32);
  servoB.attach(33);
  servoC.attach(25);
  servoD.attach(26);
  servoE.attach(27);
  servoF.attach(14);

  // 将六个舵机初始化为0度
  servoA.write(angleA);
  servoB.write(angleB);
  servoC.write(angleC);
  servoD.write(angleD);
  servoE.write(angleE);
  servoF.write(angleF);

  Serial.println("Servos attached and initialized");
}

void loop() {
  server.handleClient(); // 处理客户端请求
  delay(10); // 延迟10毫秒，避免过多的CPU占用
}
