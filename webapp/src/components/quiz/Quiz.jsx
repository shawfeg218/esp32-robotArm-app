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
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, total_questions');

      if (error) {
        throw error;
      }

      setSubjects(data);
    } catch (error) {
      console.log('Error fetching subjects:', error);
    }
  }

  useEffect(() => {
    fetchSubjects();
    subjects.map((subject) => console.log(subject));
  }, []);

  return (
    <div>
      <div>
        {selectedSubject ? null : (
          <div className="cardContainer">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="card"
                onClick={() => handleSelectSubject(subject.name)}
              >
                <p>{subject.name.toUpperCase()}</p>
                <p>subject id: {subject.id}</p>
                <p>Total questions: {subject.total_questions}</p>
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
