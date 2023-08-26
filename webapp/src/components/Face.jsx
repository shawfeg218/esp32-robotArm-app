import { useContext } from 'react';
import AudioChat from './audio-chat/AudioChat';
import { Collapse } from '@nextui-org/react';
import AppContext from '@/contexts/AppContext';

export default function Face() {
  const { setShowFace } = useContext(AppContext);
  return (
    <div className="w-full mt-20 flex justify-center relative">
      <img
        src="/gif/default.gif"
        alt="temp"
        className="h-full"
        onClick={() => setShowFace(false)}
      />
      <Collapse title="Audio Chat" bordered className="absolute top-0 w-1/2 bg-white">
        <AudioChat />
      </Collapse>
    </div>
  );
}
