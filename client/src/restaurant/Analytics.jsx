import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/restaurants/my/analytics');
      if (res.data) setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Calculating store analytics..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Analytics & Sales Reports</h1>
        <p className="text-xs text-slate-500">Track your order volume, best-sellers & revenue breakdown</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Revenue</span>
          <span className="text-3xl font-black text-slate-900">₹{data?.totalRevenue || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Orders</span>
          <span className="text-3xl font-black text-slate-900">{data?.totalOrders || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Rating</span>
          <span className="text-3xl font-black text-amber-500">★ {data?.rating || 4.5}</span>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Best Selling Menu Items</h3>
        <div className="space-y-3">
          {data?.popularFoods?.map((food) => (
            <div key={food._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl text-xs">
              <div className="flex items-center gap-3">
                <img src={food.image} alt={food.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-slate-800">{food.name}</h4>
                  <span className="text-slate-400">{food.category}</span>
                </div>
              </div>
              <span className="font-bold text-brand-orange">₹{food.finalPrice || food.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
