import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/History.module.css';
import { Table } from '@nextui-org/react';

export default function History() {
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
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
      .order('inserted_at', { ascending: false });
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
    <div className="flex justify-center w-full">
      {loading ? (
        'loading...'
      ) : (
        <Table
          lined
          selectionMode="single"
          color="primary"
          containerCss={{
            width: '70%',
            minWidth: 'fit-content',
          }}
          css={{
            height: 'auto',
            width: '100%',
          }}
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
          <Table.Pagination
            css={{ fontSize: '$md' }}
            shadow
            noMargin
            align="center"
            rowsPerPage={itemsPerPage}
            total={Math.ceil(recentHistory.length / itemsPerPage)}
          />
        </Table>
      )}
    </div>
  );
}
