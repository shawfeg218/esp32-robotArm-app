import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArmControlView from './ArmControlView';
import AppContext from '@/contexts/AppContext';

export default function ArmControl() {
  const { controlMode, connectedMacAddress } = useContext(AppContext);

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
    if (controlMode === 'single' && connectedMacAddress !== '') {
      axios.post('/api/set-axis-angle', {
        targetAngles,
        connectedMacAddress,
      });
      // console.log(targetAngles);
    }
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

    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('reset arm');
      axios.post('/api/reset-arm', {
        connectedMacAddress,
      });
    }
  };

  const handleCorrectAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('correct action');
      axios.post('/api/correct-act', {
        connectedMacAddress,
      });
    }
  };

  const handleWrongAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('wrong action');
      axios.post('/api/wrong-act', {
        connectedMacAddress,
      });
    }
  };

  const handleGrabAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('grab action');
      axios.post('/api/grab-act', {
        connectedMacAddress,
      });
    }
  };

  const handleResetWifi = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('reset wifi');
      axios.post('/api/reset-wifi', {
        connectedMacAddress,
      });
    }
  };

  useEffect(() => {
    if (connectedMacAddress === '') return;

    if (connectedMacAddress !== '') {
      const interval = setInterval(() => {
        // console.log('get angles');
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
    }
  }, [connectedMacAddress]);

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
