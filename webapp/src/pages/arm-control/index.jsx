import ArmControl from '@/components/arm-control/ArmControl';
import Esp32Status from '@/components/arm-control/Esp32Status';
import AppContext from '@/contexts/AppContext';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

export default function ArmControlPage() {
  const { controlMode, teacherPath } = useContext(AppContext);
  const router = useRouter();
  const user = useUser();
  const role = user?.user_metadata?.role;

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

  return (
    <div className="mt-16 flex flex-wrap justify-center">
      {role === 'teacher' ? (
        <>
          <ArmControl />
          {controlMode === 'single' ? <Esp32Status /> : null}
        </>
      ) : (
        <>
          <ArmControl />
          <Esp32Status />
        </>
      )}
    </div>
  );
}
