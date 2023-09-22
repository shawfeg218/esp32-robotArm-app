import React, { useEffect, useRef, useState } from "react";
import {
  Loading,
  Input,
  Modal,
  Dropdown,
  Button,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import { BsMicFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { AiOutlineSound } from "react-icons/ai";
import { BiVolumeMute } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { base64ToBlob } from "../../lib/base64ToBlob";
import PrettyTextArea from "../PrettyTextArea";
import { useContext } from "react";
import AppContext from "@/contexts/AppContext";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import AudioChatLoading from "./AudioChatLoading";

export const voiceProfiles = [
  {
    index: 0,
    label: "中文男性",
    voiceLang: "zh-TW",
    voiceName: "zh-TW-YunJheNeural",
  },
  {
    index: 1,
    label: "中文女性",
    voiceLang: "zh-TW",
    voiceName: "zh-TW-HsiaoChenNeural",
  },
  {
    index: 2,
    label: "英文男性",
    voiceLang: "en-US",
    voiceName: "en-US-DavisNeural",
  },
  {
    index: 3,
    label: "英文女性",
    voiceLang: "en-US",
    voiceName: "en-US-JennyNeural",
  },
];

export default function AudioChat() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const AccountRole = user?.user_metadata?.role;

  const {
    setSpeaking,
    setDancing,
    setMood,
    handleReset,
    targetAngles,
    setTargetAngles,
    speakInDuration,
  } = useContext(AppContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [delItems, setDelItems] = useState([]);

  const ansAudioRef = useRef(null);
  const textRef = useRef();

  const [recording, setRecording] = useState(false);
  const cancelRecordRef = useRef(false);
  const [audioData, setAudioData] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const [ansAudioUrl, setAnsAudioUrl] = useState(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [inputRole, setInputRole] = useState({
    role: "",
    prompt: "",
    voice_id: 0,
  });

  const [roles, setRoles] = useState([]);

  const [rolePrompt, setRolePrompt] = useState({});

  const [text, setText] = useState(null);
  const [enter, setEnter] = useState("");
  const [userM, setUserM] = useState("");
  const [ans, setAns] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // useEffect(() => {
  //   console.log('role: ', rolePrompt.role);
  //   console.log('prompt: ', rolePrompt.prompt);
  //   console.log('voice_id: ', rolePrompt.voice_id);
  // }, [rolePrompt]);

  // useEffect(() => {
  //   console.log('delItems: ', delItems);
  // }, [delItems]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (audioData) {
      transcriptAudio();
    }
  }, [audioData]);

  useEffect(() => {
    if (text) {
      audioChat();
      textRef.current = text;
      // console.log(text);
    }
  }, [text]);

  useEffect(() => {
    if (ansAudioUrl) {
      ansAudioRef.current.load();
      ansAudioRef.current.oncanplaythrough = () => {
        ansAudioRef.current.play();

        // check how long is the audio
        const duration = ansAudioRef.current.duration;
        // console.log('duration: ', duration);
        console.log("text in audio playing : ", textRef.current);
        handleAction(textRef.current, duration);
      };
      ansAudioRef.current.onerror = (e) => {
        console.error("Error playing audio:", e);
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
      console.log("recorder.onstop: ", cancelRecordRef.current);
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
    formData.append("file", audioData);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transcript-audio`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      console.log("Error transcribing audio:");
      console.log(errorResponse);
      window.alert("Error transcribing audio");
      setLoading(false);
    } else {
      const responseJson = await response.json();
      const responseText = responseJson.text;
      // console.log(responseText);
      const newUserMessage = { role: "user", content: responseText };
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
    // console.log('voiceLang: ', voiceProfiles[rolePrompt.voice_id].voiceLang);
    // console.log('voiceName: ', voiceProfiles[rolePrompt.voice_id].voiceName);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/audio-chat`,
      {
        // const response = await fetch(`http://localhost:5000/api/audio-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: rolePrompt.prompt,
          messages: conversationHistory,
          // voiceLang: rolePrompt.voice.voiceLang,
          // voiceName: rolePrompt.voice.voiceName,
          voiceLang: voiceProfiles[rolePrompt.voice_id].voiceLang,
          voiceName: voiceProfiles[rolePrompt.voice_id].voiceName,
        }),
      }
    );

    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      window.alert(error);
      setLoading(false);
      setText("");
    } else {
      const responseJson = await response.json();
      // console.log('audioChat: ', responseJson);

      const { answer, answerAudio } = responseJson;
      const newAssistantMessage = { role: "assistant", content: answer };
      let newConversationHistory = [
        ...conversationHistory,
        newAssistantMessage,
      ];
      if (newConversationHistory.length > 10) {
        newConversationHistory = newConversationHistory.slice(-10);
      }
      setConversationHistory(newConversationHistory);
      setAns(answer);
      // console.log(answer);

      const audioBlob = base64ToBlob(answerAudio, "audio/mp3");
      const audioUrl = URL.createObjectURL(audioBlob);
      setAnsAudioUrl(audioUrl);

      setLoading(false);
      setText("");
      // console.log('conversationHistory: ', conversationHistory);
    }
  }

  const fetchRoles = async () => {
    setPageLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_roles")
        .select("*")
        .order("id");

      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setRoles(data);
      setRolePrompt(data[0]);
    } catch (error) {
      console.log("Error fetching roles:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const insertRole = async () => {
    try {
      const { error: updateError } = await supabase.from("chat_roles").insert([
        {
          role: inputRole.role,
          prompt: inputRole.prompt,
          voice_id: inputRole.voice_id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (updateError) throw updateError;
      fetchRoles();
    } catch (error) {
      console.log("Error updating role:", error);
      window.alert("Error updating role");
    }
  };

  const deleteRole = async () => {
    // console.log('delItems in deleteRole: ', delItems);
    try {
      for (let i = 0; i < delItems.length; i++) {
        // console.log('delete index: ', delItems[i]);
        const { error: deleteError } = await supabase
          .from("chat_roles")
          .delete()
          .eq("id", delItems[i]);

        if (deleteError) throw deleteError;
        fetchRoles();
      }
    } catch (error) {
      console.log("Error deleting role:", error);
      window.alert("Error deleting role");
    }
  };

  function danceAtleastTen(duration) {
    // console.log('danceAtleastTen');
    if (duration < 10) {
      setDancing(true);
      setMood("happy");
      setTimeout(() => {
        setDancing(false);
        setMood("default");
      }, 10000);
    } else {
      setDancing(true);
      setMood("happy");
      setTimeout(() => {
        setDancing(false);
        setMood("default");
      }, duration * 1000);
    }
  }

  function raiseHand(action) {
    // console.log('raiseHand: ', action);
    if (
      action === "舉手" ||
      action === "举手" ||
      action === "raise hand" ||
      action === "Raise hand"
    ) {
      const newAngles = { ...targetAngles, ["F"]: 130 };
      setTargetAngles(newAngles);
    } else if (
      action === "舉雙手" ||
      action === "举双手" ||
      action === "raise two hands" ||
      action === "Raise two hands"
    ) {
      const newAngles = { ...targetAngles, ["B"]: 30, ["F"]: 130 };
      setTargetAngles(newAngles);
    }
  }

  function handleAction(text, duration) {
    console.log("handleAction text: ", text);
    console.log("handleAction duration: ", duration);
    const actionWords = [
      "跳舞",
      "舞",
      "音樂",
      "音乐",
      "music",
      "Music",
      "dance",
      "Dance",
      "舉手",
      "举手",
      "raise hand",
      "Raise hand",
      "舉雙手",
      "举双手",
      "raise two hands",
      "Raise two hands",
      "重置",
      "reset",
      "Reset",
    ];
    // check if text has some action words
    const action = actionWords.find((word) => text.includes(word));
    console.log("action: ", action);

    switch (action) {
      case "跳舞":
      case "舞":
      case "dance":
      case "Dance":
      case "音樂":
      case "音乐":
      case "music":
      case "Music":
        danceAtleastTen(duration);
        break;

      case "舉手":
      case "举手":
      case "舉雙手":
      case "举双手":
      case "raise hand":
      case "raise two hands":
      case "Raise hand":
      case "Raise two hands":
        raiseHand(action);
        break;

      case "重置":
      case "reset":
      case "Reset":
        handleReset();
        break;

      default:
        speakInDuration(duration);
        break;
    }
  }

  return (
    <div className="flex justify-center text-black w-full h-full mt-16">
      <div className="h-full w-full max-w-2xl justify-center items-center text-center relative">
        {pageLoading ? (
          <AudioChatLoading />
        ) : (
          <>
            <audio autoPlay muted={muted} ref={ansAudioRef} src={ansAudioUrl} />
            {ansAudioUrl ? (
              <button
                className="absolute w-fit right-0 top-2 bg-white flex items-center"
                onClick={toggleMute}
              >
                {muted ? (
                  <BiVolumeMute size={32} />
                ) : (
                  <AiOutlineSound size={32} />
                )}
              </button>
            ) : null}

            <section>
              <div className="flex justify-center items-center">
                <div>
                  <h1 className="mr-3">{rolePrompt.role}</h1>
                </div>

                {/* select role */}
                <Dropdown>
                  <Dropdown.Button className="z-0 mt-0" flat>
                    {rolePrompt.role}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Single role section"
                    onAction={(key) => {
                      const role = roles.find((role) => role.role === key);

                      if (key === "add") {
                        setShowCreateModal(true);
                      } else if (key === "delete") {
                        setShowDelModal(true);
                      } else if (role) {
                        setRolePrompt(role);
                        // console.log('selected role: ', role);
                        setAns(null);
                        setUserM("");
                        setConversationHistory([]);
                      }
                    }}
                  >
                    {roles.map((role) => (
                      <Dropdown.Item key={role.role}>{role.role}</Dropdown.Item>
                    ))}
                    {AccountRole === "teacher" && (
                      <Dropdown.Item color="primary" key="add">
                        新增
                      </Dropdown.Item>
                    )}
                    {AccountRole === "teacher" && (
                      <Dropdown.Item color="error" key="delete">
                        刪除
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {/* create new role modal */}
                <Modal
                  open={showCreateModal}
                  onClose={() => setShowCreateModal(false)}
                >
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
                      <Dropdown.Button flat>
                        {voiceProfiles[inputRole.voice_id].label}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Voice profile selection"
                        onAction={(key) => {
                          console.log("selectedVoiceProfile: ", key);
                          setInputRole({
                            ...inputRole,
                            voice_id: key,
                          });
                        }}
                      >
                        {voiceProfiles.map((profile) => (
                          <Dropdown.Item key={profile.index}>
                            {profile.label}
                          </Dropdown.Item>
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
                          if (inputRole.role === "") {
                            window.alert("請輸入角色名稱");
                          } else if (inputRole.prompt === "") {
                            window.alert("請輸入Prompt");
                          } else {
                            console.log("inputRole: ", inputRole);
                            insertRole();
                            // setRoles([...roles, inputRole]);
                            setInputRole({ role: "", prompt: "", voice_id: 0 });
                            setShowCreateModal(false);
                          }
                        }}
                      >
                        確定
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setInputRole({ role: "", prompt: "", voice_id: 0 });
                          setShowCreateModal(false);
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </Modal.Footer>
                </Modal>

                {/* delete role modal */}
                <Modal
                  open={showDelModal}
                  onClose={() => setShowDelModal(false)}
                >
                  <Modal.Header className="text-xl">刪除角色</Modal.Header>
                  <Modal.Body>
                    <div className="h-36 overflow-y-scroll">
                      <Checkbox.Group
                        aria-label="check delete items"
                        orientation="vertical"
                        value={delItems}
                        onChange={setDelItems}
                      >
                        {roles.map((role) => (
                          <Checkbox key={role.id} value={role.id}>
                            {role.role}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="flex w-full justify-between">
                      <Button
                        disabled={delItems.length === 0}
                        size="sm"
                        onClick={() => {
                          deleteRole();
                          setDelItems([]);
                          setShowDelModal(false);
                        }}
                      >
                        確認
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setDelItems([]);
                          setShowDelModal(false);
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
                    className="absolute mt-0 sm:right-40 right-10 w-fit text-center text-3xl bg-transparent border-0"
                    onClick={cancelRecording}
                  >
                    <RxCross2 />
                  </button>
                )}

                {/* recording spinner */}
                {recording ? (
                  <div className="absolute bottom-2 z-0 spinner"></div>
                ) : null}
                <button
                  className="bg-transparent w-fit border-0 flex justify-center p-1 z-10"
                  onClick={recording ? stopRecording : startRecording}
                >
                  <BsMicFill className=" w-16 h-16" />
                </button>
              </div>
              <div className="flex justify-center items-center m-8">
                {recording ? (
                  <Loading color="currentColor" type="points-opacity" />
                ) : null}
              </div>
              <h2 className="h-40 overflow-x-scroll break-words text-center">
                {userM ? `${userM}` : ""}
              </h2>
            </section>

            <section>
              <div className="relative mt-16">
                <div className="flex justify-center">
                  <div className="flex absolute bottom-0">
                    <div className="flex w-80 z-20">
                      <PrettyTextArea
                        value={enter}
                        onChange={(e) => setEnter(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        className="mt-0 w-16 h-fit border-0 bg-black text-white flex items-center justify-center disabled:bg-slate-200 disabled:cursor-default"
                        disabled={loading}
                        onClick={() => {
                          if (enter) {
                            const newUserMessage = {
                              role: "user",
                              content: enter,
                            };
                            let newConversationHistory = [
                              ...conversationHistory,
                              newUserMessage,
                            ];
                            if (newConversationHistory.length > 10) {
                              newConversationHistory =
                                newConversationHistory.slice(-10);
                            }
                            setConversationHistory(newConversationHistory);
                            setText(enter);
                            setEnter("");
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
            <div>{loading ? "Loading... " : ""}</div>
          </>
        )}
      </div>
    </div>
  );
}
