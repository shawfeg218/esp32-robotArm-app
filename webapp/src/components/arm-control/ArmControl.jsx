import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArmControlView from './ArmControlView';
import AppContext from '@/contexts/AppContext';

export default function ArmControl() {
  const {
    controlMode,
    targetAngles,
    currentAngles,
    dancing,
    setDancing,
    speaking,
    setSpeaking,
    handleDance,
    handleChange,
    handleReset,
    handleCorrectAction,
    handleWrongAction,
    handleGrabAction,
    handleSpeakAction,
    setMood,
  } = useContext(AppContext);

  return (
    <ArmControlView
      controlMode={controlMode}
      targetAngles={targetAngles}
      currentAngles={currentAngles}
      dancing={dancing}
      setDancing={setDancing}
      speaking={speaking}
      setSpeaking={setSpeaking}
      handleChange={handleChange}
      handleReset={handleReset}
      handleCorrectAction={handleCorrectAction}
      handleWrongAction={handleWrongAction}
      handleGrabAction={handleGrabAction}
      handleDance={handleDance}
      handleSpeakAction={handleSpeakAction}
      setMood={setMood}
      // handleResetWifi={handleResetWifi}
    />
  );
}
