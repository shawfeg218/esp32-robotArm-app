const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const mqtt = require('mqtt');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const mqttClient = mqtt.connect('mqtt://localhost:1883');

// 創建 API 路由
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 重設ESP32的WiFi
app.post('/api/reset-wifi', (req, res) => {
  mqttClient.publish('esp32/control/reset-wifi', '');
  res.status(204).send();
});

// 設置某軸的角度
app.post('/api/set-axis-angle', (req, res) => {
  const { axis, angle } = req.body;
  mqttClient.publish(
    'esp32/control/set-axis-angle',
    JSON.stringify({ axis, angle })
  );
  res.status(204).send();
});

// 答對動作
app.post('/api/correct-act', (req, res) => {
  mqttClient.publish('esp32/control/correct-act', '');
  res.status(204).send();
});

// 答錯動作
app.post('/api/wrong-act', (req, res) => {
  mqttClient.publish('esp32/control/wrong-act', '');
  res.status(204).send();
});

// 抓動作
app.post('/api/grab-act', (req, res) => {
  mqttClient.publish('esp32/control/grab-act', '');
  res.status(204).send();
});

// 將各角度還原為預設值
app.post('/api/reset-arm', (req, res) => {
  mqttClient.publish('esp32/control/reset-arm', '');
  res.status(204).send();
});

let currentAngles = {};

mqttClient.on('connect', () => {
  mqttClient.subscribe('esp32/angles');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'esp32/angles') {
    currentAngles = JSON.parse(message.toString());
  }
});

// 獲取esp32端當前角度
app.get('/api/get-angles', (req, res) => {
  mqttClient.publish('esp32/control/get-angles', '');
  res.status(200).send(currentAngles);
});

// 啟動 Express Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
