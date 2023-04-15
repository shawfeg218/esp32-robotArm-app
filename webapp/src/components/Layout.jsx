import styles from '@/styles/Layout.module.css';
import Navbar from './Navbar';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Layout({ children }) {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div>
      {!session ? (
        <div className={styles.container}>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['google', 'facebook', 'twitter']}
          />
        </div>
      ) : (
        <>
          <Navbar />
          <div className={styles.container}>{children}</div>
        </>
      )}
    </div>
  );
}
