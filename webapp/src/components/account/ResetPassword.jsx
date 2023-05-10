// file: webapp\src\components\account\ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/ResetPassword.module.css';

export default function ResetPassword() {
  const supabase = useSupabaseClient();
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [checkMessage, setCheckMessage] = useState('');

  useEffect(() => {
    if (newPassword !== checkPassword) {
      setCheckMessage('Passwords do not match!');
    } else {
      setCheckMessage('');
    }
  }, [checkPassword]);

  async function handlePasswordReset(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1>Reset Password</h1>
      <form onSubmit={handlePasswordReset}>
        <label htmlFor="newPassword">new password</label>
        <input
          id="newPassword"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="checkPassword">check password</label>
        <input
          id="checkPassword"
          type="password"
          placeholder="Check password"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
        />
        {checkMessage && <p className={styles.checkM}>{checkMessage}</p>}

        <button className="buttton primary" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
