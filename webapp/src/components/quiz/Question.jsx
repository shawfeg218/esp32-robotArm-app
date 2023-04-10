import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../next.config';
import QuestionView from './QuestionView';
import Link from 'next/link';
import AppContext from '@/contexts/AppContext';
import questions from '@/data/question';

export default function Question() {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correct, setCorrect] = useState();
  const { point, setPoint, selectedSubject, addHistory } =
    useContext(AppContext);

  // question data
  const selectedQuestions = questions[selectedSubject];
  const currentQuestion = selectedQuestions[currentQuestionIndex];

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
      axios.post('/api/correct-act');
      setPoint((prev) => prev + 1);
    } else if (correct === false) {
      axios.post('/api/wrong-act');
    }
  }, [correct]);

  const handleNextClick = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsAnswered(false);
      setSelectedOptionIndex(-1);
      setCorrect();
    } else {
      //finish button
      addHistory(selectedSubject, point);
      <Link href={'/quiz/result'}></Link>;
    }
  };

  return (
    <QuestionView
      currentQuestionIndex={currentQuestionIndex}
      selectedOptionIndex={selectedOptionIndex}
      isAnswered={isAnswered}
      selectedQuestions={selectedQuestions}
      currentQuestion={currentQuestion}
      handleOptionClick={handleOptionClick}
      handleNextClick={handleNextClick}
    />
  );
}
