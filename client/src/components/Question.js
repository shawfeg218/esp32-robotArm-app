import React, { useState } from 'react';
import questions from '../data/questions';
import './Question.css';

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
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedOptionIndex(-1);
    }
  };

  return (
    <div className="question-container">
      <div className="question-text">{currentQuestion.text}</div>
      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <div
            key={option.id}
            className={`option ${isAnswered ? 'disabled' : ''} ${
              isAnswered && option.id === currentQuestion.correctOptionId
                ? 'correct'
                : isAnswered && index === selectedOptionIndex
                ? 'incorrect'
                : ''
            }`}
            onClick={() => handleOptionClick(index)}
          >
            {option.text}
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
