import AppContext from '@/contexts/AppContext';
import { useContext } from 'react';
import styles from '@/styles/Question.module.css';
import { GrFormPrevious } from 'react-icons/gr';
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

  const { setSelectedSubject } = useContext(AppContext);

  const getOptionClassName = (index) => {
    if (!isAnswered) {
      return styles.option;
    }
    if (currentQuestion.options[index].is_correct) {
      return `${styles.option} ${styles.disabled} ${styles.correct}`;
    }
    if (index === selectedOptionIndex) {
      return `${styles.option} ${styles.disabled} ${styles.incorrect}`;
    }
    return `${styles.option} ${styles.disabled}`;
  };

  const handleLeave = () => {
    setSelectedSubject('');
  };

  return (
    <div>
      <div className={styles.leaveDiv} onClick={handleLeave}>
        <GrFormPrevious className="reactIcons" size="2rem" />
        <span>leave</span>
      </div>
      <div className={styles.questionContainer}>
        <div className={styles.questionText}>{currentQuestion.text}</div>
        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={getOptionClassName(index)}
              onClick={() => handleOptionClick(index)}
            >
              {option.text}
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
    </div>
  );
}
