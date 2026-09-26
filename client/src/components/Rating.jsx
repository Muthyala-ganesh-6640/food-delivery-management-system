import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, onChange, readonly = true, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= value
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-100 text-slate-300'
          } ${!readonly ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
        />
      ))}
      {readonly && (
        <span className="ml-1 text-xs font-semibold text-slate-700">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
