import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import QuestionView from './QuestionView';
import Link from 'next/link';
import AppContext from '@/contexts/AppContext';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Question() {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correct, setCorrect] = useState();
  const { point, setPoint, selectedSubject, connectedMacAddress } =
    useContext(AppContext);

  const [questions, setQuestions] = useState({});
  const supabase = useSupabaseClient();
  const user = useUser();

  // for uploading result
  const [subjectId, setSubjectId] = useState(null);

  // for sound effect
  const correctSoundRef = useRef();
  const wrongSoundRef = useRef();

  function playSound(audioRef) {
    // 先停止並重置所有的音效
    [correctSoundRef, wrongSoundRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    // 播放需要的音效
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  async function fetchQuestionsData() {
    const result = {};

    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_data')
        .select('*')
        .eq('subject_name', selectedSubject);

      if (quizError) throw quizError;

      console.log('quizData:', quizData);

      const questions = quizData.reduce((acc, row) => {
        if (!(row.question_id in acc)) {
          acc[row.question_id] = {
            id: row.question_id,
            text: row.question_text,
            options: [],
          };
        }
        acc[row.question_id].options.push({
          id: row.option_id,
          text: row.option_text,
          is_correct: row.is_correct,
        });
        return acc;
      }, {});

      const questionList = Object.values(questions);
      setSubjectId(quizData[0].subject_id);
      result[selectedSubject] = questionList;
    } catch (error) {
      console.log('Error fetching questions:', error);
    }

    return result;
  }

  useEffect(() => {
    fetchQuestionsData().then((result) => {
      setQuestions(result);
      console.log(result);
    });
  }, []);

  // question data
  const selectedQuestions = questions[selectedSubject];
  const currentQuestion = selectedQuestions?.[currentQuestionIndex];

  const handleOptionClick = (optionIndex) => {
    if (!isAnswered) {
      setSelectedOptionIndex(optionIndex);
      setIsAnswered(true);

      const isCorrect = currentQuestion.options[optionIndex].is_correct;
      setCorrect(isCorrect);
      // console.log(isCorrect);
    }
  };

  useEffect(() => {
    if (correct === true) {
      axios.post('/api/correct-act', {
        connectedMacAddress,
      });
      setPoint((prev) => prev + 1);
      playSound(correctSoundRef);
    } else if (correct === false) {
      axios.post('/api/wrong-act', {
        connectedMacAddress,
      });
      playSound(wrongSoundRef);
    }
  }, [correct]);

  async function handleNextClick() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsAnswered(false);
      setSelectedOptionIndex(-1);
      setCorrect();
    } else {
      // add History
      try {
        const { error } = await supabase.from('result_history').insert([
          {
            user_id: user.id,
            subject_id: subjectId,
            score: point,
            inserted_at: new Date().toISOString(),
          },
        ]);
        if (error) throw error;
      } catch (error) {
        console.log('Error uploading result:', error);
      }
    }
  }

  return currentQuestion ? (
    <>
      <audio
        ref={correctSoundRef}
        src="/audio/mixkit-correct-answer-reward-952.wav"
        preload="auto"
      />
      <audio
        ref={wrongSoundRef}
        src="/audio/mixkit-cartoon-failure-piano-473.wav"
        preload="auto"
      />

      <QuestionView
        currentQuestionIndex={currentQuestionIndex}
        selectedOptionIndex={selectedOptionIndex}
        isAnswered={isAnswered}
        selectedQuestions={selectedQuestions}
        currentQuestion={currentQuestion}
        handleOptionClick={handleOptionClick}
        handleNextClick={handleNextClick}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
}
