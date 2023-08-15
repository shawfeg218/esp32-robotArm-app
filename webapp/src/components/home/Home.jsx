import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Table, Loading, Card } from '@nextui-org/react';
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
        <div className="max-w-6xl flex flex-col sm:flex-row sm:flex-wrap justify-center">
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
            img="/img/VideoLearning.jpg"
            title={'Video Learning'}
            description=""
            link="/video-learning"
          />
          <HomeCard img="/img/Quiz.jpg" title={"it's QUIZ time"} description="" link="/quiz" />

          <div className="w-96 flex justify-center ">
            {loading ? (
              <Card
                aria-label="Loading"
                isHoverable
                className="w-full max-w-sm flex-col items-center"
              >
                <div className="h-full flex items-center">
                  <Loading size="lg" color="primary" />
                </div>
              </Card>
            ) : (
              <Card
                aria-label="history section"
                isHoverable
                className="w-full max-w-sm flex-col items-center"
              >
                <div>
                  {recentHistory.length > 0 ? (
                    <>
                      <h1 className="text-gray-900 text-center">HISTORY</h1>
                      <Table
                        aria-label="history table"
                        lined
                        shadow={false}
                        selectionMode="single"
                        containerCss={{ width: '100%', minWidth: 'fit-content' }}
                        css={{ height: 'auto', width: '100%' }}
                      >
                        <Table.Header>
                          <Table.Column
                            css={{ fontWeight: 'bold', fontSize: '$sm' }}
                            align="center"
                          >
                            科目
                          </Table.Column>
                          <Table.Column
                            css={{ fontWeight: 'bold', fontSize: '$sm' }}
                            align="center"
                          >
                            得分
                          </Table.Column>
                          <Table.Column
                            css={{ fontWeight: 'bold', fontSize: '$sm' }}
                            align="center"
                          >
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
                      <div className="px-5 my-8">
                        <Link href="/history" passHref>
                          <button className="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                            SEE ALL
                          </button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="my-32 text-center">
                      <h1 className="text-gray-900">HISTORY</h1>

                      <h2>No history data available.</h2>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
