import { Input, Spacer, Button, Loading, Modal } from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import { parseTranscription, parseTranslation, generateContent } from '../../lib/parseSubtitles';
import YouTube from 'react-youtube';
import Toast from '../Toast';
// import { example } from '../../lib/example';
import { base64ToBlob } from '../../lib/base64ToBlob';
import { useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import { AiOutlineSound } from 'react-icons/ai';
import { BiVolumeMute } from 'react-icons/bi';

export default function VideoLearning() {
  const { setSpeaking, setMood } = useContext(AppContext);
  const [res, setRes] = useState(null);

  const [ans, setAns] = useState(null);
  const ansAudioRef = useRef(null);
  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [learningLoading, setLearningLoading] = useState(false);
  const [muted, setMuted] = useState(true);

  const [videoUrl, setVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [urlStatus, setUrlStatus] = useState('default');

  const [videoTranscription, setVideoTranscription] = useState([]);
  const [videoTranslation, setVideoTranslation] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [player, setPlayer] = useState(null);

  const onCloseToast = () => {
    setShowToast(false);
    setToastMessage('');
    setToastType('');
  };

  const onCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const updateTime = () => {
    if (player) {
      setCurrentTime(player.getCurrentTime());
    }
  };

  const getVideoId = () => {
    if (!videoUrl) {
      return;
    }
    try {
      let Id = new URL(videoUrl).searchParams.get('v');
      setVideoId(Id);
    } catch (error) {
      setVideoId('');
    }
  };

  // for update video playing time
  useEffect(() => {
    for (let i = 0; i < videoTranscription.length; i++) {
      if (
        currentTime >= videoTranscription[i].startTimestamp &&
        currentTime <= videoTranscription[i].endTimestamp
      ) {
        setCurrentSubtitle(i);
        break;
      }
    }
  }, [currentTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTime();
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    if (ansAudioUrl) {
      ansAudioRef.current.load();
      ansAudioRef.current.oncanplaythrough = () => {
        ansAudioRef.current.play();

        // check how long is the audio
        const duration = ansAudioRef.current.duration;
        console.log('duration: ', duration);
        speakInDuration(duration);
      };
    }
  }, [ansAudioUrl]);

  const triggerMute = () => {
    if (ansAudioRef.current) {
      ansAudioRef.current.muted = !ansAudioRef.current.muted;
      setMuted(!muted);
    }
  };

  async function transcribeAudioLink() {
    setLoading(true);

    if (!videoUrl) {
      setLoading(false);
      setUrlStatus('error');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/video-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: videoUrl,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw {
          name: errorResponse.name,
          message: errorResponse.message,
        };
      } else {
        const responseJson = await response.json();
        const transcriptionSubtitles = parseTranscription(responseJson.transcription);
        const translationSubtitles = parseTranslation(responseJson.translation);
        setVideoTranscription(transcriptionSubtitles);
        setVideoTranslation(translationSubtitles);
        setRes(JSON.stringify(responseJson, null, 2));

        // const exampleData = example;
        // const transcriptionSubtitles = parseTranscription(exampleData.transcription);
        // const translationSubtitles = parseTranslation(exampleData.translation);
        // setVideoTranscription(transcriptionSubtitles);
        // setVideoTranslation(translationSubtitles);
        // setRes(JSON.stringify(exampleData, null, 2));
        // setLoading(false);

        // check res of transcription and translation
        if (transcriptionSubtitles.length !== translationSubtitles.length) {
          throw {
            name: 'Subtitle length mismatch',
            message:
              'Transcription length: ' +
              transcriptionSubtitles.length +
              'Translation length: ' +
              translationSubtitles.length,
          };
        }

        setLoading(false);
        setToastMessage('successfully');
        setToastType('check');
        setShowToast(true);
      }
    } catch (error) {
      setShowModal(true);
      if (error.name) {
        setModalHeader(error.name);
      }
      if (error.message) {
        setModalMessage(error.message);
      }
      setLoading(false);
    }
  }

  async function contentLearning() {
    setLearningLoading(true);
    try {
      const content = generateContent(videoTranscription);
      // const response = await fetch(`http://localhost:5000/api/content-learning`, {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/content-learning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw {
          name: errorResponse.name,
          message: errorResponse.message,
        };
      } else {
        const responseJson = await response.json();
        console.log('audioChat: ', responseJson);

        const { answer, answerAudio } = responseJson;
        setAns(answer);

        const audioBlob = base64ToBlob(answerAudio, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);
        setAnsAudioUrl(audioUrl);

        setLearningLoading(false);
      }
    } catch (error) {
      setShowModal(true);
      if (error.name) {
        setModalHeader(error.name);
      }
      if (error.message) {
        setModalMessage(error.message);
      }
      setLearningLoading(false);
    }
  }

  const playTime = (time) => {
    if (player) {
      player.seekTo(time, true);
      player.playVideo();
    }
  };

  function speakInDuration(duration) {
    console.log('speakInDuration');
    setSpeaking(true);
    setMood('speak');
    setTimeout(() => {
      setSpeaking(false);
      setMood('default');
    }, duration * 1000);
  }

  return (
    <div className="w-full mt-4 flex justify-center overflow-x-scroll">
      {showToast && <Toast message={toastMessage} icon={toastType} onClose={onCloseToast} />}
      <audio autoPlay muted={muted} ref={ansAudioRef} src={ansAudioUrl} />
      <div>
        <section className="flex-col text-center ">
          <h1>影片語言學習</h1>
          <h2></h2>

          <Spacer y={2} />

          <Input
            clearable
            bordered
            labelPlaceholder="youtube video link"
            status={urlStatus}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <Spacer y={0.5} />
          <div className="mt-3 flex justify-center">
            <Button bordered size="md" disabled={loading} onPress={getVideoId}>
              搜尋
            </Button>
          </div>
          <Spacer y={0.5} />
          <div className="mt-3 flex justify-center">
            <Button
              bordered
              size="md"
              disabled={loading || learningLoading}
              onPress={transcribeAudioLink}
            >
              翻譯影片
            </Button>
          </div>

          {/* Error Modal */}
          <Modal open={showModal} onClose={onCloseModal}>
            <Modal.Header>
              <h1 className="text-3xl text-red-700">{modalHeader}</h1>
            </Modal.Header>
            <Modal.Body>
              <h1 className="text-xl">{modalMessage}</h1>
            </Modal.Body>
            <Modal.Footer className="justify-center">
              <Button onClick={onCloseModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </section>

        {/* Subtitle */}
        <section className="flex-col justify-center items-center w-full">
          {loading ? (
            <div className="flex justify-center mt-6">
              <Loading />
            </div>
          ) : (
            <>
              <Spacer y={2} />

              <div className="flex justify-center">
                {res && videoTranscription.length > 0 ? (
                  <div className="w-full h-fit max-w-2xl bg-slate-100 p-2">
                    <ul className="text-black overflow-auto w-full h-80">
                      {videoTranscription.map((subtitle, index) => (
                        <li
                          className=" border-solid border-x-0 border-t-0 border-b-slate-300 hover:cursor-pointer hover:bg-slate-200 active:bg-slate-200 p-2"
                          key={index}
                          onClick={
                            // play the time of the subtitle
                            () => {
                              // console.log('subtitle: ', subtitle.startTimestamp);
                              playTime(subtitle.startTimestamp);
                            }
                          }
                        >
                          <p>{subtitle.number}</p>
                          <p>{subtitle.content}</p>
                          <p>{videoTranslation[index]?.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          )}

          <>
            {videoTranscription.length !== 0 && (
              <>
                <Spacer y={0.5} />
                <div className="mt-3 flex justify-center">
                  <Button
                    bordered
                    size="md"
                    disabled={learningLoading || loading}
                    onClick={contentLearning}
                  >
                    Learning
                  </Button>
                </div>
              </>
            )}
          </>
        </section>

        {/* Learning content */}
        <section className="relative flex-col justify-center items-center w-full pt-4 mt-6">
          {ans && !loading && !learningLoading && (
            <button
              className="absolute flex justify-center items-center right-0 top-0 w-fit mt-0 p-3 border-0 bg-slate-100"
              onClick={triggerMute}
            >
              {muted ? <BiVolumeMute size={28} /> : <AiOutlineSound size={28} />}
            </button>
          )}
          {learningLoading ? (
            <div className="flex justify-center mt-6">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                {ans ? (
                  <div className="bg-slate-100 my-10 overflow-scroll max-w-2xl p-2 max-h-80">
                    <p className="text-black w-full">
                      {ans.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </section>

        {/* Video */}
        <div className="my-10 flex justify-center">
          <YouTube
            videoId={videoId === '' ? '' : videoId}
            opts={{
              playerVars: { autoplay: 0 },
            }}
            onReady={(event) => setPlayer(event.target)}
          />

          {/* Dynamic Subtitle */}
          {res === null ? null : (
            <div className="absolute bottom-48 h-fit w-fit">
              <div className="flex justify-center p-1 bg-black bg-opacity-60 text-white">
                <div>
                  <p>{videoTranscription[currentSubtitle].content}</p>
                  <p>{videoTranslation[currentSubtitle].content}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
