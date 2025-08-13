import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-orange-200 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-indigo-200 opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-violet-200 opacity-15 animate-pulse"></div>
      </div>

      {/* Glass effect container */}
      <div className="z-10 p-8 rounded-xl bg-white bg-opacity-30 backdrop-blur-lg border border-white border-opacity-20 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Spinning loader */}
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-opacity-20"></div>
            {/* Spinning accent ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin"></div>
            {/* Center icon */}
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">Loading</h2>
            <p className="text-sm text-slate-500">Please wait a moment...</p>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default Loading;