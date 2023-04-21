import mqtt from 'mqtt';

const MQTT_SERVER_IP = process.env.MQTT_SERVER_IP;
const MQTT_SERVER_PORT = process.env.MQTT_SERVER_PORT;
const mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER_IP}:${MQTT_SERVER_PORT}`);

let currentAngles = {};

mqttClient.on('connect', () => {
  mqttClient.subscribe('esp32/angles');
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'esp32/angles') {
    currentAngles = JSON.parse(message.toString());
  }
});

const getCurrentAngles = () => currentAngles;

export { mqttClient, getCurrentAngles };
