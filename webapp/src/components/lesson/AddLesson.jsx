// webapp\src\components\lessons\AddLesson.jsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import PrettyTextArea from '../PrettyTextArea';
import { Button, Loading, Spacer } from '@nextui-org/react';

export default function AddLesson() {
  const supabase = useSupabaseClient();

  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [updating, setUpdating] = useState(false);

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [paragraphs, setParagraphs] = useState(['']);

  const handleParagraphChange = (e, paragraphIndex) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[paragraphIndex] = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (paragraphIndex) => {
    setParagraphs(paragraphs.filter((_, index) => index !== paragraphIndex));
  };

  const updateToDatabase = async () => {
    setUpdating(true);
    try {
      let { error: lessonError } = await supabase.from('lessons').insert([
        {
          title: lessonTitle,
          description: lessonDescription,
          inserted_at: new Date().toISOString(),
        },
      ]);

      if (lessonError) throw lessonError;

      let { data, error } = await supabase.from('lessons').select('id').eq('title', lessonTitle);
      let lessonId = data[0].id;

      for (let i = 0; i < paragraphs.length; i++) {
        let { error: paragraphError } = await supabase.from('lesson_paragraphs').insert([
          {
            lesson_id: lessonId,
            content: paragraphs[i],
            order_of_lesson: i + 1,
            inserted_at: new Date().toISOString(),
          },
        ]);

        if (paragraphError) throw paragraphError;
      }

      setSuccessMessage('Lesson successfully inserted into the database!');
    } catch (error) {
      console.log('Error: ', error.message);
      setMessage('There was an error inserting the lesson into the database!');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lessonTitle) {
      setMessage('必須填寫課文名稱!');
      setSuccessMessage(null);
      return;
    }

    for (let paragraph of paragraphs) {
      if (!paragraph) {
        setMessage('所有頁數必須有內容!');
        setSuccessMessage(null);
        return;
      }
    }

    setMessage(null);
    updateToDatabase();
  };

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className="mt-16 bg-slate-100 pt-4 px-2 pb-12 w-full max-w-3xl">
        <div className=" pb-4">
          <h2>新增課文</h2>
          <label>課文名稱</label>
          <PrettyTextArea
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            required
          />
          <Spacer y={1} />
          <label>課文大綱</label>
          <PrettyTextArea
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            required
          />
        </div>

        <div className="py-4">
          <h2>內容</h2>
          <div className="border-solid border-2 border-slate-300 rounded-md px-4 pt-2 pb-8">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <div className="my-6" key={paragraphIndex}>
                <div className="flex justify-between items-center">
                  <h3>頁數{paragraphIndex + 1}</h3>
                  {paragraphs.length > 1 && (
                    <div
                      className="flex justify-center hover:text-slate-300 hover:cursor-pointer"
                      onClick={() => removeParagraph(paragraphIndex)}
                    >
                      <AiOutlineDelete size="1.5rem" />
                    </div>
                  )}
                </div>
                <label>
                  <PrettyTextArea
                    value={paragraph}
                    onChange={(e) => handleParagraphChange(e, paragraphIndex)}
                    required
                  />
                </label>
              </div>
            ))}
            <Button className="w-full my-4" onClick={addParagraph}>
              增加頁數
            </Button>
          </div>
        </div>
        <div className="">
          <h2>
            課文名稱: <span>{lessonTitle}</span>
          </h2>
          <h2>
            總共
            <span> {paragraphs.length} </span>頁
          </h2>
          <p className="text-red-600">{message ? message : null}</p>
          <p className="text-green-600">{successMessage ? successMessage : null}</p>
        </div>
        <Button ghost className="hover:bg-blue-600 w-full" type="submit">
          {updating ? <Loading type="points-opacity" color="currentColor" size="sm" /> : 'submit'}
        </Button>
      </form>
    </div>
  );
}
