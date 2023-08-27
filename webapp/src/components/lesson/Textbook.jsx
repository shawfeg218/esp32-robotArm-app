import AppContext from '@/contexts/AppContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useContext } from 'react';
import { GrFormPrevious } from 'react-icons/gr';
import { Pagination } from '@nextui-org/react';
import { Button, Loading } from '@nextui-org/react';
import { base64ToBlob } from '@/lib/base64ToBlob';

export default function Textbook() {
  const supabase = useSupabaseClient();

  const { selectedLesson, setSelectedLesson } = useContext(AppContext);
  const [texts, setTexts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [generating, setGenerating] = useState(false);
  const [contentAudioUrl, setContentAudioUrl] = useState(null);

  const handleLeave = () => {
    setSelectedLesson(null);
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  useEffect(() => {
    if (texts[currentPage]?.paragraph_audio) {
      const audioBase64 = texts[currentPage].paragraph_audio;
      const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      setContentAudioUrl(audioUrl);
    }
  }, [texts, currentPage]);

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

  const generateAudio = async () => {
    setGenerating(true);
    try {
      const text = texts[currentPage]?.paragraph_content;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceLang: 'zh-TW',
          voiceName: 'zh-TW-YunJheNeural',
        }),
      });

      if (!response.ok) {
        throw new Error('Error generating audio');
      }

      const responseJson = await response.json();
      const { audioBase64 } = responseJson;
      // console.log('responseJson: ', responseJson);
      // console.log('audioBase64: ', audioBase64);

      updateAudio(audioBase64);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const updateAudio = async (audioBase64) => {
    try {
      const id = texts[currentPage].paragraph_id;
      // console.log('id:', id);

      const { data, error } = await supabase
        .from('lesson_paragraphs')
        .update({ audio_string: audioBase64 })
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchTexts();
      // console.log('updateAudio:', data);
    } catch (error) {
      console.log('Error updating audio:', error);
      throw error;
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
            <div className="flex justify-between items-center">
              <h2>{texts[currentPage]?.lesson_title}</h2>
              <>
                {contentAudioUrl === null ? (
                  <Button size="sm" disabled={generating} onClick={generateAudio}>
                    {generating ? (
                      <Loading type="spinner" color="currentColor" size="sm" />
                    ) : (
                      '生成語音'
                    )}
                  </Button>
                ) : (
                  <audio controls src={contentAudioUrl} />
                )}
              </>
              {/* <audio controls src={contentAudioUrl} /> */}
            </div>
            <p>{texts[currentPage]?.paragraph_content}</p>
          </div>
          <div className="w-full flex justify-center mt-4">
            <Pagination
              total={texts.length}
              initialPage={1}
              onChange={(page) => {
                setContentAudioUrl(null);
                setCurrentPage(page - 1);
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
