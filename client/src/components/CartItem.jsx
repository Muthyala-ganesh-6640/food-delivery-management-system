import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const food = item.food || {};

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-xs mb-3">
      {/* Item info */}
      <div className="flex items-center gap-3.5 flex-1 pr-4">
        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
          <img
            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
            <h4 className="font-bold text-slate-800 text-sm">{food.name || item.name}</h4>
          </div>
          <p className="text-xs text-slate-500 font-medium">₹{item.price} each</p>
          {item.specialInstructions && (
            <p className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1 italic">
              Note: "{item.specialInstructions}"
            </p>
          )}
        </div>
      </div>

      {/* Quantity & Price Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-16 text-right">
          <span className="font-extrabold text-sm text-slate-900">
            ₹{item.price * item.quantity}
          </span>
        </div>

        <button
          onClick={() => onRemove(item._id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
