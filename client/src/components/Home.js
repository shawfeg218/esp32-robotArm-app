// file: Home.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';

function Home() {
  const navigate = useNavigate();
  const { history } = useContext(AppContext);

  return (
    <div>
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
