import React, { useContext, useState, useEffect } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import styles from '@/styles/Question.module.css';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import Link from 'next/link';
import { Card, Modal, Button } from '@nextui-org/react';

function Quiz() {
  const user = useUser();
  const role = user?.user_metadata?.role;
  const supabase = useSupabaseClient();

  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);

  const [showDelModal, setShowDelModal] = useState(false);
  const [delSub, setDelSub] = useState({});

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  async function fetchSubjects() {
    try {
      const { data, error } = await supabase.from('subjects').select('*');

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
    // subjects.map((subject) => console.log(subject));
  }, []);

  const handleDeleteSubject = async () => {
    const id = delSub.id;
    console.log('delSub:', id);
    try {
      const { data, error } = await supabase.from('subjects').delete().eq('id', id);

      if (error) {
        throw error;
      }

      // console.log('data:', data);
      fetchSubjects();
    } catch (error) {
      console.log('Error deleting subject:', error);
    } finally {
      setDelSub({});
    }
  };

  return (
    <>
      <>
        {selectedSubject ? null : (
          <>
            <div className="cardContainer mt-16">
              {subjects.map((subject, index) => (
                <>
                  <Card
                    isHoverable
                    isPressable
                    variant="bordered"
                    key={subject.id}
                    className="relative w-40 h-52 bg-white p-4 m-4 hover:bg-yellow-50"
                    onClick={() => handleSelectSubject(subject.id)}
                  >
                    <AiOutlineDelete
                      size="1.5rem"
                      className="absolute top-2 right-2 hover:text-slate-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDelModal(true);
                        setDelSub(subjects[index]);
                        console.log(subjects[index]);
                      }}
                    />
                    <p className="font-bold">{subject.name.toUpperCase()}</p>
                    <p className="font-bold">Subject id: {subject.id}</p>
                    <p className="font-bold">Total questions: {subject.total_questions}</p>
                    {/* <p className="font-bold">
                      Inserted time:
                      {new Date(subject.inserted_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p> */}
                    <p className="font-bold">題目介紹:</p>
                    <p className="font-bold">{subject.describe ? subject.describe : '無說明'}</p>
                  </Card>
                  <Modal open={showDelModal} onClose={() => setShowDelModal(false)}>
                    <Modal.Header className="text-2xl font-bold">
                      確定刪除 <span className="text-red-500 font-bold">{delSub.name}</span> ?
                    </Modal.Header>
                    <Modal.Body className="pl-8">
                      <h3>subject id: {delSub.id}</h3>
                      <h3>subject name: {delSub.name}</h3>
                      <h3>total questions: {delSub.total_questions}</h3>
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="flex justify-between w-full">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleDeleteSubject();
                            setShowDelModal(false);
                          }}
                        >
                          確定
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setDelSub({});
                            setShowDelModal(false);
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    </Modal.Footer>
                  </Modal>
                </>
              ))}

              {/* add subject component */}
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
