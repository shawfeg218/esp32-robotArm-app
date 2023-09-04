import React from 'react';

export default function QuizLoading() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((index) => (
        <div key={index}>
          <div className="relative w-96 h-52 bg-slate-200 p-4 rounded-lg animate-pulse">
            <div className="w-1/2 h-3 mt-2 bg-slate-300"></div>
            <div className="w-1/4 h-3 mt-2 bg-slate-300"></div>
            <div className="w-1/3 h-3 mt-2 bg-slate-300"></div>
            <div className="w-2/3 h-8 mt-2 bg-slate-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
