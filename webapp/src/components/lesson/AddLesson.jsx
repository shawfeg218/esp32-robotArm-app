// webapp\src\components\lessons\AddLesson.jsx
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { GrDocumentUpload } from 'react-icons/gr';
import PrettyTextArea from '../PrettyTextArea';
import { Button, Loading, Spacer, Dropdown } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { voiceProfiles } from '../audio-chat/AudioChat';

export default function AddLesson() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [voiceId, setVoiceId] = useState(0);
  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [updating, setUpdating] = useState(false);
  const [finishDB, setFinishDB] = useState(false);

  const [uploadingPPT, setUploadingPPT] = useState(false);
  const [loadingWithBucket, setLoadingWithBucket] = useState(false);

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [paragraphs, setParagraphs] = useState(['']);

  const [pptUrls, setPptUrls] = useState(['']);

  // for previewing ppt on webpage
  const [pptFilesUrl, setPptFilesUrl] = useState(['']);

  // After user uploads a file to supabase storage buckets, the pptUrls state will be updated.
  // For previewing the ppt file on webpage, this useEffect will download the ppt file from the storage bucket by the filePath that just updated in the pptUrls array and store it in pptFilesUrl state.
  useEffect(() => {
    if (pptUrls.length >= 1) {
      for (let i = 0; i < pptUrls.length; i++) {
        if (pptUrls[i] !== '' && pptFilesUrl[i] === '') {
          downloadPPT(pptUrls[i]);
        }
      }
    }
  }, [pptUrls]);

  // useEffect(() => {
  //   console.log('pptUrls: ', pptUrls);
  // }, [pptUrls]); // for debugging

  // useEffect(() => {
  //   console.log('pptFilesUrl: ', pptFilesUrl);
  // }, [pptFilesUrl]); // for debugging

  // useEffect(() => {
  //   console.log('voiceId: ', voiceId);
  //   console.log('chosen voice', voiceProfiles[voiceId].label);
  // }, [voiceId]);

  const handleParagraphChange = (e, paragraphIndex) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[paragraphIndex] = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
    setPptUrls([...pptUrls, '']);
    setPptFilesUrl([...pptFilesUrl, '']);
  };

  const removeParagraph = (paragraphIndex) => {
    // If the paragraph had uploaded a ppt, delete the ppt file from supabase storage bucket
    if (pptUrls[paragraphIndex] !== '') {
      deletePPT(pptUrls[paragraphIndex]);
    }

    setParagraphs(paragraphs.filter((_, index) => index !== paragraphIndex));

    setPptUrls((prevPptUrls) => {
      const newPptUrls = [...prevPptUrls];
      newPptUrls.splice(paragraphIndex, 1);
      return newPptUrls.map((url, index) => {
        if (index >= paragraphIndex) {
          return url !== '' ? url : prevPptUrls[index + 1];
        }
        return url;
      });
    });

    setPptFilesUrl((prevPptFilesUrl) => {
      const newPptFilesUrl = [...prevPptFilesUrl];
      newPptFilesUrl.splice(paragraphIndex, 1);
      return newPptFilesUrl.map((url, index) => {
        if (index >= paragraphIndex) {
          return url !== '' ? url : prevPptFilesUrl[index + 1];
        }
        return url;
      });
    });
  };

  function moveParagraphUp(index) {
    setParagraphs((prevParagraphs) => {
      const newParagraphs = [...prevParagraphs];
      const temp = newParagraphs[index - 1];
      newParagraphs[index - 1] = newParagraphs[index];
      newParagraphs[index] = temp;
      return newParagraphs;
    });

    setPptUrls((prevPptUrls) => {
      const newPptUrls = [...prevPptUrls];
      const temp = newPptUrls[index - 1];
      newPptUrls[index - 1] = newPptUrls[index];
      newPptUrls[index] = temp;
      return newPptUrls;
    });

    setPptFilesUrl((prevPptFilesUrl) => {
      const newPptFilesUrl = [...prevPptFilesUrl];
      const temp = newPptFilesUrl[index - 1];
      newPptFilesUrl[index - 1] = newPptFilesUrl[index];
      newPptFilesUrl[index] = temp;
      return newPptFilesUrl;
    });
  }

  function moveParagraphDown(index) {
    setParagraphs((prevParagraphs) => {
      const newParagraphs = [...prevParagraphs];
      const temp = newParagraphs[index + 1];
      newParagraphs[index + 1] = newParagraphs[index];
      newParagraphs[index] = temp;
      return newParagraphs;
    });

    setPptUrls((prevPptUrls) => {
      const newPptUrls = [...prevPptUrls];
      const temp = newPptUrls[index + 1];
      newPptUrls[index + 1] = newPptUrls[index];
      newPptUrls[index] = temp;
      return newPptUrls;
    });

    setPptFilesUrl((prevPptFilesUrl) => {
      const newPptFilesUrl = [...prevPptFilesUrl];
      const temp = newPptFilesUrl[index + 1];
      newPptFilesUrl[index + 1] = newPptFilesUrl[index];
      newPptFilesUrl[index] = temp;
      return newPptFilesUrl;
    });
  }

  const updateToDatabase = async () => {
    setUpdating(true);

    try {
      const insertTime = new Date().toISOString();
      let { error: lessonError } = await supabase.from('lessons').insert([
        {
          title: lessonTitle,
          description: lessonDescription,
          inserted_at: insertTime,
          voice_id: voiceId,
        },
      ]);

      if (lessonError) throw lessonError;

      let { data, error } = await supabase
        .from('lessons')
        .select('id')
        .eq('title', lessonTitle)
        .eq('description', lessonDescription)
        .eq('inserted_at', insertTime)
        .eq('voice_id', voiceId);

      let lessonId = data[0].id;

      for (let i = 0; i < paragraphs.length; i++) {
        let { error: paragraphError } = await supabase.from('lesson_paragraphs').insert([
          {
            lesson_id: lessonId,
            content: paragraphs[i],
            order_of_lesson: i + 1,
            inserted_at: insertTime,
            ppt_url: pptUrls[i],
          },
        ]);

        if (paragraphError) throw paragraphError;
      }

      setFinishDB(true);
      setSuccessMessage('Lesson successfully inserted into the database!');
      setLessonTitle('');
      setLessonDescription('');
      setParagraphs(['']);
      setPptUrls(['']);
      setPptFilesUrl(['']);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push('/lesson');
    } catch (error) {
      console.log('Error: ', error.message);
      setMessage('There was an error inserting the lesson into the database!');
    } finally {
      setUpdating(false);
    }
  };

  const uploadPPT = async (event, paragraphIndex) => {
    setUploadingPPT(true);

    console.log('uploadPPT');
    console.log('paragraph index:', paragraphIndex);

    // generate uniquId from user id and current time
    const uniquId = `${user.id}_${new Date().getTime()}`;

    try {
      if (lessonTitle === '') {
        // clear the input file
        event.target.value = null;
        throw new Error('必須先填寫課文名稱!');
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('您必須選擇一個圖片進行上傳。');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `paragraphs_${uniquId}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('ppts')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      setPptUrls((prevPptUrls) => {
        const newPptUrls = [...prevPptUrls];
        newPptUrls[paragraphIndex] = filePath;
        return newPptUrls;
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message || '上傳圖片時發生錯誤');
    } finally {
      // clear the input file
      event.target.value = null;
      setUploadingPPT(false);
    }
  };

  const changePPT = async (event, paragraphIndex) => {
    setUploadingPPT(true);

    console.log('changePPT');
    console.log('changePPT paragraph index:', paragraphIndex);

    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('您必須選擇一個圖片進行上傳。');
      }

      const file = event.target.files[0];

      let { error: changeError } = await supabase.storage
        .from('ppts')
        .update(pptUrls[paragraphIndex], file);

      if (changeError) {
        throw changeError;
      }

      // update the pptFilesUrl state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      downloadPPT(pptUrls[paragraphIndex]);
    } catch (error) {
      console.log(error.message);
      alert(error.message || '更新圖片時發生錯誤');
    } finally {
      // clear the input file
      event.target.value = null;
      setUploadingPPT(false);
    }
  };

  const deletePPT = async (pptUrl) => {
    setLoadingWithBucket(true);
    try {
      const { error } = await supabase.storage.from('ppts').remove([pptUrl]);
      if (error) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      alert(error.message);
      console.log(error);
    } finally {
      setLoadingWithBucket(false);
    }
  };

  const downloadPPT = async (pptUrl) => {
    setLoadingWithBucket(true);
    try {
      const { data, error } = await supabase.storage.from('ppts').download(pptUrl);
      if (error) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const url = URL.createObjectURL(data);

      const newPptFilesUrl = [...pptFilesUrl];
      newPptFilesUrl[pptUrls.indexOf(pptUrl)] = url;
      setPptFilesUrl(newPptFilesUrl);
    } catch (error) {
      alert(error.message);
      console.log(error);
    } finally {
      setLoadingWithBucket(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lessonTitle) {
      setMessage('必須填寫課文名稱!');
      setSuccessMessage(null);
      return;
    }

    for (let paragraph of paragraphs) {
      if (!paragraph) {
        setMessage('所有頁數必須有內容!');
        setSuccessMessage(null);
        return;
      }
    }

    setMessage(null);
    updateToDatabase();
  };

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className="mt-16 bg-slate-100 pt-4 px-2 pb-12 w-full max-w-3xl">
        <div className=" pb-4">
          <h2>新增課文</h2>
          <label>課文名稱</label>
          <PrettyTextArea
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            required
          />
          <Spacer y={1} />
          <label>課文大綱</label>
          <PrettyTextArea
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            required
          />
        </div>

        <div className="py-4">
          <h2>內容</h2>
          <div className="border-solid border-2 border-slate-300 rounded-md px-4 pt-2 pb-8">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <div
                className="mb-6 pb-8 border-2 border-solid border-x-0 border-t-0 border-slate-300"
                key={paragraphIndex}
              >
                <div className="w-full flex justify-between items-center">
                  <h3>頁數{paragraphIndex + 1}</h3>

                  {/* icons */}
                  {updating === false && loadingWithBucket === false && uploadingPPT === false && (
                    <div className="w-1/3 flex justify-between">
                      <button
                        className="flex justify-center border-0 w-fit bg-transparent hover:text-slate-300 hover:cursor-pointer disabled:text-transparent disabled:cursor-default"
                        onClick={(e) => {
                          e.preventDefault();
                          moveParagraphUp(paragraphIndex);
                        }}
                        disabled={paragraphIndex === 0}
                      >
                        <AiOutlineArrowUp size="1.5rem" />
                      </button>
                      <button
                        className="flex justify-center border-0 w-fit bg-transparent hover:text-slate-300 hover:cursor-pointer disabled:text-transparent disabled:cursor-default"
                        onClick={(e) => {
                          e.preventDefault();
                          moveParagraphDown(paragraphIndex);
                        }}
                        disabled={paragraphIndex === paragraphs.length - 1}
                      >
                        <AiOutlineArrowDown size="1.5rem" />
                      </button>
                      <button
                        className="flex justify-center border-0 w-fit bg-transparent hover:text-slate-300 hover:cursor-pointer disabled:text-transparent disabled:cursor-default"
                        onClick={(e) => {
                          e.preventDefault();
                          removeParagraph(paragraphIndex);
                        }}
                      >
                        <AiOutlineDelete size="1.5rem" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full flex justify-between items-end">
                  <div className="w-5/6">
                    {/* Preview img div*/}
                    <div className="w-full flex justify-center">
                      {pptFilesUrl[paragraphIndex] ? (
                        <img
                          src={pptFilesUrl[paragraphIndex]}
                          alt="paragraph ppt"
                          className="max-h-96"
                        />
                      ) : (
                        <div className="h-80 p-4 overflow-y-scroll rounded-md bg-yellow-50 w-full ">
                          <h2>{lessonTitle}</h2>
                          {paragraph ? (
                            <p>{paragraph}</p>
                          ) : (
                            <p className="text-lg text-slate-500">Enter...</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* paragraph input */}
                    <div className="flex items-end w-full mt-4">
                      <PrettyTextArea
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(e, paragraphIndex)}
                        required
                      />
                    </div>
                  </div>

                  <div className="w-1/6 flex justify-center">
                    {/* Upload icons */}
                    <div className="relative h-16 w-fit  flex justify-center items-center border-2 rounded-xl  border-dashed hover:bg-yellow-50 hover:cursor-pointer">
                      {uploadingPPT || loadingWithBucket ? (
                        <Loading type="points-opacity" color="currentColor" className="absolute" />
                      ) : (
                        <GrDocumentUpload className="absolute" size={24} />
                      )}
                      <input
                        style={{
                          opacity: 0,
                        }}
                        type="file"
                        id="upload"
                        accept="image/*"
                        onChange={(e) => {
                          setUploadingPPT(true);
                          if (pptUrls[paragraphIndex] === '') {
                            uploadPPT(e, paragraphIndex);
                          } else {
                            changePPT(e, paragraphIndex);
                          }
                        }}
                        disabled={uploadingPPT || loadingWithBucket}
                        className="hover:cursor-pointer w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              className="w-full my-4"
              onClick={addParagraph}
              disabled={updating || uploadingPPT || loadingWithBucket}
            >
              增加頁數
            </Button>
          </div>
        </div>

        {/* Final div */}
        <div>
          <h2>
            課文名稱: <span>{lessonTitle}</span>
          </h2>
          <div className="flex items-center">
            <h2 className="mr-2">語音屬性:</h2>
            <Dropdown>
              <Dropdown.Button className="z-0 mt-0" flat>
                {voiceProfiles[voiceId].label}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single role section"
                onAction={(index) => {
                  setVoiceId(index);
                }}
              >
                {voiceProfiles.map((voice, index) => (
                  <Dropdown.Item key={index}>{voice.label}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <h2>
            總共
            <span> {paragraphs.length} </span>頁
          </h2>
          <p className="text-red-600">{message ? message : null}</p>
          <p className="text-green-600">{successMessage ? successMessage : null}</p>
        </div>

        {finishDB === false && (
          <Button
            ghost
            className="hover:bg-blue-600 w-full"
            type="submit"
            disabled={uploadingPPT || loadingWithBucket}
          >
            {updating ? <Loading type="points-opacity" color="currentColor" size="sm" /> : 'submit'}
          </Button>
        )}
      </form>
    </div>
  );
}
