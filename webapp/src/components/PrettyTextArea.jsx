// file: webapp\src\components\PrettyTextArea.jsx

import { useEffect, useRef } from 'react';
import styles from '@/styles/PrettyTextArea.module.css';

export default function PrettyTextArea({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const element = textareaRef.current;
    element.style.height = 'auto';
    if (element.scrollHeight > element.clientHeight) {
      element.style.height = `${element.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      rows="1"
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={styles.textarea}
    />
  );
}
