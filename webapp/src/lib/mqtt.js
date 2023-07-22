// file: webapp\src\lib\mqtt.js
import mqtt from 'mqtt';

const MQTT_SERVER_IP = process.env.MQTT_SERVER_IP;
const MQTT_SERVER_PORT = process.env.MQTT_SERVER_PORT;
const mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER_IP}:${MQTT_SERVER_PORT}`);

const currentAnglesMap = new Map();
const currentEsp32StatusMap = new Map();
// const lastHeartbeatMap = new Map();

const subscribedTopics = new Set();

let mqttClientCounter = 0;

mqttClient.on('connect', () => {
  console.log('MQTT client connected');
  mqttClientCounter++;
  console.log('MQTT client counter:', mqttClientCounter);

  // Do nothing here; we'll subscribe to topics after setting the macAddress
});

mqttClient.on('disconnect', () => {
  console.log('MQTT client disconnected');
  mqttClientCounter--;
  console.log('MQTT client counter:', mqttClientCounter);
});

mqttClient.on('message', (topic, message) => {
  const macAddress = topic.split('/')[1];

  if (topic.endsWith('angles')) {
    currentAnglesMap.set(macAddress, JSON.parse(message.toString()));
  } else if (topic.endsWith('esp32Status')) {
    currentEsp32StatusMap.set(macAddress, JSON.parse(message.toString()));
  }
  // else if (topic.endsWith('heartbeat')) {
  //   lastHeartbeatMap.set(macAddress, Date.now());
  // }
});

const getCurrentAngles = (macAddress) => currentAnglesMap.get(macAddress) || {};
const getCurrentEsp32Status = (macAddress) => currentEsp32StatusMap.get(macAddress) || {};
// const returnHeartbeat = (macAddress) => lastHeartbeatMap.get(macAddress) || 0;

export {
  mqttClient,
  subscribedTopics,
  getCurrentAngles,
  getCurrentEsp32Status,
  // returnHeartbeat,
};
