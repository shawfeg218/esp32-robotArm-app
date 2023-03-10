const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const esp32Ip = process.env.ESP32_IP;
const esp32Port = process.env.ESP32_PORT;

// 設置個軸的角度
app.post('/set-axis-angle', (req, res) => {
  const { axis, angle } = req.body;
  axios
    .get(
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

// 獲取個軸的角度
app.get('/get-angles', (req, res) => {
  axios
    .get(`http://${esp32Ip}:${esp32Port}/get-angles`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to get angles' });
    });
});

// 重置機械手臂
app.post('/reset-arm', (req, res) => {
  axios
    .get(`http://${esp32Ip}:${esp32Port}/reset-arm`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to reset arm' });
    });
});

// 啟動 Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
