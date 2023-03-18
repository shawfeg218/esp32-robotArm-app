import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import questions from '../data/questions';
import axios from 'axios';
import Question from './Question';

function QuestionContainer() {
  const navigate = useNavigate();

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
      axios.post('http://localhost:5000/api/correct-act');
      setPoint((prev) => prev + 1);
    } else if (correct === false) {
      axios.post('http://localhost:5000/api/wrong-act');
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
      navigate('/quiz/result');
    }
  };

  return (
    <Question
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

export default QuestionContainer;
