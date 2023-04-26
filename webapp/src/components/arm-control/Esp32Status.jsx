import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/ArmControl.module.css';
import axios from 'axios';
import AppContext from '@/contexts/AppContext';

export default function Esp32Status() {
  const { connectedDeviceName, connectedMacAddress } = useContext(AppContext);
  const [esp32Status, setEsp32Status] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('/api/get-esp32Status', {
          params: {
            connectedMacAddress,
          },
        })
        .then((res) => {
          setEsp32Status(res.data);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = (lastHeartbeat) => {
    const currentTime = Date.now();
    if (currentTime - lastHeartbeat > 6000) {
      setConnected(false);
    } else {
      setConnected(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('/api/get-heartbeat', {
          params: {
            connectedMacAddress,
          },
        })
        .then((res) => {
          checkConnection(res.data);
          // console.log(res.data);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statusContainer}>
      <h2>ESP32 Status</h2>
      <div>
        {!connected ? (
          `connecting to ${connectedDeviceName}...`
        ) : (
          <>
            <div>macAddress: {esp32Status.macAddress}</div>
            <div>SSID: {esp32Status.ssid}</div>
            <div>Local IP: {esp32Status.localIP}</div>
            <div>RSSI: {esp32Status.rssi}</div>
            {/* <div>Chip Revision: {esp32Status.chipRevision}</div> */}
            <div>Uptime: {esp32Status.uptime} ms</div>
            <div>Temperature: {esp32Status.temperature} °C</div>
            <div>CPU Frequency: {esp32Status.cpuFrequency} MHz</div>
            {/* <div>Free Heap: {esp32Status.freeHeap} bytes</div> */}
            {/* <div>Flash Size: {esp32Status.flashSize} bytes</div> */}
            {/* <div>Hall Effect: {esp32Status.hallEffect}</div> */}
          </>
        )}
      </div>
    </div>
  );
}
