import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/delivery-partners');
      if (res.data) setPartners(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/delivery-partners/${id}/approve`);
      if (res.data) {
        setPartners(partners.map((p) => (p._id === id ? res.data : p)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading delivery partners..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Delivery Partner KYC & Fleet</h1>
        <p className="text-xs text-slate-500">Approve rider applications & track delivery earnings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div key={p._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{p.user?.name}</h3>
              <p className="text-xs text-slate-400">{p.user?.phone} • {p.vehicleType}</p>
              <p className="text-xs text-slate-500 mt-1">Vehicle No: {p.vehicleNumber}</p>
              <p className="text-xs text-slate-500">License: {p.licenseNumber}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {p.isApproved ? 'Approved KYC' : 'Pending Verification'}
              </span>

              {!p.isApproved && (
                <button
                  onClick={() => handleApprove(p._id)}
                  className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                >
                  Approve KYC
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPartners;
