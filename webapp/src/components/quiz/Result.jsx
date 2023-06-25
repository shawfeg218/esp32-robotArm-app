// file: src/components/quiz/Result.jsx
import React, { useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import Link from 'next/link';

function Result() {
  const { point, setPoint, selectedSubject, setSelectedSubject } = useContext(AppContext);

  const handleReturnHome = () => {
    setPoint(0);
    setSelectedSubject('');
  };

  return (
    <div className="mt-16">
      <h2>Subject: {selectedSubject}</h2>
      <h2>Your score: {point}</h2>
      <Link href="/" passHref>
        <button onClick={handleReturnHome}>Return to Home</button>
      </Link>
    </div>
  );
}

export default Result;
