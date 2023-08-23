import AppContext from '@/contexts/AppContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useContext } from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Input, Button, Pagination } from '@nextui-org/react';

export default function Textbook() {
  const supabase = useSupabaseClient();

  const { selectedLesson, setSelectedLesson } = useContext(AppContext);
  const [texts, setTexts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [onSetPage, setOnSetPage] = useState(false);
  const [setPage, setSetPage] = useState();

  const handleLeave = () => {
    setSelectedLesson(null);
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_view')
        .select('*')
        .eq('lesson_id', selectedLesson)
        .order('paragraph_order', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setTexts(data);
        console.log('data:', data);
      }
    } catch (error) {
      console.log('Error fetching texts:', error);
    }
  };

  const nextPage = () => {
    if (currentPage < texts.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl min-h-screen">
      <div className="h-full">
        <div className="w-fit flex items-center hover:cursor-pointer" onClick={handleLeave}>
          <GrFormPrevious size="2rem" />
          <span>leave</span>
        </div>
        <section className="w-full h-96 mt-8 bg-slate-200">
          <div className="w-full h-full overflow-y-scroll p-4 border border-solid border-slate-300 rounded-md bg-yellow-50">
            <h2>{texts[currentPage]?.lesson_title}</h2>
            <p>{texts[currentPage]?.paragraph_content}</p>
          </div>
          <div className="w-full flex justify-center mt-4">
            <Pagination
              total={texts.length}
              initialPage={1}
              onChange={(page) => {
                setCurrentPage(page - 1);
              }}
            ></Pagination>
          </div>
        </section>
      </div>
    </div>
  );
}
