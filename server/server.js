const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const net = require('net');

dotenv.config();

console.log(`ESP32 IP: ${process.env.ESP32_IP}`);
console.log(`ESP32 Port: ${process.env.ESP32_PORT}`);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

let esp32Ip = process.env.ESP32_IP;
let esp32Port = process.env.ESP32_PORT;

// 創建 API 路由
const apiRouter = express.Router();
app.use('/api', apiRouter);

// server更新esp32Ip
app.post('/api/update-esp32-ip', (req, res) => {
  const newIp = req.body.ip;
  if (newIp && net.isIP(newIp)) {
    esp32Ip = newIp;
    console.log(`Updated ESP32 IP: ${esp32Ip}`);
    res.status(200).send({ message: 'ESP32 IP updated on server' });
  } else {
    res.status(400).send({ error: 'Invalid IP' });
  }
});

// 重設ESP32的WiFi
app.post('/api/reset-wifi', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/api/reset-wifi`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to reset Wi-Fi' });
    });
});

// 設置某軸的角度
app.post('/api/set-axis-angle', (req, res) => {
  const { axis, angle } = req.body;
  axios
    .post(
      `http://${esp32Ip}:${esp32Port}/api/set-axis-angle?axis=${axis}&angle=${angle}`
    )
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.status === 400) {
        res.status(400).send({ error: 'Invalid request' });
      } else {
        res.status(500).send({ error: 'Failed to set angle' });
      }
    });
});

// 答對動作
app.post('/api/correct-act', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/api/correct-act`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'correc-act Failed' });
    });
});

// 答錯動作
app.post('/api/wrong-act', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/api/wrong-act`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'wrong-act Failed' });
    });
});

// 抓動作
app.post('/api/grab-act', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/api/grab-act`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'grab-act Failed' });
    });
});

// 將各角度還原為預設值
app.post('/api/reset-arm', (req, res) => {
  axios
    .post(`http://${esp32Ip}:${esp32Port}/api/reset-arm`)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ error: 'Failed to reset arm' });
    });
});

// 獲取esp32端當前角度
app.get('/api/get-angles', (req, res) => {
  axios
    .get(`http://${esp32Ip}:${esp32Port}/api/get-angles`)
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

// 啟動 Express Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
