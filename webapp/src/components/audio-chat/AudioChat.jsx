import React, { useEffect, useRef, useState } from 'react';
import { Loading, Input, Button } from '@nextui-org/react';
import { BsMicFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { base64ToBlob } from '../../lib/base64ToBlob';
import PrettyTextArea from '../PrettyTextArea';

export default function AudioChat() {
  const ansAudioRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(null);
  const [enter, setEnter] = useState('');
  const [ans, setAns] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

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
      const newUserMessage = { role: 'user', content: text };
      let newConversationHistory = [...conversationHistory, newUserMessage];
      if (newConversationHistory.length > 10) {
        newConversationHistory = newConversationHistory.slice(-10);
      }
      setConversationHistory(newConversationHistory);
      setText(text);
    }
  }

  async function audioChat() {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/audio-chat`, {
      // const response = await fetch(`http://localhost:5000/api/audio-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: conversationHistory,
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
      const newAssistantMessage = { role: 'assistant', content: answer };
      let newConversationHistory = [...conversationHistory, newAssistantMessage];
      if (newConversationHistory.length > 10) {
        newConversationHistory = newConversationHistory.slice(-10);
      }
      setConversationHistory(newConversationHistory);
      setAns(answer);

      const audioBlob = base64ToBlob(answerAudio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      setAnsAudioUrl(audioUrl);

      setLoading(false);
      console.log('conversationHistory: ', conversationHistory);
    }
  }

  return (
    <div className="flex justify-center text-black w-full h-full mt-16">
      <div className="h-full w-96 max-w-2xl justify-center items-center text-center">
        <audio ref={ansAudioRef} src={ansAudioUrl} />
        <section>
          <h1>Audio chat</h1>
          <div className="overflow-auto h-32 my-4">
            {ans ? <h3>{ans}</h3> : <h3>Start your recording</h3>}
          </div>
          <div className="w-full flex justify-center">
            {recording ? <div className="absolute top-80 z-0 spinner"></div> : null}
            <button
              className="bg-transparent w-fit border-0 flex justify-center p-1 z-10"
              onClick={recording ? stopRecording : startRecording}
            >
              <BsMicFill className=" w-16 h-16" />
            </button>
          </div>
          <div className="flex justify-center items-center m-8">
            {recording ? <Loading color="currentColor" type="points-opacity" /> : null}
          </div>
          <h2 className="h-40 overflow-x-scroll">{text ? `${text}` : ''}</h2>
        </section>
        <section>
          <div className="relative mt-16">
            <div className="flex absolute bottom-0">
              <div className="flex w-80">
                <PrettyTextArea value={enter} onChange={(e) => setEnter(e.target.value)} />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  className="mt-0 w-16 h-fit border-0 bg-black text-white flex items-center justify-center disabled:bg-slate-200 disabled:cursor-default"
                  disabled={loading}
                  onClick={() => {
                    if (enter) {
                      const newUserMessage = { role: 'user', content: enter };
                      let newConversationHistory = [...conversationHistory, newUserMessage];
                      if (newConversationHistory.length > 10) {
                        newConversationHistory = newConversationHistory.slice(-10);
                      }
                      setConversationHistory(newConversationHistory);
                      setText(enter);
                      setEnter('');
                    }
                  }}
                >
                  <IoSend />
                </button>
              </div>
            </div>
            <div>
              {audioData && (
                <audio controls src={URL.createObjectURL(audioData)} className="w-72" />
              )}
            </div>
          </div>
        </section>
        <div>{loading ? 'Loading... ' : ''}</div>
      </div>
    </div>
  );
}
