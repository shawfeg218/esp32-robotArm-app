import Link from 'next/link';
import axios from 'axios';
import styles from '@/styles/Navbar.module.css';

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
      <div className={styles.icon}>
        <Link href="/">
          <a>Esp32 App</a>
        </Link>
      </div>
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
        <button className={styles.resetWifiButton} onClick={resetWifi}>
          Reset Arm Wi-Fi
        </button>
        <Link href={'/login'} passHref>
          <button className={styles.loginButton}>Login</button>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
