// Esp32Status.jsx
import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/ArmControl.module.css';
import axios from 'axios';
import AppContext from '@/contexts/AppContext';
import { Switch } from '@nextui-org/react';

export default function Esp32Status() {
  const {
    setConnectedDeviceName,
    setConnectedMacAddress,
    connectedDeviceName,
    connectedMacAddress,
    connecting,
    setConnecting,
  } = useContext(AppContext);
  const [esp32Status, setEsp32Status] = useState({});

  useEffect(() => {
    let interval;
    if (connecting === true) {
      interval = setInterval(() => {
        axios
          .post('/api/get-esp32Status', {
            connectedMacAddress,
          })
          .then((res) => {
            setEsp32Status(res.data);
          });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [connecting, connectedDeviceName, connectedMacAddress]);

  function changeConnectState() {
    console.log('connecting: ', connecting);
    connecting ? setConnecting(false) : setConnecting(true);
    console.log('change to ', connecting);
    if (connectedDeviceName !== '') {
      setConnectedDeviceName('');
      setConnectedMacAddress('');
      setEsp32Status({});
    }
  }

  return (
    <div className={styles.statusContainer}>
      <h2>ESP32 Status</h2>
      <div className="flex items-center">
        <h3>連線</h3>
        <Switch
          checked={connecting}
          onChange={() => {
            changeConnectState();
          }}
          className="ml-3"
        />
      </div>
      <div>
        {connecting ? (
          <>
            <div>Connecting device: {connectedDeviceName}</div>
            <div>macAddress: {esp32Status.macAddress}</div>
            <div>SSID: {esp32Status.ssid}</div>
            <div>Local IP: {esp32Status.localIP}</div>
            <div>RSSI: {esp32Status.rssi}</div>
            <div>Chip Revision: {esp32Status.chipRevision}</div>
            <div>Uptime: {esp32Status.uptime} ms</div>
            <div>Temperature: {esp32Status.temperature} °C</div>
            <div>CPU Frequency: {esp32Status.cpuFrequency} MHz</div>
            <div>Free Heap: {esp32Status.freeHeap} bytes</div>
            <div>Flash Size: {esp32Status.flashSize} bytes</div>
            <div>Hall Effect: {esp32Status.hallEffect}</div>
          </>
        ) : (
          <div>choose a device to connect</div>
        )}
      </div>
    </div>
  );
}
