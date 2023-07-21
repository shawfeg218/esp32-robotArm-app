import { useUser } from '@supabase/auth-helpers-react';
import { Button, Collapse, Spacer, Radio } from '@nextui-org/react';
import { useRouter } from 'next/router';
import AppContext from '@/contexts/AppContext';
import { useState, useContext, useEffect } from 'react';
import Toast from './Toast';

export default function TeacherPanel() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const user = useUser();
  const role = user?.user_metadata?.role;

  const { socket, controlMode, setControlMode } = useContext(AppContext);

  const router = useRouter();

  useEffect(() => {
    console.log('controlMode: ', controlMode);
  }, [controlMode]);

  const onCloseToast = () => {
    setShowToast(false);
    setToastMessage('');
    setToastType('');
  };

  const lockPage = () => {
    socket?.emit('lock_page', router.asPath);
    setShowToast(true);
    setToastMessage('鎖定頁面');
    setToastType('check');
  };

  const unlockPage = () => {
    socket?.emit('unlock_page');
    setShowToast(true);
    setToastMessage('解除鎖定');
    setToastType('check');
  };

  return (
    <>
      {showToast && <Toast message={toastMessage} icon={toastType} onClose={onCloseToast} />}
      {role === 'teacher' ? (
        <Collapse
          title="Teacher Panel"
          bordered
          className="fixed right-1 px-4 mt-20 z-50 text-lg bg-white"
        >
          <div className="py-4">
            <Button onClick={lockPage}>鎖定頁面</Button>
            <Spacer y={0.5} />
            <Button onClick={unlockPage}>解除鎖定</Button>
          </div>
          <>
            {router.asPath === '/arm-control' ? (
              <div className="mt-4 pl-1 pt-3 border border-x-0 border-b-0 border-solid border-slate-300">
                <Radio.Group
                  label="連線方式"
                  Value={controlMode}
                  defaultValue={controlMode}
                  onChange={(value) => {
                    // console.log(value);
                    setControlMode(value);
                  }}
                  className="text-xl"
                >
                  <Radio value="single">單一裝置</Radio>
                  <Radio value="multi-singleRoute">多裝置單一路由</Radio>
                  <Radio value="multi-multiRoute">多裝置多路由</Radio>
                </Radio.Group>
              </div>
            ) : null}
          </>
        </Collapse>
      ) : null}
    </>
  );
}
