// file: webapp\src\middlewares\mqttMiddleware.js
import mqtt from 'mqtt';

const MQTT_SERVER_IP = process.env.MQTT_SERVER_IP;
const MQTT_SERVER_PORT = process.env.MQTT_SERVER_PORT;
const mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER_IP}:${MQTT_SERVER_PORT}`);

let currentAngles = {};
let currentEsp32Status = {};
let lastHeartbeat = Date.now();

const changeSubMacAddress = (macAddress) => {
  mqttClient.on('connect', () => {
    mqttClient.subscribe(`esp32/${macAddress}/angles`);
    mqttClient.subscribe(`esp32/${macAddress}/esp32Status`);
    mqttClient.subscribe(`esp32/${macAddress}/heartbeat`);
  });

  mqttClient.on('message', (topic, message) => {
    if (topic === `esp32/${macAddress}/angles`) {
      currentAngles = JSON.parse(message.toString());
    } else if (topic === `esp32/${macAddress}/esp32Status`) {
      currentEsp32Status = JSON.parse(message.toString());
    } else if (topic === `esp32/${macAddress}/heartbeat`) {
      lastHeartbeat = Date.now();
    }
  });
};

const getCurrentAngles = () => currentAngles;
const getCurrentEsp32Status = () => currentEsp32Status;
const returnHeartbeat = () => lastHeartbeat;

export {
  mqttClient,
  changeSubMacAddress,
  getCurrentAngles,
  getCurrentEsp32Status,
  returnHeartbeat,
};
