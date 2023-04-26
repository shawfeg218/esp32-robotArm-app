import {
  mqttClient,
  getCurrentAngles,
  getCurrentEsp32Status,
  returnHeartbeat,
} from '@/middlewares/mqttMiddleware';

export const resetWifi = (req, res) => {
  const macAddress = req.body.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/reset-wifi`, '');
  res.status(204).send();
};

export const setAxisAngle = (req, res) => {
  const angles = req.body.targetAngles;
  const macAddress = req.body.macAddress;

  mqttClient.publish(
    `esp32/control/${macAddress}/set-axis-angle`,
    JSON.stringify(angles)
  );
  res.status(204).send();
};

export const correctAct = (req, res) => {
  const macAddress = req.body.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/correct-act`, '');
  res.status(204).send();
};

export const wrongAct = (req, res) => {
  const macAddress = req.body.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/wrong-act`, '');
  res.status(204).send();
};

export const grabAct = (req, res) => {
  const macAddress = req.body.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/grab-act`, '');
  res.status(204).send();
};

export const resetArm = (req, res) => {
  const macAddress = req.body.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/reset-arm`, '');
  res.status(204).send();
};

export const getAngles = (req, res) => {
  const macAddress = req.query.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/get-angles`, '');
  res.status(200).send(getCurrentAngles());
};

export const getEsp32Status = (req, res) => {
  const macAddress = req.query.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/get-esp32Status`, '');
  res.status(200).send(getCurrentEsp32Status());
};

export const getHeartbeat = (req, res) => {
  const macAddress = req.query.macAddress;

  mqttClient.publish(`esp32/control/${macAddress}/get-heartbeat`, '');
  res.status(200).send(returnHeartbeat());
};
