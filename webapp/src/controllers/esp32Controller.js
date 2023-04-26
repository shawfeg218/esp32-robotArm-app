import {
  mqttClient,
  getCurrentAngles,
  getCurrentEsp32Status,
  returnHeartbeat,
  subscribeToTopics,
} from '@/middlewares/mqttMiddleware';
export const resetWifi = (req, res) => {
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(`esp32/${macAddress}/control/reset-wifi`, '');
  res.status(204).send();
};

export const setAxisAngle = (req, res) => {
  const angles = req.body.targetAngles;
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(
    `esp32/${macAddress}/control/set-axis-angle`,
    JSON.stringify(angles)
  );
  res.status(204).send();
};

export const correctAct = (req, res) => {
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(`esp32/${macAddress}/control/correct-act`, '');
  res.status(204).send();
};

export const wrongAct = (req, res) => {
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(`esp32/${macAddress}/control/wrong-act`, '');
  res.status(204).send();
};

export const grabAct = (req, res) => {
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(`esp32/${macAddress}/control/grab-act`, '');
  res.status(204).send();
};

export const resetArm = (req, res) => {
  const macAddress = req.body.connectedMacAddress;

  mqttClient.publish(`esp32/${macAddress}/control/reset-arm`, '');
  res.status(204).send();
};

export const getAngles = (req, res) => {
  const macAddress = req.body.connectedMacAddress;
  subscribeToTopics(macAddress);
  mqttClient.publish(`esp32/${macAddress}/control/get-angles`, '');
  res.status(200).send(getCurrentAngles(macAddress));
  console.log(getCurrentAngles(macAddress));
};

export const getEsp32Status = (req, res) => {
  const macAddress = req.body.connectedMacAddress;
  subscribeToTopics(macAddress);

  mqttClient.publish(`esp32/${macAddress}/control/get-esp32Status`, '');
  res.status(200).send(getCurrentEsp32Status(macAddress));
  console.log(getCurrentEsp32Status(macAddress));
};

export const getHeartbeat = (req, res) => {
  const macAddress = req.body.connectedMacAddress;
  subscribeToTopics(macAddress);

  mqttClient.publish(`esp32/${macAddress}/control/get-heartbeat`, '');
  res.status(200).send(returnHeartbeat(macAddress));
  console.log(returnHeartbeat(macAddress));
};
