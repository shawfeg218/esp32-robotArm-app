import Lesson from '@/components/lesson/Lesson';
import AppContext from '@/contexts/AppContext';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

export default function QuizPage() {
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

  return (
    <div className="mt-16 flex flex-wrap justify-center">
      <Lesson />
    </div>
  );
}
