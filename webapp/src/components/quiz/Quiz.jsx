import React, { useContext, useState, useEffect } from 'react';
import Question from './Question';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { Card, Modal, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import QuizLoading from './QuizLoading';

const cardImgs = ['/img/quiz-card-1.jpg', '/img/quiz-card-2.jpg', '/img/quiz-card-3.jpg'];

function Quiz() {
  const router = useRouter();
  const user = useUser();
  const role = user?.user_metadata?.role;
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);

  const { selectedSubject, setSelectedSubject } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);

  const [showDelModal, setShowDelModal] = useState(false);
  const [delSub, setDelSub] = useState({});

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  async function fetchSubjects() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('subjects').select('*');

      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubjects(data);
    } catch (error) {
      console.log('Error fetching subjects:', error);
    } finally {
      setLoading(false);
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
            <div className="w-full flex justify-center mt-16">
              {loading ? (
                <QuizLoading />
              ) : (
                <>
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {subjects.map((subject, index) => (
                      <div key={subject.id}>
                        <Card
                          isHoverable
                          isPressable
                          // key={subject.id}
                          className="relative w-96 h-52 bg-white p-4 pr-9 hover:bg-yellow-50"
                          onClick={() => handleSelectSubject(subject.id)}
                        >
                          {/* Teacher delete icon */}
                          {role === 'teacher' && (
                            <AiOutlineDelete
                              size="1.5rem"
                              className="absolute top-4 right-3 hover:text-slate-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDelModal(true);
                                setDelSub(subjects[index]);
                                console.log(subjects[index]);
                              }}
                            />
                          )}

                          <div className="h-full flex items-center">
                            <div className="flex">
                              <div className="h-full w-1/2 mr-2">
                                <img
                                  src={cardImgs[index % 3]}
                                  className="w-full h-auto opacity-90"
                                  alt="lesson card"
                                />
                              </div>
                              <div>
                                <p className="font-bold">{subject.name.toUpperCase()}</p>
                                <p className="font-bold">Subject id: {subject.id}</p>
                                <p className="font-bold">
                                  Total questions: {subject.total_questions}
                                </p>
                                <p className="font-bold">題目介紹:</p>
                                <p className="font-bold">
                                  {subject.describe ? subject.describe : '無說明'}
                                </p>
                              </div>
                            </div>
                          </div>
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
                      </div>
                    ))}

                    {/* add subject component */}
                    <>
                      {role === 'teacher' ? (
                        <Card
                          isHoverable
                          isPressable
                          // key={subject.id}
                          className="relative w-96 h-52 bg-white p-4 hover:bg-yellow-50 border-4 border-dashed"
                          onClick={() => {
                            router.push('/quiz/add-subject');
                          }}
                        >
                          <div className="h-full flex justify-center items-center">
                            <div className="reactIcon">
                              <BiPlus size="3rem" />
                            </div>
                          </div>
                        </Card>
                      ) : null}
                    </>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
      {selectedSubject ? <Question /> : null}
    </>
  );
}

export default Quiz;
