import { useContext } from 'react';
import AudioChat from './audio-chat/AudioChat';
import { Collapse } from '@nextui-org/react';
import AppContext from '@/contexts/AppContext';

const moodToGif = {
  default: '/gif/default.gif',
  happy: '/gif/happy.gif',
  cry: '/gif/cry.gif',
  angry: '/gif/angry.gif',
  speak: '/gif/speak.gif',
};

export default function Face() {
  const { setShowFace, mood } = useContext(AppContext);
  let gifSrc = moodToGif[mood] || moodToGif.default;

  return (
    <div className="w-full mt-20 flex justify-center relative">
      <img src={gifSrc} alt="temp" className="h-full" onClick={() => setShowFace(false)} />
      <Collapse title="Audio Chat" bordered className="absolute top-0 w-1/2 bg-white">
        <AudioChat />
      </Collapse>
    </div>
  );
}
