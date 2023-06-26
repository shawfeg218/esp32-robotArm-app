// Layout.jsx
import styles from '@/styles/Layout.module.css';
import Navbar from './Navbar';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Sidebar from './Sidebar';
import AppContext from '@/contexts/AppContext';
import { useContext } from 'react';
import { useEffect } from 'react';

function Overlay({ displaySidebar, setDisplaySidebar }) {
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

  useEffect(() => {
    if (displaySidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [displaySidebar]);

  return (
    <>
      {!session ? (
        <div className="flex justify-center items-center w-full min-h-screen ">
          <div className="w-80">
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
          <Overlay displaySidebar={displaySidebar} setDisplaySidebar={setDisplaySidebar} />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className={styles.container}>{children}</div>
          </div>
        </>
      )}
    </>
  );
}
