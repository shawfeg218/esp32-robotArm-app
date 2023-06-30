import AppContext from '@/contexts/AppContext';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { BsArrowRightShort } from 'react-icons/bs';
import styles from '@/styles/Home.module.css';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import History from '../quiz/History';
import { Table, Loading, Button, Card, Text } from '@nextui-org/react';
import HomeCard from './HomeCard';

export default function Home() {
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div className="flex justify-center w-full mt-16">
      <div>
        <div className="flex flex-wrap justify-center">
          <HomeCard img="/img/Quiz.jpg" title={"it's QUIZ time"} description="" link="/quiz" />
          <HomeCard
            img="/img/Control.jpg"
            title={"Let's control my arm!"}
            description=""
            link="/arm-control"
          />
          <HomeCard
            img="/img/device-linking.jpg"
            title={'Device setting'}
            description=""
            link="/device"
          />
          <HomeCard
            img="/img/audioChat.jpg"
            title={'Audio chat'}
            description=""
            link="/audio-chat"
          />
          <HomeCard
            img="/img/videoLearning.jpg"
            title={'Video Learning'}
            description=""
            link="/video-learning"
          />
        </div>

        <div className="mt-16 flex justify-center ">
          {loading ? (
            <Loading className="mt-16" color="primary" />
          ) : (
            <Card isHoverable className={styles.history_container}>
              <h3>HISTORY</h3>
              <div>
                {recentHistory.length > 0 ? (
                  <>
                    <Table
                      lined
                      shadow={false}
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
                            <Table.Cell css={{ textAlign: 'center' }}>
                              {entry.subject_name}
                            </Table.Cell>
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
                    <div>
                      {recentHistory.length > 0 && (
                        <Link href="/history" passHref>
                          <button className="text-white mt-0 mb-4 rounded-xl border-0 bg-blue-600 w-full">
                            更多
                          </button>
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <p>No history data available.</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
