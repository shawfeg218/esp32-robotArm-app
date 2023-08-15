import React, { useContext, useState, useEffect } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import styles from '@/styles/Question.module.css';
import { BiPlus } from 'react-icons/bi';
import Link from 'next/link';
import { Card } from '@nextui-org/react';

function Quiz() {
  const user = useUser();
  const role = user?.user_metadata?.role;
  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const supabase = useSupabaseClient();

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  async function fetchSubjects() {
    try {
      const { data, error } = await supabase.from('subjects').select('id, name, total_questions');

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
    <>
      <>
        {selectedSubject ? null : (
          <>
            <div className="cardContainer mt-16">
              {subjects.map((subject) => (
                <Card
                  isHoverable
                  isPressable
                  variant="bordered"
                  key={subject.name}
                  className="w-36 h-48 card"
                  onClick={() => handleSelectSubject(subject.name)}
                >
                  <p>{subject.name.toUpperCase()}</p>
                  <p>subject id: {subject.id}</p>
                  <p>Total questions: {subject.total_questions}</p>
                  <div></div>
                </Card>
              ))}

              <>
                {role === 'teacher' ? (
                  <Link href="/quiz/add-subject" passHref>
                    <div className={styles.addQConatiner}>
                      <div className={styles.addCard}>
                        <div className="reactIcon">
                          <BiPlus size="3rem" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </>
            </div>
          </>
        )}
      </>
      {selectedSubject ? <Question /> : null}
    </>
  );
}

export default Quiz;
