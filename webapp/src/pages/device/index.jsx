import Esp32Devices from '@/components/arm-control/Esp32Devices';
import Esp32Status from '@/components/arm-control/Esp32Status';
import React from 'react';

export default function devicePage() {
  return (
    <div className="flex-container">
      <Esp32Devices />
      <Esp32Status />
    </div>
  );
}
