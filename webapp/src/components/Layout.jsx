// Layout.jsx
import styles from '@/styles/Layout.module.css';
import Navbar from './Navbar';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import Sidebar from './Sidebar';
import AppContext from '@/contexts/AppContext';
import { useEffect, useContext } from 'react';
import Auth from './account/Auth';
import TeacherPanel from './TeacherPanel';
import { useRouter } from 'next/router';

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

  const user = useUser();
  const role = user?.user_metadata?.role;

  const router = useRouter();

  const { socket, displaySidebar, setDisplaySidebar } = useContext(AppContext);

  // socket
  useEffect(() => {
    if (session && role !== 'teacher') {
      socket?.on('lock_page_student', (path) => {
        console.log('locked: ', path);
        if (path !== router.asPath) {
          router.push(path);
        }
      });
    }

    return () => {
      socket?.off('lock_page_student');
    };
  }, [socket]);

  // sidebar
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
          <Auth />
        </div>
      ) : (
        <>
          <Navbar />
          <Overlay displaySidebar={displaySidebar} setDisplaySidebar={setDisplaySidebar} />
          <div className="flex min-h-screen">
            <Sidebar />
            <TeacherPanel />
            <div className="py-16 flex-col items-center w-full min-h-screen">{children}</div>
          </div>
        </>
      )}
    </>
  );
}
