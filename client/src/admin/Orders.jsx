import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.put(`/orders/${id}/cancel`, { reason: 'Cancelled by Admin' });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading platform orders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Platform Orders Oversight</h1>
        <p className="text-xs text-slate-500">Live monitoring of all platform orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-orange">Order #{ord.orderId}</span>
              <h4 className="font-bold text-slate-800 text-xs mt-1">Customer: {ord.customer?.name}</h4>
              <p className="text-xs text-slate-500">Restaurant: {ord.restaurant?.name}</p>
              <p className="text-xs text-slate-400">Total: ₹{ord.total} • Method: {ord.paymentMethod}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full uppercase">
                {ord.orderStatus.replace(/_/g, ' ')}
              </span>
              {ord.orderStatus !== 'CANCELLED' && ord.orderStatus !== 'DELIVERED' && (
                <button
                  onClick={() => handleCancel(ord._id)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100"
                >
                  Admin Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
