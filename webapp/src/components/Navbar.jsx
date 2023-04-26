import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { BsBook } from 'react-icons/bs';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref>
        <div className={styles.logo}>
          <BsBook className="reactIcons" size="2rem" />
          <span>Esp32App</span>
        </div>
      </Link>

      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link href="/quiz">
            <p>Quiz</p>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/arm-control">
            <p>ArmControl</p>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/device">
            <p>Device</p>
          </Link>
        </li>
        <Link href={'/account'} passHref>
          <div className={styles.avatarContainer}>
            <Avatar size={36} />
          </div>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
