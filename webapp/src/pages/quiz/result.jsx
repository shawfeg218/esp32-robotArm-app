import React, { useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Link from 'next/link';

function Result() {
  const { point, setPoint, selectedSubject, setSelectedSubject } =
    useContext(AppContext);

  const handleReturnHome = () => {
    setPoint(0);
    setSelectedSubject('');
  };

  return (
    <div className="results">
      <p>Subject: {selectedSubject}</p>
      <p>Your score: {point}</p>
      <Link href="/" passHref>
        <button onClick={handleReturnHome}>Return to Home</button>
      </Link>
    </div>
  );
}

export default Result;
