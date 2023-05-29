import styles from '@/styles/AddQuestion.css';
import React, { useState } from 'react';

const AddQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 在這裡處理提交邏輯，例如發送題目和選項到伺服器
  };

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input type="text" value={question} onChange={handleQuestionChange} />
        </label>
        <label>
          Options:
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(e, index)}
            />
          ))}
        </label>
        <button type="button" onClick={handleAddOption}>
          Add Option
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddQuestionPage;
