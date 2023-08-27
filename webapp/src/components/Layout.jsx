// Layout.jsx
import styles from '@/styles/Layout.module.css';
import Navbar from './Navbar';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import Sidebar from './Sidebar';
import AppContext from '@/contexts/AppContext';
import { useEffect, useContext, useState } from 'react';
import Auth from './account/Auth';
import TeacherPanel from './TeacherPanel';
import { useRouter } from 'next/router';
import Face from './Face';
import io from 'socket.io-client';
let socketIO;

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

  const router = useRouter();

  const {
    role,
    setRole,
    setSocket,
    setControlMode,
    setTeacherPath,
    displaySidebar,
    setDisplaySidebar,
    showFace,
    setShowFace,
    faceMode,
  } = useContext(AppContext);

  useEffect(() => {
    if (session) {
      const userRole = user.user_metadata?.role || 'student';
      console.log('userRole: ', userRole);
      setRole(userRole);
      socketInitializer(userRole);
    }

    return () => {
      socketIO?.disconnect();
    };
  }, [session, user]);

  const socketInitializer = async (role) => {
    console.log('socket role: ', role);
    // socketIO = io('http://localhost:5000');
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    // console.log('url: ', url);
    socketIO = io(url);

    setSocket(socketIO);

    socketIO.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socketIO.on('connect_timeout', (timeout) => {
      console.log('Connection Timeout', timeout);
    });

    socketIO.on('connect', () => {
      console.log('socket connected');
    });

    if (role !== 'teacher') {
      socketIO.on('lock_page_student', (path) => {
        // console.log('locked: ', path);
        setTeacherPath(path);
        router.push(path);
      });

      socketIO.on('unlock_page_student', () => {
        // console.log('unlocked');
        setTeacherPath(null);
      });

      socketIO.on('set_controlMode_student', (mode) => {
        console.log('mode: ', mode);
        setControlMode(mode);
      });
    }
  };

  // sidebar
  useEffect(() => {
    if (displaySidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [displaySidebar]);

  useEffect(() => {
    if (!showFace && faceMode === true) {
      // Start the timer when showFace is false
      const timer = setTimeout(() => {
        setShowFace(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showFace, faceMode, setShowFace]);

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
            {showFace === true ? (
              <Face />
            ) : (
              <div className="py-16 flex-col items-center w-full min-h-screen">{children}</div>
            )}
          </div>
        </>
      )}
    </>
  );
}
