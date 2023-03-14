const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log(`ESP32 IP: ${process.env.ESP32_IP}`);
console.log(`ESP32 Port: ${process.env.ESP32_PORT}`);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const esp32Ip = process.env.ESP32_IP;
const esp32Port = process.env.ESP32_PORT;

// 创建 API 路由
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 设置各轴的角度
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

// 获取各轴的角度
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

// 重置机械手臂
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

// 启动 Express 服务器
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
