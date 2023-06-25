//file: Sidebar.jsx
import React, { useContext, useEffect } from 'react';
import styles from '@/styles/Sidebar.module.css';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { TfiPanel } from 'react-icons/tfi';
import { GrConnect } from 'react-icons/gr';
import { BsMicFill } from 'react-icons/bs';

import Link from 'next/link';
import AppContext from '@/contexts/AppContext';
import Avatar from './account/Avatar';

export default function Sidebar() {
  const { displaySidebar, setDisplaySidebar } = useContext(AppContext);

  return (
    <div className={`${styles.container} ${displaySidebar ? styles.show : ''}`}>
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
        <Link href="/quiz" passHref>
          <div className={styles.item} onClick={() => setDisplaySidebar(false)}>
            <div>
              <div>
                <FaChalkboardTeacher className="reactIcons" size="2rem" />
              </div>
            </div>
            <div>
              <p>QUIZ</p>
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
  );
}
