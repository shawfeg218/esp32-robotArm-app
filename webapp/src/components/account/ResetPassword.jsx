import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Input, Button, Spacer, Loading } from '@nextui-org/react';
import styles from '@/styles/ResetPassword.module.css';

export default function ResetPassword() {
  const supabase = useSupabaseClient();
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cantSubmit, setCantSubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMes, setErrorMes] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('default');
  const [checkStatus, setCheckStatus] = useState('default');

  useEffect(() => {
    // check password length
    if (newPassword.length < 6) {
      setPasswordMessage('Password should be at least 6 characters!');
      setPasswordStatus('error');
      setCantSubmit(true);
    } else {
      setPasswordMessage('');
      setPasswordStatus('default');
      setCantSubmit(false);
    }

    // check password match
    if (newPassword !== checkPassword) {
      setCheckMessage('Passwords do not match!');
      setCheckStatus('error');
      setCantSubmit(true);
    } else {
      setCheckMessage('');
      setCheckStatus('default');
      if (newPassword.length >= 6) {
        setCantSubmit(false);
      }
    }
  }, [newPassword, checkPassword]);

  async function handlePasswordReset(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordStatus('error');
      setErrorMes(error);
    } else {
      setMessage('Password updated successfully!');
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <Input.Password
          clearable
          fullWidth
          status={passwordStatus}
          helperText={passwordMessage}
          helperColor={passwordStatus === 'error' ? 'error' : 'default'}
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Spacer y={1} />
        <Input.Password
          clearable
          fullWidth
          status={checkStatus}
          helperText={checkMessage}
          helperColor={checkStatus === 'error' ? 'error' : 'default'}
          label="Check password"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
        />
        <Spacer y={1} />
        <Button
          ghost
          className="hover:bg-blue-600 w-full"
          type="submit"
          disabled={cantSubmit || loading}
        >
          {loading ? (
            <>
              <Loading type="points-opacity" color="currentColor" size="sm" />
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
        <p className={styles.message}>{message}</p>
        <p className={styles.errMes}>{errorMes}</p>
      </form>
    </div>
  );
}
