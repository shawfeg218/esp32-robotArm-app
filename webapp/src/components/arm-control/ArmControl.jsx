import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../next.config';
import ArmControlView from './ArmControlView';

export default function ArmControl() {
  const [targetAngles, setTargetAngles] = useState({
    A: 0,
    B: 0,
    C: 180,
    D: 0,
    E: 180,
    F: 18,
  });
  const [currentAngles, setCurrentAngles] = useState({
    A: 0,
    B: 0,
    C: 180,
    D: 0,
    E: 180,
    F: 18,
  });

  const handleChange = (axis, angle) => {
    const newAngles = { ...targetAngles, [axis]: angle };
    setTargetAngles(newAngles);

    axios.post(`${SERVER_URL}/api/set-axis-angle`, { axis, angle });
  };

  const handleReset = () => {
    setTargetAngles({
      A: 0,
      B: 0,
      C: 180,
      D: 0,
      E: 180,
      F: 18,
    });

    axios.post(`${SERVER_URL}/api/reset-arm`);
  };

  const handleCorrectAction = () => {
    axios.post(`${SERVER_URL}/api/correct-act`);
  };

  const handleWrongAction = () => {
    axios.post(`${SERVER_URL}/api/wrong-act`);
  };

  const handleGrabAction = () => {
    axios.post(`${SERVER_URL}/api/grab-act`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${SERVER_URL}/api/get-angles`).then((res) => {
        setCurrentAngles(res.data);
        console.log(res.data);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ArmControlView
      targetAngles={targetAngles}
      currentAngles={currentAngles}
      handleChange={handleChange}
      handleReset={handleReset}
      handleCorrectAction={handleCorrectAction}
      handleWrongAction={handleWrongAction}
      handleGrabAction={handleGrabAction}
    />
  );
}
