// file: webapp\src\components\quiz\Question.jsx
import React, { useContext, useEffect, useState } from 'react';
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
  const { point, setPoint, selectedSubject, addHistory, connectedMacAddress } =
    useContext(AppContext);

  const [questions, setQuestions] = useState({});
  const supabase = useSupabaseClient();
  const user = useUser();
  // for uploading result
  const [subjectId, setSubjectId] = useState(null);

  async function fetchQuestionsData() {
    const result = {};

    try {
      const { data: subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('name', selectedSubject);

      if (subjectsError) throw subjectsError;

      const subject = subjects[0];
      setSubjectId(subject.id);

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_id', subject.id);

      if (questionsError) throw questionsError;

      const questionList = await Promise.all(
        questions.map(async (question) => {
          const { data: options, error: optionsError } = await supabase
            .from('options')
            .select('*')
            .eq('question_id', question.id);

          if (optionsError) throw optionsError;

          const optionsList = options.map((option) => option.text);
          const correctOptionIndex = options.findIndex(
            (option) => option.is_correct
          );

          return {
            id: question.id,
            text: question.text,
            options: optionsList,
            correctOptionIndex: correctOptionIndex,
          };
        })
      );

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

      optionIndex === currentQuestion.correctOptionIndex
        ? setCorrect(true)
        : setCorrect(false);
    }
  };

  useEffect(() => {
    if (correct === true) {
      axios.post('/api/correct-act', {
        connectedMacAddress,
      });
      setPoint((prev) => prev + 1);
    } else if (correct === false) {
      axios.post('/api/wrong-act', {
        connectedMacAddress,
      });
    }
  }, [correct]);

  async function handleNextClick() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsAnswered(false);
      setSelectedOptionIndex(-1);
      setCorrect();
    } else {
      // addHistory(selectedSubject, point);
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

      //finish button
      <Link href="/quiz/result"></Link>;
    }
  }
  return currentQuestion ? (
    <QuestionView
      currentQuestionIndex={currentQuestionIndex}
      selectedOptionIndex={selectedOptionIndex}
      isAnswered={isAnswered}
      selectedQuestions={selectedQuestions}
      currentQuestion={currentQuestion}
      handleOptionClick={handleOptionClick}
      handleNextClick={handleNextClick}
    />
  ) : (
    <div>Loading...</div>
  );
}
