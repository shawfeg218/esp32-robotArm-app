import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArmControl from './ArmControl';

function ArmControlContainer() {
  const [targetAngles, setTargetAngles] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  });
  const [currentAngles, setCurrentAngles] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  });

  const handleChange = (axis, angle) => {
    const newAngles = { ...targetAngles, [axis]: angle };
    setTargetAngles(newAngles);

    axios.post('http://localhost:5000/api/set-axis-angle', { axis, angle });
  };

  const handleReset = () => {
    setTargetAngles({
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
    });

    axios.post('http://localhost:5000/api/reset-arm');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:5000/api/get-angles').then((res) => {
        setCurrentAngles(res.data);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ArmControl
      targetAngles={targetAngles}
      currentAngles={currentAngles}
      handleChange={handleChange}
      handleReset={handleReset}
    />
  );
}

export default ArmControlContainer;
