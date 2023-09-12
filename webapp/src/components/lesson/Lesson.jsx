import React, { useContext, useState, useEffect } from 'react';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { Card, Modal, Button } from '@nextui-org/react';
import Textbook from './Textbook';
import { useRouter } from 'next/router';
import QuizLoading from '../quiz/QuizLoading';

function Lesson() {
  const router = useRouter();
  const user = useUser();
  const role = user?.user_metadata?.role;
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);

  const { selectedLesson, setSelectedLesson } = useContext(AppContext);
  const [lessons, setLessons] = useState([]);

  const [showDelModal, setShowDelModal] = useState(false);
  const [delLesson, setDelLesson] = useState({});

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  async function fetchLessons() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('lessons').select('*');

      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLessons(data);
    } catch (error) {
      console.log('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLessons();
    // lessons.map((lesson) => console.log(lesson));
  }, []);

  const handleDeleteLesson = async () => {
    const id = delLesson.id;
    console.log('delLesson:', id);
    try {
      const { data, error } = await supabase.from('lessons').delete().eq('id', id);

      if (error) {
        throw error;
      }

      // console.log('data:', data);
      fetchLessons();
    } catch (error) {
      console.log('Error deleting lesson:', error);
    } finally {
      setDelLesson({});
    }
  };

  return (
    <>
      <>
        {selectedLesson ? null : (
          <>
            <div className="w-full flex justify-center mt-16">
              {loading ? (
                <QuizLoading />
              ) : (
                <>
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id}>
                        <Card
                          isHoverable
                          isPressable
                          // key={lesson.id}
                          className="relative w-96 h-52 bg-white p-4 pr-9 hover:bg-yellow-50"
                          onClick={() => handleSelectLesson(lesson.id)}
                        >
                          {/* Teacher delete icon */}
                          {role === 'teacher' && (
                            <AiOutlineDelete
                              size="1.5rem"
                              className="absolute top-4 right-3 hover:text-slate-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDelModal(true);
                                setDelLesson(lessons[index]);
                                console.log(lessons[index]);
                              }}
                            />
                          )}
                          <div className="h-full flex items-center">
                            <div className="flex">
                              <div className="h-full w-1/2 mr-2">
                                <img
                                  src="/img/learning-desk.png"
                                  className="w-full h-auto opacity-90"
                                  alt="lesson card"
                                />
                              </div>
                              <div>
                                <p className="font-bold">{lesson.title.toUpperCase()}</p>
                                <p className="font-bold">課文 id: {lesson.id}</p>
                                <p className="font-bold">課文大綱:</p>
                                <p className="font-bold">{lesson.description}</p>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Show delete modal */}
                        <Modal open={showDelModal} onClose={() => setShowDelModal(false)}>
                          <Modal.Header className="text-2xl font-bold">
                            確定刪除{' '}
                            <span className="text-red-500 font-bold">{delLesson.title}</span> ?
                          </Modal.Header>
                          <Modal.Body className="pl-8">
                            <h3>課文 id: {delLesson.id}</h3>
                            <h3>課文名稱: {delLesson.title}</h3>
                            <h3>課文大綱: {delLesson.description}</h3>
                          </Modal.Body>
                          <Modal.Footer>
                            <div className="flex justify-between w-full">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleDeleteLesson();
                                  setShowDelModal(false);
                                }}
                              >
                                確定
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setDelLesson({});
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
                          // key={lesson.id}
                          className="relative w-96 h-52 bg-white p-4 hover:bg-yellow-50 border-4 border-dashed"
                          onClick={() => {
                            router.push('/lesson/add-lesson');
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
      {selectedLesson ? <Textbook /> : null}
    </>
  );
}

export default Lesson;
