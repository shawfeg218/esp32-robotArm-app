// file: webapp\src\components\quiz\Quiz.jsx
import React, { useContext } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';

function Quiz() {
  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <div>
      <div>
        {selectedSubject ? null : (
          <div className="cardContainer">
            <div className="card" onClick={() => handleSelectSubject('Math')}>
              <p>MATH</p>
              <div></div>
            </div>
            <div
              className="card"
              onClick={() => handleSelectSubject('English')}
            >
              <p>ENGLISH</p>
              <div></div>
            </div>
          </div>
        )}
      </div>
      {selectedSubject ? <Question /> : null}
    </div>
  );
}

export default Quiz;
