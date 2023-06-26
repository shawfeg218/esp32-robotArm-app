import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

import styles from '@/styles/Account.module.css';
import { Input, Button, Loading, Spacer } from '@nextui-org/react';

export default function Account() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();
  const [loading, setLoading] = useState(true);
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
      updateProfile({ username, avatar_url: filePath });
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarFileUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  return (
    <div className={styles.formWidget}>
      <div>
        <div className={styles.profileContainer}>
          <div>
            {avatar_url ? (
              <img
                src={avatarFileUrl}
                alt="Avatar"
                className="avatar image"
                style={{ height: 150, width: 150 }}
              />
            ) : (
              <div className="avatar no-image" style={{ height: 150, width: 150 }} />
            )}
            <Button disabled className="m-1 absolute text-blue-600 bg-blue-200" flat size="sm">
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
            />
          </div>
          <div className={styles.profileData}>{/* <div>user name: {username}</div> */}</div>
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

      <div className={styles.button_group}>
        <p className={styles.message}>{message}</p>
        <p className={styles.errMes}>{errMessage}</p>
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
        <Button
          ghost
          className="hover:bg-blue-600 mt-2 w-full"
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </Button>
        <Spacer y={0.5} />
      </div>
    </div>
  );
}
