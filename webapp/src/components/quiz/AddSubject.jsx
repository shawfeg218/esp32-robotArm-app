// webapp\src\components\quiz\AddSubject.jsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import styles from '@/styles/AddSubject.module.css';
import { IoIosRemove } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';
import PrettyTextArea from '../PrettyTextArea';
import { Button, Loading } from '@nextui-org/react';

export default function AddSubject() {
  const supabase = useSupabaseClient();

  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [udpdating, setUpdating] = useState(false);

  const [subjectName, setSubjectName] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    },
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

  const handleOptionCorrectChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, index) => {
      option.is_correct = index === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: [
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
      },
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

  const updateToDatabase = async () => {
    setUpdating(true);

    try {
      let { error: subjectError } = await supabase
        .from('subjects')
        .insert([{ name: subjectName }]);

      if (subjectError) throw subjectError;

      let { data, error } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', subjectName);
      console.log(data);
      let subjectId = data[0].id;

      // For each question
      for (let question of questions) {
        // Insert question into the questions table
        let { error: questionError } = await supabase
          .from('questions')
          .insert([{ subject_id: subjectId, text: question.text }]);

        if (questionError) throw questionError;

        // Get the id of the inserted question
        let { data, error } = await supabase
          .from('questions')
          .select('id')
          .eq('text', question.text);
        console.log(data);
        let questionId = data[0].id;

        // For each option of the question
        for (let option of question.options) {
          let { error: optionError } = await supabase.from('options').insert([
            {
              question_id: questionId,
              text: option.text,
              is_correct: option.is_correct,
            },
          ]);

          if (optionError) throw optionError;
        }
      }

      setSuccessMessage('Data successfully inserted into the database');
    } catch (error) {
      console.log('Error: ', error.message);
      setMessage('There was an error inserting the data into the database');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 檢查主題名稱是否有被填寫
    if (!subjectName) {
      setMessage('必須填寫主題名稱');
      return;
    }

    // 檢查每一個問題是否有內容被填寫
    for (let question of questions) {
      if (!question.text) {
        setMessage('所有問題必須有內容');
        return;
      }

      // 檢查每一個選項是否有內容被填寫
      for (let option of question.options) {
        if (!option.text) {
          setMessage('所有選項必須有內容');
          return;
        }
      }

      // 檢查每一個問題是否有正確答案被選中
      const correctOption = question.options.find(
        (option) => option.is_correct
      );
      if (!correctOption) {
        setMessage('每一題必須勾選一個正確答案');
        return;
      }
    }

    setMessage(null);
    updateToDatabase();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.subjectForm}>
        <h2>Subject</h2>
        <label>Subject Name</label>
        <PrettyTextArea
          value={subjectName}
          onChange={handleSubjectChange}
          required
        />
      </div>
      <div className={styles.questionForm}>
        <h2>Question</h2>
        {questions.map((question, questionIndex) => (
          <div className={styles.questionItem} key={questionIndex}>
            <div className={styles.question_bar}>
              <h3>題目{questionIndex + 1}</h3>
              {questions.length > 1 && (
                <div
                  className={styles.removeIcon}
                  onClick={() => removeQuestion(questionIndex)}
                >
                  <AiOutlineDelete className="reactIcons" size="1.5rem" />
                </div>
              )}
            </div>
            <label>
              <PrettyTextArea
                value={question.text}
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                required
              />
            </label>

            <div className={styles.optionForm}>
              {question.options.map((option, optionIndex) => (
                <div className={styles.optionItemContainer} key={optionIndex}>
                  <div className={styles.optionContainer}>
                    <div className={styles.option_bar}>
                      <div className={styles.correctDiv}>
                        <input
                          type="checkbox"
                          name={`correct-option-${questionIndex}`}
                          checked={option.is_correct}
                          onChange={() =>
                            handleOptionCorrectChange(
                              questionIndex,
                              optionIndex
                            )
                          }
                        />
                        <h4>選為正確選項</h4>
                      </div>
                      {question.options.length > 2 && (
                        <div
                          className={styles.removeIcon}
                          onClick={() =>
                            removeOption(questionIndex, optionIndex)
                          }
                        >
                          <IoIosRemove className="reactIcons" size="2rem" />
                        </div>
                      )}
                    </div>
                    <label key={optionIndex}>選項{optionIndex + 1}</label>
                    <PrettyTextArea
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(e, questionIndex, optionIndex)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.add_option_btn}
              type="button"
              onClick={() => addOption(questionIndex)}
            >
              Add New Option
            </button>
          </div>
        ))}
        <button
          className={styles.add_question_btn}
          type="button"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>
      <div className={styles.submit_check}>
        <h2>
          Subject Name: <span>{subjectName}</span>
        </h2>
        <h2>
          With
          <span> {questions.length} </span>
          Questions
        </h2>
        <p>{message ? message : null}</p>
        <p>{successMessage ? successMessage : null}</p>
      </div>
      <Button ghost className={styles.submit_btn} type="submit">
        {udpdating ? (
          <Loading type="points-opacity" color="currentColor" size="sm" />
        ) : (
          'submit'
        )}
      </Button>
    </form>
  );
}
