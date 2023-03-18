import React from 'react';
import '../CSS/Question.css';

function Question(props) {
  const {
    currentQuestionIndex,
    selectedOptionIndex,
    isAnswered,
    selectedQuestions,
    currentQuestion,
    handleOptionClick,
    handleNextClick,
  } = props;

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
