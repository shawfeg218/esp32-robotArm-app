import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Table, Loading, Card } from "@nextui-org/react";
import HomeCard from "./HomeCard";

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

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setRecentHistory(Data_with_subject_name);
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center w-full mt-16">
      <div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 justify-center">
          <HomeCard
            img="/img/control.jpg"
            title={"機器人控制"}
            description=""
            link="/arm-control"
          />
          <HomeCard
            img="/img/device-linking.jpg"
            title={"機器人連線設置"}
            description=""
            link="/device"
          />
          <HomeCard img="/img/tku.jpg" title={"淡江機器人"} description="" link="/audio-chat" />
        </div>
      </div>
    </div>
  );
}
