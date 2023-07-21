// lib/esp32Function.js

import {
  mqttClient,
  getCurrentAngles,
  getCurrentEsp32Status,
  // returnHeartbeat,
} from '@/lib/mqtt';

export const resetWifi = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/reset-wifi`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in resetWifi: ${errorMessage}`);
  }
};

export const setAxisAngle = (req, res) => {
  try {
    const angles = req.body.targetAngles;
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/set-axis-angle`, JSON.stringify(angles));
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in setAxisAngle: ${errorMessage}`);
  }
};

export const correctAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/correct-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in correctAct: ${errorMessage}`);
  }
};

export const wrongAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/wrong-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in wrongAct: ${errorMessage}`);
  }
};

export const grabAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/grab-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in grabAct: ${errorMessage}`);
  }
};

export const resetArm = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    mqttClient.publish(`esp32/${macAddress}/control/reset-arm`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in resetArm: ${errorMessage}`);
  }
};

// -- get eap32 -- //
export const getAngles = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    const AnglesTopic = `esp32/${macAddress}/angles`;
    if (!subscribedTopics.has(AnglesTopic)) {
      mqttClient.subscribe(AnglesTopic);
      subscribedTopics.add(AnglesTopic);
    }

    mqttClient.publish(`esp32/${macAddress}/control/get-angles`, '');
    res.status(200).send(getCurrentAngles(macAddress));
    // console.log(getCurrentAngles(macAddress));
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in getAngles: ${errorMessage}`);
  }
};

export const getEsp32Status = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    const statusTopic = `esp32/${macAddress}/esp32Status`;
    if (!subscribedTopics.has(statusTopic)) {
      mqttClient.subscribe(statusTopic);
      subscribedTopics.add(statusTopic);
    }

    mqttClient.publish(`esp32/${macAddress}/control/get-esp32Status`, '');
    res.status(200).send(getCurrentEsp32Status(macAddress));
    // console.log(getCurrentEsp32Status(macAddress));
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    throw new Error(`Error in getEsp32Status: ${errorMessage}`);
  }
};

// export const getHeartbeat = (req, res) => {
//   try {
//     const macAddress = req.body.connectedMacAddress;
//     subscribeToTopics(macAddress);

//     mqttClient.publish(`esp32/${macAddress}/control/get-heartbeat`, '');
//     res.status(200).send(returnHeartbeat(macAddress));
//     // console.log(returnHeartbeat(macAddress));
//   } catch (error) {
//     let errorMessage = error.message ? error.message : 'An unknown error occurred';
//     throw new Error(`Error in getHeartbeat: ${errorMessage}`);
//   }
// };
