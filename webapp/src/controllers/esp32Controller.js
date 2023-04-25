import {
  mqttClient,
  getCurrentAngles,
  getCurrentEsp32Status,
  returnHeartbeat,
} from '@/middlewares/mqttMiddleware';

export const resetWifi = (req, res) => {
  mqttClient.publish('esp32/control/reset-wifi', '');
  res.status(204).send();
};

export const setAxisAngle = (req, res) => {
  const angles = req.body;
  mqttClient.publish('esp32/control/set-axis-angle', JSON.stringify(angles));
  res.status(204).send();
};

export const correctAct = (req, res) => {
  mqttClient.publish('esp32/control/correct-act', '');
  res.status(204).send();
};

export const wrongAct = (req, res) => {
  mqttClient.publish('esp32/control/wrong-act', '');
  res.status(204).send();
};

export const grabAct = (req, res) => {
  mqttClient.publish('esp32/control/grab-act', '');
  res.status(204).send();
};

export const resetArm = (req, res) => {
  mqttClient.publish('esp32/control/reset-arm', '');
  res.status(204).send();
};

export const getAngles = (req, res) => {
  mqttClient.publish('esp32/control/get-angles', '');
  res.status(200).send(getCurrentAngles());
};

export const getEsp32Status = (req, res) => {
  mqttClient.publish('esp32/control/get-esp32Status', '');
  res.status(200).send(getCurrentEsp32Status());
};

export const getHeartbeat = (req, res) => {
  mqttClient.publish('esp32/control/get-heartbeat', '');
  res.status(200).send(returnHeartbeat());
};
