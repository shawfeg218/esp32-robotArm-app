import React, { useContext } from 'react';
import styles from '@/styles/Sidebar.module.css';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import { TfiPanel } from 'react-icons/tfi';
import { GrConnect } from 'react-icons/gr';
import Link from 'next/link';
import AppContext from '@/contexts/AppContext';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children, setDisplaySidebar }) => {
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  if (isDesktop) {
    () => setDisplaySidebar(true);
  }
  return isDesktop ? children : null;
};

export default function Sidebar() {
  const { displaySidebar, setDisplaySidebar } = useContext(AppContext);

  return (
    <Desktop>
      <div
        className={`${styles.container} ${displaySidebar ? styles.show : ''}`}
      >
        <div className={styles.itemDiv}>
          <Link href="/" passHref>
            <div
              className={styles.item}
              onClick={() => setDisplaySidebar(false)}
            >
              <div>
                <AiOutlineHome className="reactIcons" size="2rem" />
              </div>
              <p>HOME</p>
            </div>
          </Link>
          <Link href="/quiz" passHref>
            <div
              className={styles.item}
              onClick={() => setDisplaySidebar(false)}
            >
              <div>
                <FaChalkboardTeacher className="reactIcons" size="2rem" />
              </div>
              <p>QUIZ</p>
            </div>
          </Link>
          <Link href="/arm-control" passHref>
            <div
              className={styles.item}
              onClick={() => setDisplaySidebar(false)}
            >
              <div>
                <TfiPanel className="reactIcons" size="2rem" />
              </div>
              <p>操作手臂</p>
            </div>
          </Link>
          <Link href="/device" passHref>
            <div
              className={styles.item}
              onClick={() => setDisplaySidebar(false)}
            >
              <div>
                <GrConnect className="reactIcons" size="2rem" />
              </div>
              <p>連線設定</p>
            </div>
          </Link>
        </div>
      </div>
    </Desktop>
  );
}
