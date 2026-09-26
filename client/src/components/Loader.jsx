import React from 'react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <div
        className={`${sizeClasses[size]} border-brand-orange border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
      <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
};

export default Loader;
