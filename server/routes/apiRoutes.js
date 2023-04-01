const express = require('express');
const router = express.Router();

const esp32Controller = require('../controllers/esp32Controller');

router.post('/reset-wifi', esp32Controller.resetWifi);
router.post('/set-axis-angle', esp32Controller.setAxisAngle);
router.post('/correct-act', esp32Controller.correctAct);
router.post('/wrong-act', esp32Controller.wrongAct);
router.post('/grab-act', esp32Controller.grabAct);
router.post('/reset-arm', esp32Controller.resetArm);
router.get('/get-angles', esp32Controller.getAngles);

module.exports = router;
