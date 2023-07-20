import Esp32Devices from '@/components/arm-control/Esp32Devices';
import Esp32Status from '@/components/arm-control/Esp32Status';
import AppContext from '@/contexts/AppContext';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

export default function devicePage() {
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

  return (
    <div className="mt-16 flex flex-wrap justify-center">
      <Esp32Devices />
      <Esp32Status />
    </div>
  );
}
