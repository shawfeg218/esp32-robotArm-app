import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import Avatar from './account/Avatar';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineBell } from 'react-icons/ai';
import { BsFillCircleFill } from 'react-icons/bs';
import { useContext, useEffect } from 'react';
import AppContext from '@/contexts/AppContext';
import axios from 'axios';

export default function Navbar() {
  const {
    connectedDeviceName,
    connectedMacAddress,
    connected,
    setConnected,
    displaySidebar,
    setDisplaySidebar,
  } = useContext(AppContext);

  const showSidebar = () => {
    setDisplaySidebar(!displaySidebar);
  };

  const checkConnection = (lastHeartbeat) => {
    const currentTime = Date.now();
    if (currentTime - lastHeartbeat > 6000) {
      setConnected(false);
      console.log('disconnected');
    } else {
      setConnected(true);
      console.log('connected');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .post('/api/get-heartbeat', {
          connectedMacAddress,
        })
        .then((res) => {
          checkConnection(res.data);
          // console.log(res.data);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.menuDiv} onClick={showSidebar}>
        <RxHamburgerMenu className="reactIcons" size="1.8rem" />
      </div>
      <Link href="/" passHref>
        <div className={styles.logo}>
          <span>Esp32App</span>
        </div>
      </Link>

      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link href="/device" passHref>
            <div className={styles.conBtn}>
              {connected ? (
                <div className={styles.green}>
                  <BsFillCircleFill className="reactIcons" size="0.75rem" />
                  <p>連線中</p>
                </div>
              ) : (
                <div className={styles.red}>
                  <BsFillCircleFill className="reactIcons" size="0.75rem" />
                  <p>未連線</p>
                </div>
              )}
            </div>
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
}
