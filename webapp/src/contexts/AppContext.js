// file: webapp\src\contexts\AppContext.js
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { useEffect } from 'react';
import { createContext, useState } from 'react';
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [point, setPoint] = useState(0);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [connectedMacAddress, setConnectedMacAddress] = useState('');
  const [connecting, setConnecting] = useState(false);

  const [faceMode, setFaceMode] = useState(false);
  const [showFace, setShowFace] = useState(false);
  const [mood, setMood] = useState('default');

  const [socket, setSocket] = useState(null);
  const [teacherPath, setTeacherPath] = useState(null);
  const [controlMode, setControlMode] = useState('single');

  // armControl
  const [dancing, setDancing] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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

  useEffect(() => {
    if (speaking === true) {
      const interval = setInterval(() => {
        handleSpeakAction();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [speaking]);

  useEffect(() => {
    console.log('mood: ', mood);
    handleTeacherMood();
  }, [mood]);

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

  const handleSpeakAction = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      console.log('talk action');
      axios.post('/api/speak-act', {
        connectedMacAddress,
      });
    }

    if (controlMode === 'multi-singleRoute') {
      axios.post('/api/T-speak-act');
      console.log('All talk action');
    }
  };

  const handleResetWifi = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      console.log('reset wifi');
      axios.post('/api/reset-wifi', {
        connectedMacAddress,
      });
    }
  };

  const handleTeacherMood = () => {
    if (controlMode === 'multi-singleRoute' && role !== 'student') {
      socket?.emit('teacher_mood', mood);
      console.log('emit mood: ', mood);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // supabase
        role,
        setRole,
        // socket
        socket,
        setSocket,
        teacherPath,
        setTeacherPath,
        // states
        displaySidebar,
        setDisplaySidebar,
        selectedSubject,
        setSelectedSubject,
        selectedLesson,
        setSelectedLesson,
        point,
        setPoint,
        connectedDeviceName,
        setConnectedDeviceName,
        connectedMacAddress,
        setConnectedMacAddress,
        connecting,
        setConnecting,
        controlMode,
        setControlMode,
        // face
        showFace,
        setShowFace,
        faceMode,
        setFaceMode,
        mood,
        setMood,
        // armControl
        dancing,
        setDancing,
        speaking,
        setSpeaking,
        targetAngles,
        setTargetAngles,
        currentAngles,
        setCurrentAngles,
        // armControl functions
        handleChange,
        handleDance,
        handleReset,
        handleCorrectAction,
        handleWrongAction,
        handleGrabAction,
        handleSpeakAction,
        handleResetWifi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
