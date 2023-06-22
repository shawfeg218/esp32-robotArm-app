import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { GrConnect } from 'react-icons/gr';
import { TfiPanel } from 'react-icons/tfi';
import styles from '@/styles/Home.module.css';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import History from '../quiz/History';
import { Table, Button, Card, Text } from '@nextui-org/react';

export default function Home() {
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    fetchRecentHistory();
  }, []);

  async function fetchRecentHistory() {
    setLoading(true);

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
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className="cardContainer">
        <Link href="/quiz" passHref>
          <Card isHoverable isPressable variant="bordered" className="card">
            <h3>QUIZ</h3>
            <div className="reactIconsDiv">
              <FaChalkboardTeacher className="reactIcons" size="5rem" />
            </div>
          </Card>
        </Link>

        <Link href="/arm-control" passHref>
          <Card isHoverable isPressable variant="bordered" className="card">
            <h3>操作手臂</h3>
            <div className="reactIconsDiv">
              <TfiPanel className="reactIcons" size="5rem" />
            </div>
          </Card>
        </Link>

        <Link href="/device" passHref>
          <Card isHoverable isPressable variant="bordered" className="card">
            <h3>連線設定</h3>
            <div className="reactIconsDiv">
              <GrConnect className="reactIcons" size="5rem" />
            </div>
          </Card>
        </Link>
      </div>
      {loading ? (
        'Loading...'
      ) : (
        <Card isHoverable className={styles.history_container}>
          <Card.Header>
            <h3>HISTORY</h3>
          </Card.Header>
          <Card.Body>
            {recentHistory.length > 0 ? (
              <Table
                lined
                selectionMode="single"
                containerCss={{ width: '100%', minWidth: 'fit-content' }}
                css={{ height: 'auto', width: '100%' }}
              >
                <Table.Header>
                  <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
                    科目
                  </Table.Column>
                  <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
                    得分
                  </Table.Column>
                  <Table.Column css={{ fontWeight: 'bold', fontSize: '$sm' }} align="center">
                    Date
                  </Table.Column>
                </Table.Header>
                <Table.Body>
                  {recentHistory.map((entry, index) => (
                    <Table.Row key={index}>
                      <Table.Cell css={{ textAlign: 'center' }}>{entry.subject_name}</Table.Cell>
                      <Table.Cell css={{ textAlign: 'center' }}>{entry.score}</Table.Cell>
                      <Table.Cell css={{ textAlign: 'center' }}>
                        {new Date(entry.inserted_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}

                        {new Date(entry.inserted_at).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p>No history data available.</p>
            )}
          </Card.Body>
          <Card.Footer>
            {recentHistory.length > 0 && (
              <Link href="/history" passHref>
                <button className="mt-0 rounded-xl border bg-blue-600 w-full">更多</button>
              </Link>
            )}
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}
