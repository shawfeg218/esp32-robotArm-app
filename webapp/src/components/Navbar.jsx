// file: Navbar.jsx
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useContext } from 'react';
import AppContext from '@/contexts/AppContext';

export default function Navbar() {
  const { displaySidebar, setDisplaySidebar } = useContext(AppContext);

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
        <div className={styles.logo}>
          <h1>Esp32App</h1>
        </div>
      </Link>

      <Link href="/account" passHref>
        <div className={styles.avatarContainer}>
          <Avatar size={60} />
        </div>
      </Link>
    </nav>
  );
}
