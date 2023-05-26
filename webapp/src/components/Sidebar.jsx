import React from 'react';
import styles from '@/styles/Sidebar.module.css';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { TfiPanel } from 'react-icons/tfi';
import { GrConnect } from 'react-icons/gr';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.itemDiv}>
        <Link href="/" passHref>
          <div className={styles.item}>
            <div>
              <AiOutlineHome className="reactIcons" size="2rem" />
            </div>
            <p>HOME</p>
          </div>
        </Link>
        <Link href="/quiz" passHref>
          <div className={styles.item}>
            <div>
              <FaChalkboardTeacher className="reactIcons" size="2rem" />
            </div>
            <p>QUIZ</p>
          </div>
        </Link>
        <Link href="/arm-control" passHref>
          <div className={styles.item}>
            <div>
              <TfiPanel className="reactIcons" size="2rem" />
            </div>
            <p>操作手臂</p>
          </div>
        </Link>
        <Link href="/device" passHref>
          <div className={styles.item}>
            <div>
              <GrConnect className="reactIcons" size="2rem" />
            </div>
            <p>連線設定</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
