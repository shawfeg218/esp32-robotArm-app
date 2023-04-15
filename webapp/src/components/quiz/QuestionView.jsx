import React from 'react';
import styles from '@/styles/Question.module.css';
import Link from 'next/link';

export default function QuestionView(props) {
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
      return styles.option;
    }
    if (index === currentQuestion.correctOptionIndex) {
      return `${styles.option} ${styles.disabled} ${styles.correct}`;
    }
    if (index === selectedOptionIndex) {
      return `${styles.option} ${styles.disabled} ${styles.incorrect}`;
    }
    return `${styles.option} ${styles.disabled}`;
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionText}>{currentQuestion.text}</div>
      <div className={styles.optionsContainer}>
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
        <>
          {currentQuestionIndex < selectedQuestions.length - 1 ? (
            <button className={styles.nextButton} onClick={handleNextClick}>
              Next
            </button>
          ) : (
            <Link href="/quiz/result" passHref>
              <button className={styles.nextButton} onClick={handleNextClick}>
                Finish
              </button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
