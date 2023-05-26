import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import styles from '@/styles/AddSubject.module.css';

export default function AddSubject() {
  const supabase = useSupabaseClient();

  const [subjectName, setSubjectName] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: [{ text: '', is_correct: false }] },
  ]);

  const handleSubjectChange = (e) => {
    setSubjectName(e.target.value);
  };

  const handleQuestionChange = (e, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = e.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: [{ text: '', is_correct: false }] },
    ]);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, index) => index !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 這裡你需要實現將主題、問題和選項數據插入到你的資料庫的邏輯
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.subjectForm}>
        <h2>Subject</h2>
        <label>
          Subject Name
          <input
            type="text"
            value={subjectName}
            onChange={handleSubjectChange}
            required
          />
        </label>
      </div>
      <div className={styles.questionForm}>
        <h2>Question</h2>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <p>Question {questionIndex + 1}</p>
            <label>
              題目
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                required
              />
            </label>

            <div className={styles.optionForm}>
              <h2>Option</h2>
              {question.options.map((option, optionIndex) => (
                <>
                  <label key={optionIndex}>
                    選項 {optionIndex + 1}
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(e, questionIndex, optionIndex)
                      }
                      required
                    />
                  </label>

                  {question.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                    >
                      Remove Option
                    </button>
                  )}
                </>
              ))}
              <button type="button" onClick={() => addOption(questionIndex)}>
                Add Option
              </button>
            </div>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
              >
                Remove Question
              </button>
            )}
            <button type="button" onClick={addQuestion}>
              Add Question
            </button>
          </div>
        ))}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
