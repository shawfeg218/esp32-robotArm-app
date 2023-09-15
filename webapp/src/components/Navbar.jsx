// file: Navbar.jsx
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import Image from 'next/image';

export default function Navbar() {
  const { displaySidebar, setDisplaySidebar, teacherPath } = useContext(AppContext);

  const showSidebar = () => {
    setDisplaySidebar(!displaySidebar);
    // console.log('showSidebar: ' + displaySidebar);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.menuDiv} onClick={showSidebar}>
        <RxHamburgerMenu className="reactIcons" size="1.8rem" />
      </div>
      <Link href="/" passHref>
        <div className="hover:cursor-pointer hidden sm:block">
          <div className="flex items-center">
            <Image src="/memeIcon-bgrm.png" width={32} height={32} />
            <h1 className="text-center ml-1">MEMEbot</h1>
          </div>
        </div>
      </Link>

      <div className="flex">
        {teacherPath && (
          <div className="mr-4 flex justify-center items-center p-2 px-3 rounded-lg border border-solid border-slate-300 ">
            <div className="relative mr-1 rounded-full bg-sky-500 h-3 w-3 inline-flex">
              <span className="absolute rounded-full bg-sky-400 opacity-75 h-3 w-3 inline-flex animate-ping"></span>
            </div>
            <div>教師鎖定中</div>
          </div>
        )}
        <Link href="/account" passHref>
          <div className={styles.avatarContainer}>
            <Avatar size={60} />
          </div>
        </Link>
      </div>
    </nav>
  );
}
