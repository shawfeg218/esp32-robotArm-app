import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { GrConnect } from 'react-icons/gr';
import { TfiPanel } from 'react-icons/tfi';
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
            <div className="reactIconsDiv">
              <TfiPanel className="reactIcons" size="5rem" />
            </div>
          </div>
        </Link>

        <Link href="/device" passHref>
          <div className="card">
            <p>連線設定</p>
            <div className="reactIconsDiv">
              <GrConnect className="reactIcons" size="5rem" />
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.historyContainer}>
        <h2>History</h2>
        {recentHistory.length > 0 ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>科目</th>
                <th>得分</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.subject_name}</td>
                  <td>{entry.score}</td>
                  <td>
                    {new Date(entry.inserted_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}{' '}
                    {new Date(entry.inserted_at).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history data available.</p>
        )}
        {recentHistory.length > 0 && (
          <Link href="/history">
            <button>更多</button>
          </Link>
        )}
      </div>
    </div>
  );
}
