const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

console.log(`ESP32 IP: ${process.env.ESP32_IP}`);
console.log(`ESP32 Port: ${process.env.ESP32_PORT}`);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const esp32Ip = process.env.ESP32_IP;
const esp32Port = process.env.ESP32_PORT;

// 創建 API 路由
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 設置某軸的角度
app.post('/api/set-axis-angle', (req, res) => {
  const { axis, angle } = req.body;
  axios
    .post(
      `http://${esp32Ip}:${esp32Port}/set-axis-angle?axis=${axis}&angle=${angle}`
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to set angle' });
    });
});

// 獲取esp32端當前角度
app.get('/api/get-angles', (req, res) => {
  axios
    .get(`http://${esp32Ip}:${esp32Port}/get-angles`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .send({ error: 'Failed to get angles', message: error.message });
    });
});

// 將各角度還原為預設值
app.post('/api/reset-arm', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/reset-arm`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to reset arm' });
    });
});

// 啟動 Express Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
