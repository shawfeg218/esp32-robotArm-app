import { Input, Spacer, Button, Loading, Modal } from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react';
import { parseSubtitles } from '../../lib/parseSubtitles';
import YouTube from 'react-youtube';
import Toast from '../Toast';

import { example } from '../../lib/example';

export default function VideoLearning() {
  const [key, setKey] = useState(null);
  const [res, setRes] = useState(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [urlStatus, setUrlStatus] = useState('default');

  const [videoTranscription, setVideoTranscription] = useState([]);
  const [videoTranslation, setVideoTranslation] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);

  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState('warning');
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

  useEffect(() => {
    if (key !== null) {
      setKeyStatus('success');
    } else {
      setKeyStatus('warning');
    }
  }, [key]);

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
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  async function transcribeAudioLink() {
    setLoading(true);
    if (!key) {
      setKeyStatus('error');
      setLoading(false);
      return;
    }
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
          apiKey: key,
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
        const transcriptionSubtitles = parseSubtitles(responseJson.transcription);
        const translationSubtitles = parseSubtitles(responseJson.translation);

        // const exampleData = example;

        // const transcriptionSubtitles = parseSubtitles(exampleData.transcription);
        // const translationSubtitles = parseSubtitles(exampleData.translation);
        // setVideoTranscription(transcriptionSubtitles);
        // setVideoTranslation(translationSubtitles);
        // setRes(JSON.stringify(exampleData, null, 2));
        // setLoading(false);

        // check res of transcription and translation
        if (transcriptionSubtitles.length !== translationSubtitles.length) {
          setShowToast(true);
          setToastMessage('Subtitle length mismatch');
          throw {
            message:
              'Subtitle length mismatch. Transcription length: ' +
              transcriptionSubtitles.length +
              '. Translation length: ' +
              translationSubtitles.length,
          };
        }

        setVideoTranscription(transcriptionSubtitles);
        setVideoTranslation(translationSubtitles);
        setRes(JSON.stringify(responseJson, null, 2));

        setLoading(false);
        setToastMessage('successfully');
        setToastType('check');
        setShowToast(true);
      }
    } catch (error) {
      console.log(error);
      window.alert(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full mt-4 flex justify-center">
      {showToast && <Toast message={toastMessage} icon={toastType} onClose={onCloseToast} />}
      <div>
        <section className="flex-col text-center ">
          <h1>Audio Translate</h1>
          <h2>whisper-1, gpt-3.5-turbo </h2>
          <Spacer y={2} />
          <Input
            labelPlaceholder="openai key"
            bordered
            clearable
            status={keyStatus}
            onChange={(e) => setKey(e.target.value)}
          />
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
            <Button bordered size="md" disabled={loading} onPress={transcribeAudioLink}>
              Transcribe Audio
            </Button>
          </div>
          <Spacer y={0.5} />
          <div className="mt-3 flex justify-center">
            <Button bordered size="md" disabled={loading} onPress={getVideoId}>
              Find Video
            </Button>
          </div>
        </section>

        <section className="flex-col justify-center items-center w-full">
          {loading ? (
            <div className="flex justify-center mt-6">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                {res ? (
                  <div className="bg-slate-100 my-10 overflow-scroll max-w-2xl p-2 max-h-80">
                    <p className="text-black w-full">{res}</p>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center">
                {res && videoTranscription.length > 0 ? (
                  <div className="w-full h-fit max-w-2xl bg-slate-100 p-4">
                    <ul className="text-black overflow-auto w-full h-80">
                      {videoTranscription.map((subtitle, index) => (
                        <li
                          className="border-solid border-x-0 border-t-0 border-b-slate-300"
                          key={index}
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
        </section>

        <div className="mt-10 flex justify-center">
          <YouTube
            videoId={videoId === '' ? '' : videoId}
            opts={{
              playerVars: { autoplay: 0 },
            }}
            onReady={(event) => setPlayer(event.target)}
          />

          {res === null ? null : (
            <div className="absolute bottom-11 inset-x-0 z-20 h-fit  flex justify-center mb-11 pr-5 -mr-5">
              <div className=" h-fit w-fit">
                <div className="flex justify-center p-1 bg-black bg-opacity-60 text-white">
                  <div>
                    <p>{videoTranscription[currentSubtitle].content}</p>
                    <p>{videoTranslation[currentSubtitle].content}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
