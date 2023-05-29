import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AppContextProvider } from '@/contexts/AppContext';
import nc from 'next-connect';
import cors from 'cors';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { NextUIProvider } from '@nextui-org/react';

function App({ Component, pageProps }) {
  const handler = nc().use(cors());
  const [supabase] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <AppContextProvider>
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
