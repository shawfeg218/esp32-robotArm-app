import { Button, Input, Spacer, Dropdown } from '@nextui-org/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { GrVmMaintenance } from 'react-icons/gr';

export default function Auth() {
  const supabase = useSupabaseClient();
  const [signup, setSignup] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [teacherToken, setTeacherToken] = useState('');
  const [role, setRole] = useState('student');
  const [checkPassword, setCheckPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [cantSubmit, setCantSubmit] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState('default');
  const [checkStatus, setCheckStatus] = useState('default');
  const [teacherTokenStatus, setTeacherTokenStatus] = useState('default');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [message, setMessage] = useState(null);

  const code = process.env.NEXT_PUBLIC_TEACHER_CODE;

  useEffect(() => {
    let canSubmit = true;

    // check password length
    if (password.length < 6) {
      setPasswordMessage('Password should be at least 6 characters!');
      setPasswordStatus('error');
      canSubmit = false;
    } else {
      setPasswordMessage('');
      setPasswordStatus('default');
    }

    // check password match
    if (password !== checkPassword) {
      setCheckMessage('Passwords do not match!');
      setCheckStatus('error');
      canSubmit = false;
    } else {
      setCheckMessage('');
      setCheckStatus('default');
    }

    // check teacher token
    if (role === code && teacherToken !== code) {
      setTeacherTokenStatus('error');
      canSubmit = false;
    } else if (role === code && teacherToken === code) {
      setTeacherTokenStatus('default');
    }

    setCantSubmit(!canSubmit);
  }, [password, checkPassword, role, teacherToken]);

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

  const handleSignup = async (email, password, fullname, role) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { full_name: fullname, role: role },
        },
      });
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
    <div className="w-80">
      <>
        {forgetPassword ? (
          <>
            <Input
              aria-label="Email input"
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
                <div className="flex items-center justify-between">
                  <h1>註冊{role === 'student' ? '學生' : '教師'}帳號</h1>
                  <Dropdown>
                    <Dropdown.Button flat>{role}</Dropdown.Button>
                    <Dropdown.Menu
                      aria-label="Single selection actions"
                      onAction={(key) => setRole(key)}
                    >
                      <Dropdown.Item key="student">Student</Dropdown.Item>
                      <Dropdown.Item key="teacher">Teacher</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Input
                  aria-label="Email input"
                  fullWidth
                  clearable
                  bordered
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={1} />
                <Input
                  aria-label="Full name input"
                  fullWidth
                  clearable
                  bordered
                  label="Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <Spacer y={1} />
                <Input.Password
                  aria-label="Password input"
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
                  aria-label="Check password input"
                  fullWidth
                  clearable
                  bordered
                  status={checkStatus}
                  helperText={checkMessage}
                  label="check Password"
                  value={checkPassword}
                  onChange={(e) => setCheckPassword(e.target.value)}
                />

                {role === 'teacher' ? (
                  <>
                    <Spacer y={2} />
                    <Input
                      aria-label="Teacher token input"
                      fullWidth
                      clearable
                      bordered
                      status={teacherTokenStatus}
                      label="教師帳號認證"
                      value={teacherToken}
                      onChange={(e) => setTeacherToken(e.target.value)}
                    />
                  </>
                ) : null}
                <Spacer y={1} />

                <Button
                  className="w-full"
                  onClick={() => {
                    handleSignup(email, password, fullname, role);
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
                  aria-label="Email input"
                  fullWidth
                  clearable
                  bordered
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={0.5} />

                <Input.Password
                  aria-label="Password input"
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
