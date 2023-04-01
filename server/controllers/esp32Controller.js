const {
  mqttClient,
  getCurrentAngles,
} = require('../middlewares/mqttMiddleware');

exports.resetWifi = (req, res) => {
  mqttClient.publish('esp32/control/reset-wifi', '');
  res.status(204).send();
};

exports.setAxisAngle = (req, res) => {
  const { axis, angle } = req.body;
  mqttClient.publish(
    'esp32/control/set-axis-angle',
    JSON.stringify({ axis, angle })
  );
  res.status(204).send();
};

exports.correctAct = (req, res) => {
  mqttClient.publish('esp32/control/correct-act', '');
  res.status(204).send();
};

exports.wrongAct = (req, res) => {
  mqttClient.publish('esp32/control/wrong-act', '');
  res.status(204).send();
};

exports.grabAct = (req, res) => {
  mqttClient.publish('esp32/control/grab-act', '');
  res.status(204).send();
};

exports.resetArm = (req, res) => {
  mqttClient.publish('esp32/control/reset-arm', '');
  res.status(204).send();
};

exports.getAngles = (req, res) => {
  mqttClient.publish('esp32/control/get-angles', '');
  res.status(200).send(getCurrentAngles());
};
