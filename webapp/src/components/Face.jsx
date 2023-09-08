import { useContext } from 'react';
import AudioChat from './audio-chat/AudioChat';
import { Collapse } from '@nextui-org/react';
import AppContext from '@/contexts/AppContext';
import { useUser } from '@supabase/auth-helpers-react';

const moodToGif = {
  default: '/gif/default.gif',
  happy: '/gif/happy.gif',
  cry: '/gif/cry.gif',
  angry: '/gif/angry.gif',
  speak: '/gif/speak.gif',
};

export default function Face() {
  const user = useUser();
  const role = user.user_metadata?.role || 'student';
  const { setShowFace, mood, controlMode } = useContext(AppContext);
  let gifSrc = moodToGif[mood] || moodToGif.default;

  return (
    <div className="w-full mt-20 flex justify-center relative">
      <img src={gifSrc} alt="temp" className="h-full" onClick={() => setShowFace(false)} />
      {role === 'teacher' ||
        (controlMode === 'single' && (
          <Collapse title="Audio Chat" bordered className="absolute top-0 w-1/2 bg-white">
            <AudioChat />
          </Collapse>
        ))}
    </div>
  );
}
