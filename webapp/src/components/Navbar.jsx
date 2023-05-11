import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineBell } from 'react-icons/ai';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      {/* <div className={styles.menuDiv}>
        <RxHamburgerMenu className="reactIcons" size="1.8rem" />
      </div> */}
      <Link href="/" passHref>
        <div className={styles.logo}>
          <span>Esp32App</span>
        </div>
      </Link>

      <ul className={styles.navbarList}>
        {/* <li className={styles.navbarItem}>
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
        </li> */}

        <Link href={'/account'} passHref>
          <div className={styles.avatarContainer}>
            <Avatar size={36} />
          </div>
        </Link>
      </ul>
    </nav>
  );
}
