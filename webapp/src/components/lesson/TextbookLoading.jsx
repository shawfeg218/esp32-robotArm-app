import React from 'react';

export default function TextbookLoading() {
  return (
    <section className="w-full mt-8 bg-slate-200 animate-pulse">
      <div className="w-full h-full overflow-y-scroll p-4 rounded-md bg-slate-200">
        <div className="flex justify-between items-center">
          <div className="w-1/2 h-10 bg-slate-300"></div>
          <div className="w-2/5 h-14 bg-slate-300 rounded-full"></div>
        </div>
        <div className="h-80">
          <div className="w-full h-6 mt-6 bg-slate-300"></div>
          <div className="w-full h-6 mt-3 bg-slate-300"></div>
          <div className="w-full h-6 mt-3 bg-slate-300"></div>
          <div className="w-2/5 h-6 mt-3 bg-slate-300"></div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-4">
        <div className="w-2/5 h-8 bg-slate-200 rounded-md"></div>
      </div>
    </section>
  );
}
