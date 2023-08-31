import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { BsFillPersonFill, BsSafe2 } from 'react-icons/bs';

export default function Avatar({ size }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [avatar_url, setAvatarUrl] = useState(null);
  const [avatarFileUrl, setAvatarFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  useEffect(() => {
    if (avatar_url) {
      downloadImage(avatar_url);
    }
  }, [avatar_url]);

  async function getProfile() {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  }

  async function downloadImage(path) {
    setLoading(true);

    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAvatarFileUrl(url);
    } catch (error) {
      console.log('Error downloading image:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {avatar_url && loading === false ? (
        <img
          src={avatarFileUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }}>
          <div className="h-full flex justify-center items-center">
            <BsFillPersonFill className="text-slate-400" size={size} />
          </div>
        </div>
      )}
    </div>
  );
}
