//file: Sidebar.jsx
import React, { useContext, useEffect } from 'react';
import styles from '@/styles/Sidebar.module.css';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { TfiPanel } from 'react-icons/tfi';
import { GrConnect } from 'react-icons/gr';
import { BsMicFill } from 'react-icons/bs';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { TfiWrite } from 'react-icons/tfi';

import Link from 'next/link';
import AppContext from '@/contexts/AppContext';
import Avatar from './account/Avatar';

import { Switch } from '@nextui-org/react';

export default function Sidebar() {
  const { displaySidebar, setDisplaySidebar, faceMode, setFaceMode, setMood } =
    useContext(AppContext);

  // useEffect(() => {
  //   console.log('FaceMode:', faceMode);
  // }, [faceMode]);

  return (
    <div className={`${styles.container} ${displaySidebar ? styles.show : ''}`}>
      <div className="h-5/6 overflow-y-scroll">
        <div className={styles.itemDiv}>
          <Link href="/" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <AiOutlineHome className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>HOME</p>
              </div>
            </div>
          </Link>

          <Link href="/audio-chat" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <BsMicFill className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>語音聊天</p>
              </div>
            </div>
          </Link>

          <Link href="/video-learning" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <MdOutlineOndemandVideo className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>影片學習</p>
              </div>
            </div>
          </Link>

          <Link href="/lesson" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <FaChalkboardTeacher className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>上課</p>
              </div>
            </div>
          </Link>

          <Link href="/quiz" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <TfiWrite className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>小測驗</p>
              </div>
            </div>
          </Link>

          <Link href="/arm-control" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <TfiPanel className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>操作手臂</p>
              </div>
            </div>
          </Link>

          <Link href="/device" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div>
                  <GrConnect className="reactIcons" size="2rem" />
                </div>
              </div>
              <div>
                <p>連線設定</p>
              </div>
            </div>
          </Link>
          <Link href="/account" passHref>
            <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
              <div>
                <div className={styles.avatarContainer}>
                  <Avatar size={32} />
                </div>
              </div>
              <div>
                <p>帳號資料</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="border-2 border-solid border-x-0 border-b-0 border-slate-300 mx-2">
        <div className="flex justify-between mt-6 pl-7 pr-8">
          <p className="font-bold">表情模式</p>
          <Switch
            onChange={() => {
              setFaceMode(!faceMode);
            }}
          ></Switch>
        </div>
        {/* <select
          name="mood"
          onChange={(e) => {
            setMood(e.target.value);
          }}
        >
          <option value="default">預設</option>
          <option value="happy">開心</option>
          <option value="cry">哭哭</option>
          <option value="angry">生氣</option>
          <option value="speak">說話</option>
        </select> */}
      </div>
    </div>
  );
}
