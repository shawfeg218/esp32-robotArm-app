import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArmControlView from './ArmControlView';
import AppContext from '@/contexts/AppContext';

export default function ArmControl() {
  const { controlMode, connectedMacAddress } = useContext(AppContext);

  const [targetAngles, setTargetAngles] = useState({
    A: 90,
    B: 90,
    C: 75,
    D: 145,
    E: 160,
    F: 90,
    G: 75,
    H: 90,
  });
  const [currentAngles, setCurrentAngles] = useState({
    A: 90,
    B: 90,
    C: 75,
    D: 145,
    E: 160,
    F: 90,
    G: 75,
    H: 90,
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

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-set-axis-angle', {
        targetAngles,
      });
      // console.log('All target: ', targetAngles);
    }
  }, [targetAngles]);

  const handleReset = () => {
    setTargetAngles({
      A: 90,
      B: 90,
      C: 75,
      D: 145,
      E: 160,
      F: 90,
      G: 75,
      H: 90,
    });

    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('reset arm');
      axios.post('/api/reset-arm', {
        connectedMacAddress,
      });
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-reset-arm');
      console.log('All reset arm');
    }
  };

  const handleCorrectAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('correct action');
      axios.post('/api/correct-act', {
        connectedMacAddress,
      });
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-correct-act');
      console.log('All correct action');
    }
  };

  const handleWrongAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('wrong action');
      axios.post('/api/wrong-act', {
        connectedMacAddress,
      });
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-wrong-act');
      console.log('All wrong action');
    }
  };

  const handleGrabAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('grab action');
      axios.post('/api/grab-act', {
        connectedMacAddress,
      });
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-grab-act');
      console.log('All grab action');
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
      controlMode={controlMode}
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
