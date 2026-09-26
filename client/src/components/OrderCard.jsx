import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

const statusColors = {
  PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  PREPARING: 'bg-amber-50 text-amber-700 border-amber-200',
  READY_FOR_PICKUP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PICKED_UP: 'bg-purple-50 text-purple-700 border-purple-200',
  OUT_FOR_DELIVERY: 'bg-orange-50 text-brand-orange border-orange-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const OrderCard = ({ order, onReorder }) => {
  const restaurant = order.restaurant || {};

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
            <img
              src={restaurant.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{restaurant.name || 'FoodExpress Partner'}</h4>
            <p className="text-xs text-slate-400">Order #{order.orderId}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            statusColors[order.orderStatus] || 'bg-slate-50 text-slate-700'
          }`}
        >
          {order.orderStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Items Summary */}
      <div className="mb-4">
        <p className="text-xs text-slate-600 mb-1 font-medium">
          {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
        </p>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </p>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 block">Total Amount</span>
          <span className="text-base font-extrabold text-slate-900">₹{order.total}</span>
        </div>

        <div className="flex items-center gap-2">
          {onReorder && (
            <button
              onClick={() => onReorder(order)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-orange" />
              <span>Reorder</span>
            </button>
          )}

          <Link
            to={`/orders/${order._id}`}
            className="flex items-center gap-1 bg-brand-orange hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Track Order</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
