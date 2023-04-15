import React, { useContext } from 'react';
import Profile from '@/components/login/Profile';
import Login from '@/components/login/Login';
import AppContext from '@/contexts/AppContext';

export default function profile() {
  const { isLogin } = useContext(AppContext);

  return <div>{isLogin ? <Profile /> : <Login />}</div>;
}
