import styles from '@/styles/Layout.module.css';
import Navbar from './Navbar';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Sidebar from './Sidebar';
import AppContext from '@/contexts/AppContext';
import { useContext, useEffect } from 'react';

function Overlay({ displaySidebar, setDisplaySidebar }) {
  function preventScroll(e) {
    e.preventDefault();
  }

  function noScroll() {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
  }

  function canScroll() {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
  }

  useEffect(() => {
    if (displaySidebar) {
      noScroll();
    } else {
      canScroll();
    }
  }, [displaySidebar]);

  return (
    <div
      className={`${styles.overlay} ${displaySidebar ? '' : styles.hide}`}
      onClick={() => {
        setDisplaySidebar(!displaySidebar);
      }}
    ></div>
  );
}

export default function Layout({ children }) {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { displaySidebar, setDisplaySidebar } = useContext(AppContext);

  return (
    <>
      {!session ? (
        <div className={styles.auth_page}>
          <div className={styles.authContainer}>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="default"
              providers={[]}
            />
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <Overlay
            displaySidebar={displaySidebar}
            setDisplaySidebar={setDisplaySidebar}
          />
          <div className={styles.flex}>
            <Sidebar />
            <div className={styles.container}>{children}</div>
          </div>
        </>
      )}
    </>
  );
}
