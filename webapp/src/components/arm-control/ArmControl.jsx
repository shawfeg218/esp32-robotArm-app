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
    handleDance,
    handleChange,
    handleReset,
    handleCorrectAction,
    handleWrongAction,
    handleGrabAction,
    handleSpeakAction,
  } = useContext(AppContext);

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
      handleSpeakAction={handleSpeakAction}
      // handleResetWifi={handleResetWifi}
    />
  );
}
