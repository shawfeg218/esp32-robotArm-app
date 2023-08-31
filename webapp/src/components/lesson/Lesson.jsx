import React, { useContext, useState, useEffect } from 'react';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import Link from 'next/link';
import { Card, Modal, Button } from '@nextui-org/react';
import Textbook from './Textbook';

function Lesson() {
  const user = useUser();
  const role = user?.user_metadata?.role;
  const supabase = useSupabaseClient();

  const { selectedLesson, setSelectedLesson } = useContext(AppContext);
  const [lessons, setLessons] = useState([]);

  const [showDelModal, setShowDelModal] = useState(false);
  const [delLesson, setDelLesson] = useState({});

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  async function fetchLessons() {
    try {
      const { data, error } = await supabase.from('lessons').select('*');

      if (error) {
        throw error;
      }

      setLessons(data);
    } catch (error) {
      console.log('Error fetching subjects:', error);
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
              <div className="max-w-6xl grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id}>
                    <Card
                      isHoverable
                      isPressable
                      // key={lesson.id}
                      className="relative w-96 h-52 bg-white p-4 hover:bg-yellow-50"
                      onClick={() => handleSelectLesson(lesson.id)}
                    >
                      {role === 'teacher' && (
                        <AiOutlineDelete
                          size="1.5rem"
                          className="absolute top-2 right-2 hover:text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDelModal(true);
                            setDelLesson(lessons[index]);
                            console.log(lessons[index]);
                          }}
                        />
                      )}
                      <p className="font-bold">{lesson.title.toUpperCase()}</p>
                      <p className="font-bold">課文 id: {lesson.id}</p>
                      <p className="font-bold">課文大綱: {lesson.description}</p>
                      {/* <p className="font-bold">
                      Inserted time:
                      {new Date(lesson.inserted_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p> */}
                    </Card>
                    <Modal open={showDelModal} onClose={() => setShowDelModal(false)}>
                      <Modal.Header className="text-2xl font-bold">
                        確定刪除 <span className="text-red-500 font-bold">{delLesson.title}</span> ?
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
                    <Link href="/lesson/add-lesson" passHref>
                      <div className="border-4 border-dashed rounded-lg w-96 h-52 bg-white hover:bg-yellow-50 flex justify-center items-center">
                        <div className="reactIcon">
                          <BiPlus size="3rem" />
                        </div>
                      </div>
                    </Link>
                  ) : null}
                </>
              </div>
            </div>
          </>
        )}
      </>
      {selectedLesson ? <Textbook /> : null}
    </>
  );
}

export default Lesson;
