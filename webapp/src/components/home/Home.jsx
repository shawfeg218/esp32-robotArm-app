// file: webapp\src\components\home\Home.jsx
import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import styles from '@/styles/Home.module.css';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Home() {
  const [recentHistory, setRecentHistory] = useState([]);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    fetchRecentHistory();
  }, []);

  async function fetchRecentHistory() {
    const { data, error } = await supabase
      .from('result_history')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false })
      .limit(3);
    if (error) {
      console.log('Error fetching recent history:', error);
    } else {
      // Fetch the names of the subjects associated with each entry
      const Data_with_subject_name = await Promise.all(
        data.map(async (entry) => {
          const { data: subjectData, error: subjectError } = await supabase
            .from('subjects')
            .select('name')
            .eq('id', entry.subject_id)
            .single();

          if (subjectError) {
            console.log('Error fetching subject name:', subjectError);
          } else {
            // Add the subject name to the entry
            return { ...entry, subject_name: subjectData.name };
          }
        })
      );

      setRecentHistory(Data_with_subject_name);
    }
  }

  return (
    <div className={styles.container}>
      <div className="cardContainer">
        <Link href="/quiz" passHref>
          <div className="card">
            <p>Quiz</p>
            <div className="reactIconsDiv">
              <FaChalkboardTeacher className="reactIcons" size="5rem" />
            </div>
          </div>
        </Link>

        <Link href="/arm-control" passHref>
          <div className="card">
            <p>操作手臂</p>
            <div></div>
          </div>
        </Link>

        <Link href="/device" passHref>
          <div className="card">
            <p>裝置設定</p>
            <div></div>
          </div>
        </Link>
      </div>

      <ul className={styles.historyUl}>
        <h2>History</h2>
        {recentHistory.length > 0 ? (
          <>
            {recentHistory.map((entry, index) => (
              <p key={index}>
                科目: {entry.subject_name} 得分: {entry.score} Date:{' '}
                {new Date(entry.inserted_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                {new Date(entry.inserted_at).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            ))}
            <Link href="/history">
              <button>更多</button>
            </Link>
          </>
        ) : (
          <li>No history data available.</li>
        )}
      </ul>
    </div>
  );
}
