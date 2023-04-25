import ArmControl from '@/components/arm-control/ArmControl';
import Esp32Status from '@/components/arm-control/Esp32Status';
import React from 'react';

export default function ArmControlPage() {
  return (
    <div className="flex-container">
      <Esp32Status />
      <ArmControl />
    </div>
  );
}
