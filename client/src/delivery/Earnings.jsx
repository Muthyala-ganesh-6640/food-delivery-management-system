import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const Earnings = () => {
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

  if (loading) return <Loader text="Calculating earnings breakdown..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Rider Earnings</h1>
        <p className="text-xs text-slate-500">Track payouts per trip and customer tips</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Payout</span>
          <span className="text-3xl font-black text-emerald-600">₹{data?.totalEarnings || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Deliveries</span>
          <span className="text-3xl font-black text-slate-900">{data?.totalDeliveries || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Rider Rating</span>
          <span className="text-3xl font-black text-amber-500">★ {data?.rating || 4.8}</span>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
