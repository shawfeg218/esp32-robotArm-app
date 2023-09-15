import AppContext from '@/contexts/AppContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useContext } from 'react';
import { GrFormPrevious } from 'react-icons/gr';
import { Pagination } from '@nextui-org/react';
import { Button, Loading, Modal } from '@nextui-org/react';
import { base64ToBlob } from '@/lib/base64ToBlob';
import TextbookLoading from './TextbookLoading';
import { voiceProfiles } from '../audio-chat/AudioChat';

export default function Textbook() {
  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [loadingPPT, setLoadingPPT] = useState(true);

  const { selectedLesson, setSelectedLesson } = useContext(AppContext);
  const [dataArray, setDataArray] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [generating, setGenerating] = useState(false);

  const [contentAudioUrl, setContentAudioUrl] = useState(null);
  const [PptUrls, setPptUrls] = useState([]);

  const handleLeave = () => {
    setCurrentPage(0);
    setContentAudioUrl(null);
    setPptUrls([]);
    setDataArray([]);
    setSelectedLesson(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    downloadppt();
    // console.log('data:', dataArray);
  }, [dataArray]);

  // useEffect(() => {
  //   console.log('pptUrls:', PptUrls);
  // }, [PptUrls]);

  useEffect(() => {
    if (dataArray[currentPage]?.paragraph_audio) {
      const audioBase64 = dataArray[currentPage].paragraph_audio;
      const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      setContentAudioUrl(audioUrl);
    }
  }, [dataArray, currentPage]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('lesson_view')
        .select('*')
        .eq('lesson_id', selectedLesson)
        .order('paragraph_order', { ascending: true });

      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data) {
        setDataArray(data);
        console.log('data:', data);
      }
    } catch (error) {
      console.log('Error fetching texts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAudio = async () => {
    const voiceId = dataArray[0].lesson_voice_id;
    const voiceLang = voiceProfiles[voiceId].voiceLang;
    const voiceName = voiceProfiles[voiceId].voiceName;

    // console.log('voice id:', voiceId);
    // console.log('voiceLang: ' + voiceLang + ' voiceName: ' + voiceName);

    setGenerating(true);
    try {
      const text = dataArray[currentPage]?.paragraph_content;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceLang: voiceLang,
          voiceName: voiceName,
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
    setLoading(true);
    try {
      const id = dataArray[currentPage].paragraph_id;
      // console.log('id:', id);

      const { data, error } = await supabase
        .from('lesson_paragraphs')
        .update({ audio_string: audioBase64 })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContentAudioUrl(null);
      setDataArray([]);
      setPptUrls([]);
      fetchData();
      // console.log('updateAudio:', data);
    } catch (error) {
      console.log('Error updating audio:', error);
      throw error;
    }
  };

  const downloadppt = async () => {
    // after data is fetched, download ppt from supabase storage ppts bucket and setPptUrls with the urls
    setLoadingPPT(true);
    if (dataArray.length === 0) return;

    setPptUrls([]);
    try {
      for (let i = 0; i < dataArray.length; i++) {
        let pptPath = dataArray[i].paragraph_ppturl;
        console.log('download pptPath:', pptPath);
        if (pptPath !== '' && pptPath !== null) {
          const { data, error } = await supabase.storage.from('ppts').download(pptPath);
          if (error) {
            throw error;
          }
          const pptUrl = URL.createObjectURL(data);
          setPptUrls((prev) => {
            prev[i] = pptUrl;
            return prev;
          });
        } else {
          setPptUrls((prev) => {
            prev[i] = null;
            return prev;
          });
        }
      }
    } catch (error) {
      console.log('Error fetching ppts:', error);
    } finally {
      setLoadingPPT(false);
    }
  };

  return (
    <div className="w-full max-w-3xl min-h-screen">
      <div className="h-full">
        {/* Leave icon */}
        <div className="w-fit flex items-center hover:cursor-pointer" onClick={handleLeave}>
          <GrFormPrevious size="2rem" />
          <span>leave</span>
        </div>

        {loading || loadingPPT ? (
          <TextbookLoading />
        ) : (
          <section className="w-full mt-8">
            <div className="w-full p-4 pb-8 border border-solid border-slate-300 rounded-md">
              {/* Title & audio */}
              <div className="w-full flex justify-between items-center">
                <h2>{dataArray[currentPage]?.lesson_title}</h2>

                {/* audio */}
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
              </div>

              {/* Content */}
              <div className="mt-4">
                {PptUrls[currentPage] ? (
                  <div className="w-full">
                    <div className="w-full h-96 flex justify-center">
                      <img src={PptUrls[currentPage]} alt="ppt" className="h-full" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96">
                    <p className="h-full overflow-y-scroll">
                      {dataArray[currentPage]?.paragraph_content}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="w-full flex justify-center mt-4">
              <Pagination
                total={dataArray.length}
                initialPage={currentPage + 1}
                onChange={(page) => {
                  setContentAudioUrl(null);
                  setCurrentPage(page - 1);
                }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
