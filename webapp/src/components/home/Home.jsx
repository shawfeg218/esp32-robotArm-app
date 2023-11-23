import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import HomeCard from "./HomeCard";

export default function Home() {
  const supabase = useSupabaseClient();
  const user = useUser();

  return (
    <div className="flex justify-center w-full mt-16">
      <div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 justify-center">
          <HomeCard
            img="/img/tku.jpg"
            width={"300px"}
            title={"語音助手"}
            description=""
            link="/audio-chat"
          />
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
        </div>
      </div>
    </div>
  );
}
