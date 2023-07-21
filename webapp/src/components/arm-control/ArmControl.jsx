import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArmControlView from './ArmControlView';
import AppContext from '@/contexts/AppContext';

export default function ArmControl() {
  const { connectedMacAddress } = useContext(AppContext);

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
    if (connectedMacAddress === '') return;

    axios.post('/api/set-axis-angle', {
      targetAngles,
      connectedMacAddress,
    });
    // console.log(targetAngles);
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

    if (connectedMacAddress !== '') {
      // console.log('reset arm');
      axios.post('/api/reset-arm', {
        connectedMacAddress,
      });
    }
  };

  const handleCorrectAction = () => {
    if (connectedMacAddress === '') return;

    // console.log('correct action');
    axios.post('/api/correct-act', {
      connectedMacAddress,
    });
  };

  const handleWrongAction = () => {
    if (connectedMacAddress === '') return;

    // console.log('wrong action');
    axios.post('/api/wrong-act', {
      connectedMacAddress,
    });
  };

  const handleGrabAction = () => {
    if (connectedMacAddress === '') return;

    // console.log('grab action');
    axios.post('/api/grab-act', {
      connectedMacAddress,
    });
  };

  const handleResetWifi = () => {
    if (connectedMacAddress === '') return;

    // console.log('reset wifi');
    axios.post('/api/reset-wifi', {
      connectedMacAddress,
    });
  };

  useEffect(() => {
    if (connectedMacAddress === '') return;

    const interval = setInterval(() => {
      axios
        .post('/api/get-angles', {
          connectedMacAddress,
        })
        .then((res) => {
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
      handleResetWifi={handleResetWifi}
    />
  );
}
