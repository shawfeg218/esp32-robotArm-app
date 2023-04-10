import React, { useContext } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';

function Quiz() {
  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <div>
      <div>
        {selectedSubject ? null : (
          <>
            <button onClick={() => handleSelectSubject('Math')}>Math</button>
            <button onClick={() => handleSelectSubject('English')}>
              English
            </button>
          </>
        )}
      </div>
      {selectedSubject ? <Question subject={selectedSubject} /> : null}
    </div>
  );
}

export default Quiz;
