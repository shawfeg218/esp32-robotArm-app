import AppContext from '@/contexts/AppContext';
import { useState, useContext } from 'react';

export default function Textbook() {
  const { selectedLesson } = useContext(AppContext);
  return <div>{selectedLesson}</div>;
}
