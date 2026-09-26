import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const DeliveryHistory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/delivery/earnings');
      if (res.data) setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading delivery history..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Completed Trip Logs</h1>
        <p className="text-xs text-slate-500">History of all successfully delivered orders</p>
      </div>

      <div className="space-y-3">
        {data?.completedOrders?.map((ord) => (
          <div key={ord._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Order #{ord.orderId}</span>
              <p className="text-slate-500">{ord.address?.area || 'Delivery'}</p>
              <span className="text-[10px] text-slate-400 block">{new Date(ord.updatedAt).toLocaleString()}</span>
            </div>
            <span className="font-extrabold text-emerald-600">+ ₹50</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryHistory;
