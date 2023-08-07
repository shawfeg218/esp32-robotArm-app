import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArmControlView from './ArmControlView';
import AppContext from '@/contexts/AppContext';

export default function ArmControl() {
  const { controlMode, connectedMacAddress } = useContext(AppContext);

  const [dancing, setDancing] = useState(false);

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

  useEffect(() => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      axios.post('/api/set-axis-angle', {
        targetAngles,
        connectedMacAddress,
      });
      console.log(targetAngles);
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-set-axis-angle', {
        targetAngles,
      });
      console.log('All target: ', targetAngles);
    }
  }, [targetAngles]);

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

  useEffect(() => {
    if (dancing === true) {
      const interval = setInterval(() => {
        handleDance();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dancing]);

  const handleChange = (axis, angle) => {
    const newAngles = { ...targetAngles, [axis]: angle };
    setTargetAngles(newAngles);
    console.log('axis: ' + axis + ': ' + angle);
  };

  const handleDance = () => {
    const axis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const randomAxis = axis[Math.floor(Math.random() * axis.length)];
    switch (randomAxis) {
      case 'A':
        // angle: 0 ~ 90
        handleChange('A', Math.floor(Math.random() * (90 + 1)));
        break;
      case 'B':
        handleChange(
          'B',
          // angle: 30 ~ 150
          Math.floor(Math.random() * (150 - 30 + 1) + 30)
        );
        break;
      case 'C':
        handleChange(
          'C',
          // angle : 0 ~ 150
          Math.floor(Math.random() * (150 + 1))
        );
        break;
      case 'D':
        handleChange(
          'D',
          // angle : 120 ~ 170
          Math.floor(Math.random() * (170 - 120 + 1) + 120)
        );
        break;
      case 'E':
        handleChange(
          'E',
          // angle : 50 ~ 160
          Math.floor(Math.random() * (160 - 50 + 1) + 50)
        );
        break;
      case 'F':
        handleChange(
          'F',
          // angle : 30 ~ 150
          Math.floor(Math.random() * (150 - 30 + 1) + 30)
        );
        break;
      case 'G':
        handleChange(
          'G',
          // angle : 0 ~ 150
          Math.floor(Math.random() * (150 + 1))
        );
        break;
      case 'H':
        handleChange(
          'H',
          // angle : 60 ~ 120
          Math.floor(Math.random() * (120 - 60 + 1) + 60)
        );
        break;
    }
  };

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

  const handleTalkAction = () => {};

  // const handleResetWifi = () => {
  //   if (controlMode === 'single' && connectedMacAddress !== '') {
  //     // console.log('reset wifi');
  //     axios.post('/api/reset-wifi', {
  //       connectedMacAddress,
  //     });
  //   }
  // };

  return (
    <ArmControlView
      controlMode={controlMode}
      targetAngles={targetAngles}
      currentAngles={currentAngles}
      dancing={dancing}
      setDancing={setDancing}
      handleChange={handleChange}
      handleReset={handleReset}
      handleCorrectAction={handleCorrectAction}
      handleWrongAction={handleWrongAction}
      handleGrabAction={handleGrabAction}
      handleDance={handleDance}
      handleTalkAction={handleTalkAction}
      // handleResetWifi={handleResetWifi}
    />
  );
}
