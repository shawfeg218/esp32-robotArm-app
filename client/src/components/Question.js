import React, { useState } from 'react';
import questions from '../data/questions';
import axios from 'axios';
import '../CSS/Question.css';

function Question({ subject }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const selectedQuestions = questions[subject];
  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleOptionClick = (optionIndex) => {
    if (!isAnswered) {
      setSelectedOptionIndex(optionIndex);
      setIsAnswered(true);

      optionIndex === currentQuestion.correctOptionIndex
        ? axios.post('http://localhost:5000/api/correct-act')
        : axios.post('http://localhost:5000/api/wrong-act');
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedOptionIndex(-1);
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
