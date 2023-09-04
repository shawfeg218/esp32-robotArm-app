import React from 'react';
import { BsMicFill } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

export default function AudioChatLoading() {
  return (
    <div className="w-full mt-6 animate-pulse">
      <div className="flex justify-center items-center">
        <div className="w-32 h-10 bg-slate-200"></div>
        <div className="w-32 h-10 p-2 ml-4 flex justify-center rounded-lg bg-slate-200"></div>
      </div>
      <div className="w-full flex justify-center">
        <div className="mt-14 h-6 w-20 bg-slate-200"></div>
      </div>
      <BsMicFill className="mt-32 text-slate-200 w-16 h-16" />
      <div className="w-full mt-60 flex justify-center">
        <div className="w-80 h-8 rounded-md bg-slate-200"></div>
        <div className="w-16 h-8 flex justify-center items-center rounded-md bg-slate-200">
          <IoSend className="text-white" />
        </div>
      </div>
    </div>
  );
}
