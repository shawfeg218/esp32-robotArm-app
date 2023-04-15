import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Avatar({ size }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [avatar_url, setAvatarUrl] = useState(null);
  const [avatarFileUrl, setAvatarFileUrl] = useState(null);

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
      console.log('Error downloading image:', error);
    }
  }

  return (
    <div>
      {avatar_url ? (
        <img
          src={avatarFileUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
    </div>
  );
}
