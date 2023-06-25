import React, { useEffect, useRef, useState } from 'react';
import { Loading } from '@nextui-org/react';
import { BsMicFill } from 'react-icons/bs';
import { base64ToBlob } from '../../lib/base64ToBlob';

export default function AudioChat() {
  const ansAudioRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  // const [type, setType] = useState(null);
  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(null);
  const [ans, setAns] = useState(null);

  useEffect(() => {
    let type;
    if (audioData) {
      switch (audioData.type) {
        case 'audio/mp3':
          type = 'audio.mp3';
          break;
        case 'audio/mp4':
          type = 'audio.mp4';
          break;
        case 'audio/mpeg':
          type = 'audio.mpeg';
          break;
        case 'audio/mpga':
          type = 'audio.mpga';
          break;
        case 'audio/m4a':
          type = 'audio.m4a';
          break;
        case 'audio/wav':
          type = 'audio.wav';
          break;
        case 'audio/webm':
          type = 'audio.webm';
          break;
      }
      transcriptAudio(type);
    }
  }, [audioData]);

  useEffect(() => {
    if (text) {
      audioChat();
    }
  }, [text]);

  useEffect(() => {
    if (ansAudioUrl) {
      ansAudioRef.current.load();
    }
  }, [ansAudioUrl]);

  useEffect(() => {
    if (ansAudioRef.current) {
      ansAudioRef.current.oncanplaythrough = () => {
        ansAudioRef.current.play();
      };
    }
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = [
        'audio/wav',
        'audio/m4a',
        'audio/webm',
        'audio/mpeg',
        'audio/mpga',
        'audio/mp3',
        'audio/mp4',
      ];
      let mimeType;

      for (let i = 0; i < options.length; i++) {
        if (MediaRecorder.isTypeSupported(options[i])) {
          mimeType = options[i];
          console.log('mimeType: ', mimeType);
          break;
        }
      }

      if (mimeType) {
        const newMediaRecorder = new MediaRecorder(stream, { mimeType });
        let chunks = [];

        newMediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        newMediaRecorder.onstop = (e) => {
          const audioBlob = new Blob(chunks, { type: mimeType });
          setAudioData(audioBlob);
        };

        newMediaRecorder.start();
        setMediaRecorder(newMediaRecorder);
        setRecording(true);
      } else {
        throw new Error('Your device or browser do not support our recording feature');
      }
    } catch (error) {
      console.log('Error starting recording: ', error);
      console.log('Error name: ', error.name);
      console.log('Error message: ', error.message);
      console.log('Error code: ', error.code);
      window.alert('Error starting recording');
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  }

  async function transcriptAudio(type) {
    setLoading(true);
    console.log('type: ', type);
    const formData = new FormData();
    formData.append('file', audioData, type);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.log('Error transcribing audio:');
      console.log('Error message: ', error.message);
      console.log('Error type: ', error.type);
      console.log('Error param: ', error.param);
      console.log('Error code: ', error.code);
      window.alert('Error transcribing audio');
      setLoading(false);
    } else {
      const { text } = await response.json();
      console.log('text: ', text);
      setText(text);
    }
  }

  async function audioChat() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/audio-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: text,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      window.alert(error);
      setLoading(false);
    } else {
      const responseJson = await response.json();
      console.log('audioChat: ', responseJson);

      const { answer, answerAudio } = responseJson;
      setAns(answer);

      const audioBlob = base64ToBlob(answerAudio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      setAnsAudioUrl(audioUrl);

      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center text-black bg-red-300 w-full h-full">
      <div className="w-full h-full min-w-fit justify-center items-center p-5 text-center bg-white">
        <audio ref={ansAudioRef} src={ansAudioUrl} />
        <h1>Audio chat</h1>
        <div className="h-48 mt-4">
          <h3>{ans ? ans : 'Start your recording'}</h3>
        </div>
        <div className="w-full flex justify-center">
          {recording ? <div className="absolute top-80 z-0 spinner"></div> : null}
          <button
            className="bg-transparent border-0 flex justify-center p-1 z-10"
            onClick={recording ? stopRecording : startRecording}
          >
            <BsMicFill className=" w-16 h-16" />
          </button>
        </div>
        <div className="flex justify-center items-center m-8">
          {recording ? <Loading color="currentColor" type="points-opacity" /> : null}
        </div>
        <h2>{text ? `${text}` : ''}</h2>
        <div className="flex justify-center bg-red-300">
          {audioData && <audio controls src={URL.createObjectURL(audioData)} className="w-72" />}
        </div>
        <p>{loading ? 'Loading... ' : ''}</p>
      </div>
    </div>
  );
}
