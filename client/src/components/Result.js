import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';

function Result() {
  const { point, setPoint, selectedSubject, setSelectedSubject } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleReturnHome = () => {
    setPoint(0);
    setSelectedSubject('');
    navigate('/');
  };

  return (
    <div className="results">
      <p>Subject: {selectedSubject}</p>
      <p>Your score: {point}</p>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  );
}

export default Result;
