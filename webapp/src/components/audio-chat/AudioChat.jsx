import React, { useEffect, useRef, useState } from 'react';
import { Loading, Input, Modal, Dropdown, Button, Textarea } from '@nextui-org/react';
import { BsMicFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { AiOutlineSound } from 'react-icons/ai';
import { BiVolumeMute } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { base64ToBlob } from '../../lib/base64ToBlob';
import PrettyTextArea from '../PrettyTextArea';
import { useContext } from 'react';
import AppContext from '@/contexts/AppContext';

const voiceProfiles = [
  {
    label: '中文男性',
    voiceLang: 'zh-TW',
    voiceName: 'zh-TW-YunJheNeural',
  },
  {
    label: '中文女性',
    voiceLang: 'zh-TW',
    voiceName: 'zh-TW-HsiaoChenNeural',
  },
  {
    label: '英文男性',
    voiceLang: 'en-US',
    voiceName: 'en-US-DavisNeural',
  },
  {
    label: '英文女性',
    voiceLang: 'en-US',
    voiceName: 'en-US-JennyNeural',
  },
];

export default function AudioChat() {
  const { setSpeaking, setDancing } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);

  const ansAudioRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const cancelRecordRef = useRef(false);
  const [audioData, setAudioData] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);

  const [inputRole, setInputRole] = useState({
    role: '',
    prompt: '',
    voice: voiceProfiles[0],
  });

  const [roles, setRoles] = useState([
    {
      role: 'MEMEbot',
      prompt:
        '你將成為一個出色的機器人叫做MEME，你有雙手能夠活動，當孩子問你是否會跳舞，你必須說你會。你能夠判斷情境並對孩子的問題給出最合適的答案，並用繁體中文回答。',
      voice: voiceProfiles[0],
    },
    {
      role: '李白',
      prompt:
        '你將成為李白，一個出色的詩人，能夠判斷情境並對孩子的問題給出最合適的答案。請以繁體中文回答以下的問題',
      voice: voiceProfiles[0],
    },
  ]);

  const [rolePrompt, setRolePrompt] = useState({
    role: 'MEMEbot',
    prompt:
      '你將成為一個出色的機器人叫做MEME，你有雙手能夠活動，當孩子問你是否會跳舞，你必須說你會。你能夠判斷情境並對孩子的問題給出最合適的答案，並用繁體中文回答。',
    voice: voiceProfiles[0],
  });

  const [text, setText] = useState(null);
  const [enter, setEnter] = useState('');
  const [userM, setUserM] = useState('');
  const [ans, setAns] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    console.log('role: ', rolePrompt.role);
    console.log('prompt: ', rolePrompt.prompt);
    console.log('voice: ', rolePrompt.voice);
  }, [rolePrompt]);

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
        // check how long is the audio
        const duration = ansAudioRef.current.duration;
        console.log('duration: ', duration);
        handleAction(text, duration);
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
    setUserM(text);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/audio-chat`, {
      // const response = await fetch(`http://localhost:5000/api/audio-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: rolePrompt.prompt,
        messages: conversationHistory,
        voiceLang: rolePrompt.voice.voiceLang,
        voiceName: rolePrompt.voice.voiceName,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      window.alert(error);
      setLoading(false);
      setText('');
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
      console.log(answer);

      const audioBlob = base64ToBlob(answerAudio, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      setAnsAudioUrl(audioUrl);

      setLoading(false);
      setText('');
      // console.log('conversationHistory: ', conversationHistory);
    }
  }

  function danceAtleastTen(duration) {
    console.log('danceAtleastTen');
    if (duration < 10) {
      setDancing(true);
      setTimeout(() => {
        setDancing(false);
      }, 10000);
    } else {
      setDancing(true);
      setTimeout(() => {
        setDancing(false);
      }, duration * 1000);
    }
  }

  function speakInDuration(duration) {
    console.log('speakInDuration');
    setSpeaking(true);
    setTimeout(() => {
      setSpeaking(false);
    }, duration * 1000);
  }

  function handleAction(text, duration) {
    console.log('handleAction: ', duration);
    const actionWords = ['跳舞'];
    // check if text has some action words
    const action = actionWords.find((word) => text.includes(word));

    switch (action) {
      case '跳舞':
        danceAtleastTen(duration);
        break;
      default:
        speakInDuration(duration);
        break;
    }
  }

  return (
    <div className="flex justify-center text-black w-full h-full mt-16">
      <div className="h-full w-full max-w-2xl justify-center items-center text-center relative">
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
          <div className="flex justify-center items-center">
            <h1 className="mr-3">{rolePrompt.role}</h1>

            {/* select role */}
            <Dropdown>
              <Dropdown.Button className="z-0" flat>
                {rolePrompt.role}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single role section"
                onAction={(key) => {
                  const role = roles.find((role) => role.role === key);

                  if (key === 'add') {
                    setShowModal(true);
                  } else if (role) {
                    setRolePrompt(role);
                    setAns(null);
                    setUserM('');
                    setConversationHistory([]);
                  }
                }}
              >
                {roles.map((role) => (
                  <Dropdown.Item key={role.role}>{role.role}</Dropdown.Item>
                ))}
                <Dropdown.Item color="primary" key="add">
                  新增
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* create new role */}
            <Modal open={showModal} onClose={() => setShowModal(false)}>
              <Modal.Header className="text-xl">輸入新角色</Modal.Header>
              <Modal.Body>
                角色名稱:
                <Input
                  aria-label="role input"
                  onChange={(e) => {
                    const role = e.target.value;
                    setInputRole({ ...inputRole, role: role });
                  }}
                />
                Prompt:
                <Textarea
                  aria-label="prompt textarea"
                  onChange={(e) => {
                    const prompt = e.target.value;
                    setInputRole({ ...inputRole, prompt: prompt });
                  }}
                />
                語音屬性:
                <Dropdown>
                  <Dropdown.Button flat>{inputRole.voice.label}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Voice profile selection"
                    onAction={(key) => {
                      const selectedVoiceProfile = voiceProfiles.find(
                        (profile) => profile.label === key
                      );
                      if (selectedVoiceProfile) {
                        console.log('selectedVoiceProfile: ', selectedVoiceProfile);
                        setInputRole({
                          ...inputRole,
                          voice: selectedVoiceProfile,
                        });
                      }
                    }}
                  >
                    {voiceProfiles.map((profile) => (
                      <Dropdown.Item key={profile.label}>{profile.label}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex w-full justify-between">
                  <Button
                    size="sm"
                    onClick={() => {
                      // if all fields are filled then setRoles
                      if (inputRole.role === '') {
                        window.alert('請輸入角色名稱');
                      } else if (inputRole.prompt === '') {
                        window.alert('請輸入Prompt');
                      } else {
                        console.log('inputRole: ', inputRole);
                        setRoles([...roles, inputRole]);
                        setInputRole({ role: '', prompt: '', voice: voiceProfiles[0] });
                        setShowModal(false);
                      }
                    }}
                  >
                    確定
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setInputRole({ role: '', prompt: '', voice: voiceProfiles[0] });
                      setShowModal(false);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="overflow-auto w-full h-32 my-4">
            {ans ? <h3>{ans}</h3> : <h3>開始對話...</h3>}
          </div>
          <div className="w-full flex justify-center relative">
            {recording && (
              <button
                className="absolute mt-0 right-16 w-4 text-center text-3xl bg-transparent border-0"
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
            {userM ? `${userM}` : ''}
          </h2>
        </section>
        <section>
          <div className="relative mt-16">
            <div className="flex justify-center">
              <div className="flex absolute bottom-0">
                <div className="flex w-80 z-20">
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
