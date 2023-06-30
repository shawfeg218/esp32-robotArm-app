import AppContext from "@/contexts/AppContext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GrConnect } from "react-icons/gr";
import { TfiPanel } from "react-icons/tfi";
import { BsMicFill } from "react-icons/bs";
import styles from "@/styles/Home.module.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import History from "../quiz/History";
import { Table, Loading, Button, Card, Text } from "@nextui-org/react";

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
      .from("result_history")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false })
      .limit(3);
    if (error) {
      console.log("Error fetching recent history:", error);
    } else {
      // Fetch the names of the subjects associated with each entry
      const Data_with_subject_name = await Promise.all(
        data.map(async (entry) => {
          const { data: subjectData, error: subjectError } = await supabase
            .from("subjects")
            .select("name")
            .eq("id", entry.subject_id)
            .single();

          if (subjectError) {
            console.log("Error fetching subject name:", subjectError);
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
    <div className="mt-16">
      <div className="cardContainer">
        <div className="flex flex-wrap flex justify-center">
          <Link href="/quiz" passHref>
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <div className="imageContainer">
                  <img
                    class="rounded-t-lg "
                    src="https://www.dokeos.com/wp-content/uploads/2021/02/Quiz.jpg"
                    alt=""
                  />
                </div>
              </a>
              <div class="p-5">
                <Link href="/quiz" passHref>
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      It's QUIZ time!
                    </h5>
                  </a>
                </Link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
                <Link href="/quiz" passHref>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Get start
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </Link>

          <Link href="/arm-control" passHref>
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <div className="imageContainer">
                  <img
                    class="rounded-t-lg"
                    src="https://www.mikemooney.com/wp-content/uploads/2020/12/Control.jpg"
                    alt=""
                  />
                </div>
              </a>
              <div class="p-5">
                <Link href="/arm-control" passHref>
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Let's control my arm!
                    </h5>
                  </a>
                </Link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
                <Link href="/arm-control" passHref>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Get start
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </Link>

          <Link href="/device" passHref>
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <div className="imageContainer">
                  <img
                    class="rounded-t-lg"
                    src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202006/internet-3269652_1920_0.jpeg?size=690:388"
                    alt=""
                  />
                </div>
              </a>
              <div class="p-5">
                <Link href="/device" passHref>
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Device setting
                    </h5>
                  </a>
                </Link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
                <Link href="/device" passHref>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Get start
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </Link>

          <Link href="/audio-chat" passHref>
            <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <div className="imageContainer">
                  <img
                    class="rounded-t-lg"
                    src="https://kinsta.com/wp-content/uploads/2017/07/error-establishing-a-database-connection-1-1024x512.jpg"
                    alt=""
                  />
                </div>
              </a>
              <div class="p-5">
                <Link href="/audio-chat" passHref>
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Audio-chat
                    </h5>
                  </a>
                </Link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
                <Link href="/audio-chat" passHref>
                  <a
                    href="#"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Get start
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex justify-center ">
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
                    containerCss={{ width: "100%", minWidth: "fit-content" }}
                    css={{ height: "auto", width: "100%" }}
                  >
                    <Table.Header>
                      <Table.Column
                        css={{ fontWeight: "bold", fontSize: "$sm" }}
                        align="center"
                      >
                        科目
                      </Table.Column>
                      <Table.Column
                        css={{ fontWeight: "bold", fontSize: "$sm" }}
                        align="center"
                      >
                        得分
                      </Table.Column>
                      <Table.Column
                        css={{ fontWeight: "bold", fontSize: "$sm" }}
                        align="center"
                      >
                        Date
                      </Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {recentHistory.map((entry, index) => (
                        <Table.Row key={index}>
                          <Table.Cell css={{ textAlign: "center" }}>
                            {entry.subject_name}
                          </Table.Cell>
                          <Table.Cell css={{ textAlign: "center" }}>
                            {entry.score}
                          </Table.Cell>
                          <Table.Cell css={{ textAlign: "center" }}>
                            {new Date(entry.inserted_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}

                            {new Date(entry.inserted_at).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
  );
}
