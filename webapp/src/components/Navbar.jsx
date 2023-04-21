import Link from 'next/link';
import axios from 'axios';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { BsBook } from 'react-icons/bs';

const Navbar = () => {
  const resetWifi = async () => {
    try {
      await axios.post('/api/reset-wifi');
      alert('Wi-Fi reset command sent.');
    } catch (error) {
      console.error('Error resetting Wi-Fi:', error);
      alert('Failed to send Wi-Fi reset command.');
    }
  };

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
          <Link href="">
            <a>asd</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="">
            <a>asd</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="">
            <a>asd</a>
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <button className={styles.resetWifiButton} onClick={resetWifi}>
            Reset Arm Wi-Fi
          </button>
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
