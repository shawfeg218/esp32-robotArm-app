import AppContext from '@/contexts/AppContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useContext } from 'react';

export default function Textbook() {
  const supabase = useSupabaseClient();

  const { selectedLesson } = useContext(AppContext);
  const [texts, setTexts] = useState([]);

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

  return (
    <div>
      <div>
        {texts.map((paragraph) => (
          <div className="p-2" key={paragraph.paragraph_id}>
            <p>{paragraph.paragraph_content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
