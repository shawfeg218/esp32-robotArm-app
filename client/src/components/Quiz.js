import React, { useContext } from 'react';
import AppContext from '../AppContext';
import QuestionContainer from './QuestionContainer';

function Quiz() {
  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <div>
      <h2>Quiz</h2>
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
      {selectedSubject ? <QuestionContainer subject={selectedSubject} /> : null}
    </div>
  );
}

export default Quiz;
