import React, { useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AppContext from '@/contexts/AppContext';

export default function HomePage() {
  const { history, esp32WifiConnected, setEsp32WifiConnected } =
    useContext(AppContext);

  function handleResetWifi() {
    axios.post('/api/reset-wifi');
  }

  return (
    <div>
      <div className="navbar">
        <button onClick={handleResetWifi}>重置手臂WiFi</button>
      </div>
      <h1>Welcome to my web app!</h1>
      <Link href="/quiz" passHref>
        <button>Quiz</button>
      </Link>
      <Link href="/arm-control" passHref>
        <button>操作手臂</button>
      </Link>

      <h2>History:</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            Subject: {entry.subject}, Points: {entry.point}
          </li>
        ))}
      </ul>
    </div>
  );
}
