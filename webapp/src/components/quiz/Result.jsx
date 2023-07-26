// file: src/components/quiz/Result.jsx
import React, { useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';

function Result() {
  const router = useRouter();
  const { point, setPoint, selectedSubject, setSelectedSubject } = useContext(AppContext);

  const handleReturnHome = () => {
    setPoint(0);
    setSelectedSubject('');
    router.push('/');
  };

  return (
    <div className="mt-16 w-full flex justify-center">
      <div>
        <h2>Subject: {selectedSubject}</h2>
        <h2>Your score: {point}</h2>
        <Button className="z-0" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}

export default Result;
