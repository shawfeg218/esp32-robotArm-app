import React, { useEffect, useRef, useState } from 'react';
import { Loading, Input, Button } from '@nextui-org/react';
import { BsMicFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { AiOutlineSound } from 'react-icons/ai';
import { BiVolumeMute } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { base64ToBlob } from '../../lib/base64ToBlob';
import PrettyTextArea from '../PrettyTextArea';

export default function AudioChat() {
  const ansAudioRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const cancelRecordRef = useRef(false);
  const [audioData, setAudioData] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(null);
  const [enter, setEnter] = useState('');
  const [ans, setAns] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    if (audioData) {
      transcriptAudio();
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
      ansAudioRef.current.oncanplaythrough = () => {
        ansAudioRef.current.play();
      };
      ansAudioRef.current.onerror = (e) => {
        console.error('Error playing audio:', e);
      };
    }
  }, [ansAudioUrl]);

  function toggleMute() {
    if (ansAudioRef.current) {
      ansAudioRef.current.muted = !ansAudioRef.current.muted;
      setMuted(!muted);
    }
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    let chunks = [];

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = (e) => {
      console.log('recorder.onstop: ', cancelRecordRef.current);
      if (cancelRecordRef.current === false) {
        const blob = new Blob(chunks);
        setAudioData(blob);
      }
      chunks = [];
      cancelRecordRef.current = false;
    };

    setRecorder(recorder);
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    if (recorder) {
      recorder.stop();
      setRecorder(null);
      setRecording(false);
    }
  }

  function cancelRecording() {
    if (recorder) {
      cancelRecordRef.current = true;
      recorder.stop();
      setRecorder(null);
      setRecording(false);
    }
  }

  async function transcriptAudio() {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', audioData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transcript-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log('Error transcribing audio:');
      console.log(errorResponse);
      window.alert('Error transcribing audio');
      setLoading(false);
    } else {
      const responseJson = await response.json();
      const responseText = responseJson.text;
      // console.log(responseText);
      const newUserMessage = { role: 'user', content: responseText };
      let newConversationHistory = [...conversationHistory, newUserMessage];
      if (newConversationHistory.length > 10) {
        newConversationHistory = newConversationHistory.slice(-10);
      }
      setConversationHistory(newConversationHistory);
      setText(responseText);
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
      // console.log('audioChat: ', responseJson);

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
      // console.log('conversationHistory: ', conversationHistory);
    }
  }

  return (
    <div className="flex justify-center text-black w-full h-full mt-16">
      <div className="h-full w-96 max-w-2xl justify-center items-center text-center relative">
        <audio autoPlay muted={muted} ref={ansAudioRef} src={ansAudioUrl} />
        {ansAudioUrl ? (
          <button
            className="absolute w-fit right-0 top-2 bg-white flex items-center"
            onClick={toggleMute}
          >
            {muted ? <BiVolumeMute size={32} /> : <AiOutlineSound size={32} />}
          </button>
        ) : null}
        <section>
          <h1>Audio chat</h1>
          <div className="overflow-auto h-32 my-4">
            {ans ? <h3>{ans}</h3> : <h3>開始對話...</h3>}
          </div>
          <div className="w-full flex justify-center relative">
            {recording && (
              <button
                className="absolute mt-0 right-0 w-4 text-center text-3xl bg-transparent border-0"
                onClick={cancelRecording}
              >
                <RxCross2 />
              </button>
            )}
            {recording ? <div className="absolute bottom-2 z-0 spinner"></div> : null}
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
          <h2 className="h-40 overflow-x-scroll break-words text-center">
            {text ? `${text}` : ''}
          </h2>
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
            {/* <div>
              {audioData && (
                <audio controls src={URL.createObjectURL(audioData)} className="w-72" />
              )}
            </div> */}
          </div>
        </section>
        <div>{loading ? 'Loading... ' : ''}</div>
      </div>
    </div>
  );
}
