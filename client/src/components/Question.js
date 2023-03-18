import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';
import '../CSS/Question.css';
import questions from '../data/questions';
import axios from 'axios';

function Question() {
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
      addHistory(selectedSubject, point);
      navigate('/quiz/result');
    }
  };

  const getOptionClassName = (index) => {
    if (!isAnswered) {
      return 'option';
    }
    if (index === currentQuestion.correctOptionIndex) {
      return 'option disabled correct';
    }
    if (index === selectedOptionIndex) {
      return 'option disabled incorrect';
    }
    return 'option disabled';
  };

  return (
    <div className="question-container">
      <div className="question-text">{currentQuestion.text}</div>
      <div className="options-container">
        {currentQuestion.options.map((optionText, index) => (
          <div
            key={index}
            className={getOptionClassName(index)}
            onClick={() => handleOptionClick(index)}
          >
            {optionText}
          </div>
        ))}
      </div>
      {isAnswered && (
        <button className="next-button" onClick={handleNextClick}>
          {currentQuestionIndex === selectedQuestions.length - 1
            ? 'Finish'
            : 'Next'}
        </button>
      )}
    </div>
  );
}

export default Question;
