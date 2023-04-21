import { mqttClient, getCurrentAngles } from '@/middlewares/mqttMiddleware';

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
