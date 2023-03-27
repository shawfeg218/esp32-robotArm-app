// file: Home.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import axios from 'axios';
import { SERVER_URL } from '../config';

function Home() {
  const navigate = useNavigate();

  const { history, esp32WifiConnected, setEsp32WifiConnected } =
    useContext(AppContext);

  function handleResetWifi() {
    axios.post(`${SERVER_URL}/api/reset-wifi`);
  }

  return (
    <div>
      <div className="navbar">
        <button onClick={handleResetWifi}>重置手臂WiFi</button>
      </div>
      <h1>Welcome to my web app!</h1>
      <button onClick={() => navigate('/quiz')}>Quiz</button>
      <button onClick={() => navigate('/arm-control')}>操作手臂</button>

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

export default Home;
