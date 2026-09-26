import React, { useState, useEffect } from 'react';
import { MapPin, Phone, CheckCircle2, Navigation } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const ActiveDelivery = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrder();
  }, []);

  const fetchActiveOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      if (res.data) {
        const active = res.data.find(
          (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
        );
        setOrder(active || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;
    try {
      const res = await API.put(`/orders/${order._id}/status`, { status: newStatus });
      if (res.data) setOrder(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading active delivery details..." />;

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-4xl">🛵</p>
        <h2 className="text-xl font-bold text-slate-800">No Active Delivery</h2>
        <p className="text-xs text-slate-500">Go to Available Orders tab to accept a trip.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Active Delivery Navigation</h1>
        <p className="text-xs text-slate-500">Order #{order.orderId}</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Status indicator */}
        <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
          <span className="text-xs font-bold text-brand-orange uppercase">
            Status: {order.orderStatus.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-extrabold text-slate-800">Earn ₹50</span>
        </div>

        {/* Pickup & Drop Points */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">1. Pickup Restaurant</span>
              <h4 className="font-bold text-slate-800 text-sm">{order.restaurant?.name}</h4>
              <p className="text-xs text-slate-500">{order.restaurant?.address?.street}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">2. Customer Drop Location</span>
              <h4 className="font-bold text-slate-800 text-sm">{order.address?.name} ({order.address?.phone})</h4>
              <p className="text-xs text-slate-500">{order.address?.houseNo}, {order.address?.street}, {order.address?.area}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          {order.orderStatus === 'READY_FOR_PICKUP' && (
            <button
              onClick={() => handleUpdateStatus('PICKED_UP')}
              className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
            >
              Confirm Food Picked Up
            </button>
          )}

          {order.orderStatus === 'PICKED_UP' && (
            <button
              onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
              className="w-full py-3 bg-brand-orange text-white font-bold text-xs rounded-xl hover:bg-orange-600"
            >
              Start Out for Delivery
            </button>
          )}

          {order.orderStatus === 'OUT_FOR_DELIVERY' && (
            <button
              onClick={() => handleUpdateStatus('DELIVERED')}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveDelivery;
