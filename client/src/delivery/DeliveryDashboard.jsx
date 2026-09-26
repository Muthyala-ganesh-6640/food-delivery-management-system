import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bike, DollarSign, PackageCheck, Star, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const DeliveryDashboard = () => {
  const [partner, setPartner] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      const [pRes, eRes, oRes] = await Promise.all([
        API.get('/delivery/profile'),
        API.get('/delivery/earnings'),
        API.get('/delivery/orders/available'),
      ]);

      if (pRes.data) setPartner(pRes.data);
      if (eRes.data) setEarnings(eRes.data);
      if (oRes.data) setAvailableOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!partner) return;
    const nextStatus = partner.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    try {
      const res = await API.put('/delivery/status', { status: nextStatus });
      if (res.data) setPartner(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await API.put(`/delivery/orders/${orderId}/accept`);
      fetchDeliveryData();
      alert('Order accepted! Navigate to Active Delivery screen.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading rider dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Rider Status Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{partner?.user?.name || 'Rider'}</h1>
            <p className="text-xs text-slate-500">Vehicle: {partner?.vehicleType} ({partner?.vehicleNumber})</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">
            Duty Status: {partner?.status === 'ONLINE' ? 'ONLINE (Receiving Trips)' : 'OFFLINE'}
          </span>
          <button
            onClick={handleToggleStatus}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              partner?.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                partner?.status === 'ONLINE' ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Rider Navigation Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/delivery/available" className="bg-cyan-600 text-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-all">
          <Bike className="w-8 h-8 mb-3" />
          <h3 className="font-extrabold text-base">Available Orders</h3>
          <p className="text-xs text-cyan-100 mt-1">{availableOrders.length} pending pickup</p>
        </Link>

        <Link to="/delivery/active" className="bg-slate-900 text-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-all">
          <MapPin className="w-8 h-8 text-brand-orange mb-3" />
          <h3 className="font-extrabold text-base">Active Trip</h3>
          <p className="text-xs text-slate-400 mt-1">Live navigation screen</p>
        </Link>

        <Link to="/delivery/earnings" className="bg-white text-slate-900 border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <DollarSign className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="font-extrabold text-base">Earnings</h3>
          <p className="text-xs text-slate-400 mt-1">Total: ₹{earnings?.totalEarnings || 0}</p>
        </Link>

        <Link to="/delivery/history" className="bg-white text-slate-900 border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <PackageCheck className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-extrabold text-base">History</h3>
          <p className="text-xs text-slate-400 mt-1">{earnings?.totalDeliveries || 0} completed</p>
        </Link>
      </div>

      {/* Available Orders List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Orders Ready for Pickup</h3>

        {availableOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No orders waiting for pickup right now.</p>
        ) : (
          <div className="space-y-4">
            {availableOrders.map((ord) => (
              <div key={ord._id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-brand-orange">Order #{ord.orderId}</span>
                  <h4 className="font-bold text-slate-800 text-xs mt-1">Pickup: {ord.restaurant?.name}</h4>
                  <p className="text-xs text-slate-500">Drop: {ord.address?.street}, {ord.address?.area}</p>
                  <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Payout: ₹50</span>
                </div>
                <button
                  onClick={() => handleAcceptOrder(ord._id)}
                  className="bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Accept Delivery
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
