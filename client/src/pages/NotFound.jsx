import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-rose-500">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-2 mb-4">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;
