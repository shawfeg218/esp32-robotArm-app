import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import styles from '@/styles/History.module.css';

const History = () => {
  const [recentHistory, setRecentHistory] = useState([]);
  const [page, setPage] = useState(0); // page starts from 0
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    fetchTotalItems();
    fetchRecentHistory();
  }, [page]);

  async function fetchTotalItems() {
    const { count } = await supabase
      .from('result_history')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    setTotalItems(count);
  }

  async function fetchRecentHistory() {
    const { data, error } = await supabase
      .from('result_history')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false })
      .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1); // fetch data for the current page

    if (error) {
      console.log('Error fetching recent history:', error);
    } else {
      // Fetch the names of the subjects associated with each entry
      const dataWithSubjectName = await Promise.all(
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

      setRecentHistory(dataWithSubjectName);
    }
  }

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * itemsPerPage < totalItems) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    $(document).ready(function () {
      $('#example').DataTable();
    });
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.2.0/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css"
        />
      </Head>
      <div className={styles.container}>
        <h2>History</h2>
        {recentHistory.length > 0 ? (
          <table className="table table-striped table-bordered table-hover" id="example">
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
        <div className={styles.btnContainer}>
          <button onClick={handlePrevPage} disabled={page === 0}>
            Prev
          </button>
          <p>{page + 1}</p>
          <button onClick={handleNextPage} disabled={(page + 1) * itemsPerPage >= totalItems}>
            Next
          </button>
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
      <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
      <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>
    </>
  );
};

export default History;
