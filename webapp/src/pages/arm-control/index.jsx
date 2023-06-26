import ArmControl from '@/components/arm-control/ArmControl';
import Esp32Status from '@/components/arm-control/Esp32Status';
import React from 'react';

export default function ArmControlPage() {
  return (
    <div className="mt-16 flex flex-wrap justify-center">
      <ArmControl />
      <Esp32Status />
    </div>
  );
}
