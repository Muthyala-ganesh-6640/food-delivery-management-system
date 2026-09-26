import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/delivery/orders/available');
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await API.put(`/delivery/orders/${id}/accept`);
      setOrders(orders.filter((o) => o._id !== id));
      alert('Order accepted! Check active delivery tab.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading available trips..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Available Deliveries</h1>
        <p className="text-xs text-slate-500">Pick up orders ready at partner restaurants</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400">Order #{ord.orderId}</span>
              <h3 className="font-bold text-slate-800 text-sm">{ord.restaurant?.name}</h3>
              <p className="text-xs text-slate-500">Customer: {ord.address?.name} ({ord.address?.area})</p>
            </div>
            <button
              onClick={() => handleAccept(ord._id)}
              className="bg-brand-orange text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-orange-600"
            >
              Accept Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableOrders;
