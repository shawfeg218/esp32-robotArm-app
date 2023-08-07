// Esp32Status.jsx
import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/ArmControl.module.css';
import axios from 'axios';
import AppContext from '@/contexts/AppContext';
import { Button, Spacer } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Esp32Status() {
  const router = useRouter();

  const {
    setConnectedDeviceName,
    setConnectedMacAddress,
    connectedDeviceName,
    connectedMacAddress,
  } = useContext(AppContext);

  const [esp32Status, setEsp32Status] = useState({});

  useEffect(() => {
    if (connectedMacAddress === '') return;

    if (connectedMacAddress !== '') {
      const interval = setInterval(() => {
        // console.log('fetching esp32 status');
        axios
          .post('/api/get-esp32Status', {
            connectedMacAddress,
          })
          .then((res) => {
            setEsp32Status(res.data);
          });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [connectedMacAddress]);

  const handleResetWifi = () => {
    if (controlMode === 'single' && connectedMacAddress !== '') {
      // console.log('reset wifi');
      axios.post('/api/reset-wifi', {
        connectedMacAddress,
      });
    }
  };

  const handleDisconnect = () => {
    axios.post('/api/unsubscribe-topic', {
      connectedMacAddress,
    });

    setConnectedDeviceName('');
    setConnectedMacAddress('');
    setEsp32Status({});
  };

  return (
    <div className={styles.statusContainer}>
      <h2>ESP32 Status</h2>
      <div>
        {connectedMacAddress !== '' ? (
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
          <Link href="/device" passHref>
            <h3 className="hover:cursor-pointer text-blue-600">choose a device to get status 🔗</h3>
          </Link>
        )}
      </div>

      <div className="mt-3">
        {connectedDeviceName === '' ? null : (
          <>
            <Button
              ghost
              className="w-full text-purple-600 hover:bg-purple-600 hover:text-white border-purple-600"
              onClick={handleResetWifi}
            >
              重置wifi
            </Button>
            <Spacer y={0.25} />
            <Button
              ghost
              onClick={handleDisconnect}
              className="w-full text-white bg-red-600 border-red-600"
            >
              取消連線
            </Button>
            {router.asPath !== '/device' ? (
              <>
                <Spacer y={0.25} />
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push('/device');
                  }}
                >
                  連線設置
                </Button>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
