import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-100 shadow-2xl px-4 py-3 rounded-2xl animate-in slide-in-from-bottom-5 duration-200">
      {icons[type]}
      <span className="text-xs font-bold text-slate-800">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
