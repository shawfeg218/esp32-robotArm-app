// pages/_app.js
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AppContextProvider } from '@/contexts/AppContext';
import nc from 'next-connect';
import cors from 'cors';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { NextUIProvider } from '@nextui-org/react';
import io from 'socket.io-client';
let socketIO;

function App({ Component, pageProps }) {
  const handler = nc().use(cors());
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    socketInitializer();

    return () => {
      socketIO?.disconnect();
    };
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socketIO = io();

    setSocket(socketIO);

    socketIO.on('connect', () => {
      console.log('socket connected');
    });
  };

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <AppContextProvider socket={socket}>
        <NextUIProvider>
          <Layout>
            <Component {...pageProps} handler={handler} />
          </Layout>
        </NextUIProvider>
      </AppContextProvider>
    </SessionContextProvider>
  );
}

export default App;
