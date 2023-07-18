import { useUser } from '@supabase/auth-helpers-react';
import { Button, Collapse, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import AppContext from '@/contexts/AppContext';
import { useState, useContext } from 'react';
import Toast from './Toast';

export default function TeacherPanel() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const onCloseToast = () => {
    setShowToast(false);
    setToastMessage('');
    setToastType('');
  };

  const user = useUser();
  const role = user?.user_metadata?.role;

  const { socket } = useContext(AppContext);

  const router = useRouter();

  const lockPage = () => {
    socket?.emit('lock_page', router.asPath);
    setShowToast(true);
    setToastMessage('鎖定頁面');
    setToastType('check');
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} icon={toastType} onClose={onCloseToast} />}
      {role === 'teacher' ? (
        <Collapse title="Teacher Panel" bordered className="fixed right-0 p-2 mt-20 z-50 text-lg">
          <Button onClick={lockPage}>鎖定頁面</Button>
          <Spacer y={0.5} />
          <Button>解除鎖定</Button>
        </Collapse>
      ) : null}
    </>
  );
}
