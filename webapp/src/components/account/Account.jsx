import { useState, useEffect } from 'react';
import {
  useUser,
  useSupabaseClient,
  useSession,
} from '@supabase/auth-helpers-react';

import styles from '@/styles/Account.module.css';

export default function Account() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [arm_id, setArmId] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [avatarFileUrl, setAvatarFileUrl] = useState(null);

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
        .select(`username, arm_id, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setArmId(data.arm_id);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, arm_id, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        arm_id,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
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
      updateProfile({ username, arm_id, avatar_url: filePath });
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
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
              <div
                className="avatar no-image"
                style={{ height: 150, width: 150 }}
              />
            )}
            <label className={styles.avatarBtn} htmlFor="single">
              {loading ? 'Loading ...' : 'Upload'}
            </label>
            <input
              style={{
                visibility: 'hidden',
                position: 'absolute',
              }}
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={loading}
            />
          </div>
          <div className={styles.profileData}>
            {/* <div>user name: {username}</div> */}
            {/* <div>{arm_id ? arm_id : 'no arm-id'}</div> */}
          </div>
        </div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="arm_id">arm_id</label>
        <input
          id="arm_id"
          type="url"
          value={arm_id || ''}
          onChange={(e) => setArmId(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, arm_id, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
