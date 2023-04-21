import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext } from 'react';

export default function Home() {
  const { history } = useContext(AppContext);
  return (
    <div>
      <h1>Home Page</h1>

      <div className="cardContainer">
        <Link href="/quiz" passHref>
          <div className="card">
            <p>Quiz</p>
            <div></div>
          </div>
        </Link>

        <Link href="/arm-control" passHref>
          <div className="card">
            <p>操作手臂</p>
            <div></div>
          </div>
        </Link>

        <Link href="/arm-control" passHref>
          <div className="card">
            <p>操作手臂</p>
            <div></div>
          </div>
        </Link>
      </div>

      <h2>History</h2>
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
