import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AppContextProvider } from '@/contexts/AppContext';
import nc from 'next-connect';
import cors from 'cors';
import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, useUser } from '@supabase/auth-helpers-react';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/router';

function App({ Component, pageProps }) {
  const handler = nc().use(cors());
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const { query } = router;
      if (query.type === 'recovery' && query.token) {
        router.push('/reset-password');
      }
    }
  }, [user, router]);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
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
