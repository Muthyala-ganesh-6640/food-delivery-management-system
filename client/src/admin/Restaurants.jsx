import React, { useState, useEffect } from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await API.get('/restaurants');
      if (res.data) setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      const res = await API.put(`/admin/restaurants/${id}/approve`, { isApproved: !currentStatus });
      if (res.data) {
        setRestaurants(restaurants.map((r) => (r._id === id ? res.data : r)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleSuspend = async (id) => {
    try {
      const res = await API.put(`/admin/restaurants/${id}/suspend`);
      if (res.data) {
        setRestaurants(restaurants.map((r) => (r._id === id ? res.data : r)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading restaurants..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Restaurant Approvals & Moderation</h1>
        <p className="text-xs text-slate-500">Approve new restaurant applications & manage suspensions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((rest) => (
          <div key={rest._id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <img src={rest.logo} alt={rest.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{rest.name}</h3>
                <p className="text-xs text-slate-400">{rest.cuisine?.join(', ')}</p>
                <p className="text-[11px] text-slate-500 mt-1">{rest.address?.city}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rest.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rest.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
                {rest.isSuspended && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    Suspended
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApprove(rest._id, rest.isApproved)}
                  className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  {rest.isApproved ? 'Revoke' : 'Approve'}
                </button>
                <button
                  onClick={() => handleToggleSuspend(rest._id)}
                  className="px-3 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100"
                >
                  {rest.isSuspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
