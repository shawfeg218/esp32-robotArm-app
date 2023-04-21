import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  };

  useEffect(() => {
    axios.post('/api/set-axis-angle', targetAngles);
    console.log(targetAngles);
  }, [targetAngles]);

  const handleReset = () => {
    setTargetAngles({
      A: 0,
      B: 0,
      C: 180,
      D: 0,
      E: 180,
      F: 18,
    });

    axios.post('/api/reset-arm');
  };

  const handleCorrectAction = () => {
    axios.post('/api/correct-act');
  };

  const handleWrongAction = () => {
    axios.post('/api/wrong-act');
  };

  const handleGrabAction = () => {
    axios.post('/api/grab-act');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('/api/get-angles').then((res) => {
        setCurrentAngles(res.data);
        // console.log(res.data);
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
