import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Input, Button, Loading, Spacer, Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsFillPersonFill } from 'react-icons/bs';

export default function Account() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [avatarFileUrl, setAvatarFileUrl] = useState(null);
  const [message, setMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url);
  }, [avatar_url]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(username, fullname, avatar_url) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username: username,
        full_name: fullname,
        avatar_url: avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

      if (error) throw error;
      setMessage('Profile updated!');
    } catch (error) {
      setErrMessage('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event) {
    try {
      setLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      setAvatarUrl(filePath);
      updateProfile(username, fullname, filePath);

      router.push('/account');
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage(path) {
    setLoadingAvatar(true);
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAvatarFileUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    } finally {
      setLoadingAvatar(false);
    }
  }

  return (
    <div className="flex justify-center w-full mt-16">
      <div className="flex-col w-80 h-fit p-3 border border-solid border-slate-300 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">
            {user.user_metadata.role === 'teacher' ? '教師帳號' : '學生帳號'}
          </h1>
          <div className="flex">
            <div>
              {avatar_url && loadingAvatar === false ? (
                <img
                  src={avatarFileUrl}
                  alt="Avatar"
                  className="avatar image"
                  style={{ height: 150, width: 150 }}
                />
              ) : (
                <div className="avatar no-image" style={{ height: 150, width: 150 }}>
                  <div className="h-full flex justify-center items-center">
                    <BsFillPersonFill className="text-slate-400" size={150} />
                  </div>
                </div>
              )}
              <Spacer y={0.5} />
              <Button
                disabled
                className="m-1 absolute text-blue-600 bg-blue-200 rounded-2xl"
                flat
                size="sm"
              >
                {loading ? (
                  <>
                    <Loading type="points-opacity" color="currentColor" size="sm" />
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
              <input
                style={{
                  opacity: 0,
                }}
                type="file"
                id="upload"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={loading}
                className="hover:cursor-pointer"
              />
            </div>
            <div className="w-36">{/* <div>user name: {username}</div> */}</div>
          </div>

          <Spacer y={1} />
          <Input label="Email" color="default" value={session.user.email} readOnly fullWidth />
          <Spacer y={0.5} />
        </div>
        <div>
          <Input
            label="username"
            color="default"
            clearable
            fullWidth
            bordered
            borderWeight="light"
            placeholder="username"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Spacer y={0.5} />

          <Input
            label="fullname"
            color="default"
            clearable
            fullWidth
            bordered
            borderWeight="light"
            placeholder="fullname"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <p className="text-green-600">{message}</p>
          <p className="text-red-600">{errMessage}</p>
          <Tooltip
            className="w-full"
            placement="bottom"
            color="invert"
            hideArrow
            content={'更新使用者資料'}
          >
            <Button
              className="mt-2 bg-blue-600 w-full"
              onClick={() => updateProfile(username, fullname, avatar_url)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loading type="points-opacity" color="currentColor" size="sm" />
                </>
              ) : (
                'Update'
              )}
            </Button>
          </Tooltip>
        </div>
        <Spacer y={1} />

        <div className="w-full flex pt-3 border-t-2 border-solid border-x-0 border-b-0 border-slate-300">
          <Link href="/reset-password" passHref>
            <button className="w-1/2 bg-white text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-700 font-medium rounded-xl text-sm px-5 py-2.5 text-center mr-2 mb-2">
              密碼重設
            </button>
          </Link>
          <Tooltip
            className="w-1/2"
            placement="bottom"
            color="invert"
            hideArrow
            isDisabled={user.user_metadata.role === 'teacher'}
            content={'升級為教師帳號'}
          >
            <Link href="/update-role" passHref>
              <button
                disabled={user.user_metadata.role === 'teacher'}
                className="bg-white text-purple-700 hover:text-white border-2 border-purple-700 hover:bg-purple-700 disabled:cursor-default disabled:text-slate-300 disabled:border-slate-300 disabled:hover:bg-white font-medium rounded-xl text-sm px-5 py-2.5 text-center mb-2"
              >
                升級帳號
              </button>
            </Link>
          </Tooltip>
        </div>
        <Spacer y={0.5} />
        <div className="pt-3 border-t-2 border-solid border-x-0 border-b-0 border-slate-300">
          <Button
            ghost
            className="hover:bg-blue-600 mt-2 w-full"
            onClick={() => {
              supabase.auth.signOut();
              router.push('/');
            }}
          >
            Log Out
          </Button>
        </div>
        <Spacer y={0.5} />
      </div>
    </div>
  );
}
