import React from 'react';
import { Input, Button, Spacer } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function UpdateTeacher() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [teacherToken, setTeacherToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [cantSubmit, setCantSubmit] = useState(true);

  const code = process.env.NEXT_PUBLIC_TEACHER_CODE;

  useEffect(() => {
    if (teacherToken === code) {
      setCantSubmit(false);
    } else {
      setCantSubmit(true);
    }
  }, [teacherToken]);

  async function updateRole() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { role: 'teacher' } });
      if (error) throw error;
    } catch (error) {
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="mt-12">
        <h2>升級為教師帳號</h2>
        <Input
          label="輸入驗證碼"
          color="default"
          clearable
          fullWidth
          bordered
          borderWeight="light"
          placeholder="驗證碼"
          value={teacherToken}
          onChange={(e) => setTeacherToken(e.target.value)}
        />
        <Spacer y={1} />
        <Button
          disabled={cantSubmit || loading}
          onClick={() => {
            updateRole();
            supabase.auth.signOut();
            router.push('/');
          }}
        >
          升級
        </Button>
      </div>
    </div>
  );
}
