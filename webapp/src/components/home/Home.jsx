import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext } from 'react';

export default function Home() {
  const { history } = useContext(AppContext);
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/quiz" passHref>
        <button>Quiz</button>
      </Link>
      <Link href="/arm-control" passHref>
        <button>操作手臂</button>
      </Link>

      <h2>History:</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            Subject: {entry.subject}, Points: {entry.point}
          </li>
        ))}
      </ul>
    </div>
  );
}
