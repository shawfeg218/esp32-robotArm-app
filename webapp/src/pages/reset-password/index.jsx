import ResetPassword from '@/components/account/ResetPassword';
import AppContext from '@/contexts/AppContext';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

export default function ResetPasswordPage() {
  const { role, teacherPath } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (role === 'teacher') {
      return;
    }
    if (teacherPath === null) {
      return;
    }
    if (router.asPath !== teacherPath) {
      router.push(teacherPath);
    }
  }, []);

  return <ResetPassword />;
}
