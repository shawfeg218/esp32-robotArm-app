import { Button, Input, Spacer } from '@nextui-org/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function Auth() {
  const supabase = useSupabaseClient();
  const [signup, setSignup] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [cantSubmit, setCantSubmit] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState('default');
  const [checkStatus, setCheckStatus] = useState('default');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // check password length
    if (password.length < 6) {
      setPasswordMessage('Password should be at least 6 characters!');
      setPasswordStatus('error');
      setCantSubmit(true);
    } else {
      setPasswordMessage('');
      setPasswordStatus('default');
      setCantSubmit(false);
    }

    // check password match
    if (password !== checkPassword) {
      setCheckMessage('Passwords do not match!');
      setCheckStatus('error');
      setCantSubmit(true);
    } else {
      setCheckMessage('');
      setCheckStatus('default');
      if (password.length >= 6) {
        setCantSubmit(false);
      }
    }
  }, [password, checkPassword]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email: email, password: password });
      if (error) throw error;
      setMessage('註冊成功，請至信箱收取驗證信件');
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage('重設密碼信件已發送');
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72">
      <>
        {forgetPassword ? (
          <>
            <Input
              fullWidth
              clearable
              bordered
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Spacer y={0.5} />
            <Button
              className="w-full"
              onClick={() => {
                handleResetPassword(email);
              }}
              disabled={loading}
            >
              發送重設密碼信件
            </Button>
            <Spacer y={0.5} />
            <Button
              className="w-full underline hover:text-slate-400"
              light
              size="xs"
              onClick={() => {
                setSignup(false);
                setForgetPassword(false);
              }}
            >
              已經有帳號了？登入
            </Button>
            <Spacer y={0.5} />
            <p className="text-center font-bold">{message ? message : null}</p>
          </>
        ) : (
          <>
            {signup ? (
              <>
                <Input
                  fullWidth
                  clearable
                  bordered
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={1} />
                <Input.Password
                  fullWidth
                  clearable
                  bordered
                  status={passwordStatus}
                  helperText={passwordMessage}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Spacer y={1} />
                <Input.Password
                  fullWidth
                  clearable
                  bordered
                  status={checkStatus}
                  helperText={checkMessage}
                  label="check Password"
                  value={checkPassword}
                  onChange={(e) => setCheckPassword(e.target.value)}
                />
                <Spacer y={1} />
                <Button
                  className="w-full"
                  onClick={() => {
                    handleSignup(email, password);
                  }}
                  disabled={cantSubmit || loading}
                >
                  註冊
                </Button>
                <p className="text-center">{message ? message : null}</p>
                <Button
                  className="w-full underline hover:text-slate-400"
                  light
                  size="xs"
                  onClick={() => {
                    setSignup(false);
                  }}
                >
                  已經有帳號了？登入
                </Button>
              </>
            ) : (
              <>
                <Input
                  fullWidth
                  clearable
                  bordered
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={0.5} />

                <Input.Password
                  fullWidth
                  clearable
                  bordered
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Spacer y={0.5} />
                <Button
                  className="w-full"
                  onClick={() => {
                    handleLogin(email, password);
                  }}
                  disabled={loading}
                >
                  登入
                </Button>
                <Spacer y={0.25} />
                <Button
                  className="w-full"
                  ghost
                  onClick={() => {
                    setSignup(true);
                  }}
                  disabled={loading}
                >
                  註冊
                </Button>
                <Spacer y={0.25} />
                <Button
                  className="w-full underline"
                  light
                  onClick={() => {
                    setForgetPassword(true);
                  }}
                  disabled={loading}
                >
                  忘記密碼?
                </Button>
              </>
            )}
          </>
        )}
      </>
    </div>
  );
}
