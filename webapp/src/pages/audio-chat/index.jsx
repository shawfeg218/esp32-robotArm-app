import AudioChat from '@/components/audio-chat/AudioChat';
import AppContext from '@/contexts/AppContext';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

export default function index() {
  const { teacherPath } = useContext(AppContext);
  const router = useRouter();
  const user = useUser();
  const role = user?.user_metadata?.role;

  useEffect(() => {
    if (role === 'teacher') {
      return;
    }

    if (router.asPath !== teacherPath) {
      router.push(teacherPath);
    }
  }, []);

  return <AudioChat />;
}
