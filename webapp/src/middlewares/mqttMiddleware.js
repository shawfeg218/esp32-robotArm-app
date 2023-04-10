import mqtt from 'mqtt';
const mqttClient = mqtt.connect('mqtt://localhost:1883');

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
