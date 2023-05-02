import React, { useContext, useState, useEffect } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function Quiz() {
  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const supabase = useSupabaseClient();

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  async function fetchSubjects() {
    try {
      const { data, error } = await supabase.from('subjects').select('name');

      if (error) {
        throw error;
      }

      setSubjects(data.map((subject) => subject.name));
    } catch (error) {
      console.log('Error fetching subjects:', error);
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div>
      <div>
        {selectedSubject ? null : (
          <div className="cardContainer">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="card"
                onClick={() => handleSelectSubject(subject)}
              >
                <p>{subject.toUpperCase()}</p>
                <div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedSubject ? <Question /> : null}
    </div>
  );
}

export default Quiz;
