import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Utensils, Star, TrendingUp, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const RestaurantDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, restRes, ordersRes] = await Promise.all([
        API.get('/restaurants/my/analytics'),
        API.get('/restaurants/my/profile'),
        API.get('/orders'),
      ]);

      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      if (restRes.data) setRestaurant(restRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!restaurant) return;
    try {
      const res = await API.put(`/restaurants/${restaurant._id}`, {
        isOpen: !restaurant.isOpen,
      });
      if (res.data) setRestaurant(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading partner dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={restaurant?.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'}
            alt={restaurant?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
          />
          <div>
            <h1 className="text-2xl font-black text-slate-900">{restaurant?.name || 'Your Kitchen'}</h1>
            <p className="text-xs text-slate-500">Restaurant Partner Portal</p>
          </div>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">
            Status: {restaurant?.isOpen ? 'ONLINE (Accepting Orders)' : 'OFFLINE (Closed)'}
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              restaurant?.isOpen ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                restaurant?.isOpen ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/restaurant/orders"
          className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-all"
        >
          <ShoppingBag className="w-8 h-8 mb-3" />
          <h3 className="font-extrabold text-base">Manage Orders</h3>
          <p className="text-xs text-amber-100 mt-1">Accept & update order status</p>
        </Link>

        <Link
          to="/restaurant/menu"
          className="bg-slate-900 text-white p-5 rounded-3xl shadow-md hover:shadow-xl transition-all"
        >
          <Utensils className="w-8 h-8 text-brand-orange mb-3" />
          <h3 className="font-extrabold text-base">Menu Items</h3>
          <p className="text-xs text-slate-400 mt-1">Add, edit & pricing controls</p>
        </Link>

        <Link
          to="/restaurant/analytics"
          className="bg-white text-slate-900 border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all"
        >
          <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="font-extrabold text-base">Analytics</h3>
          <p className="text-xs text-slate-400 mt-1">Revenue graphs & popular foods</p>
        </Link>

        <Link
          to="/restaurant/profile"
          className="bg-white text-slate-900 border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all"
        >
          <Star className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-extrabold text-base">Store Profile</h3>
          <p className="text-xs text-slate-400 mt-1">Timings, banners & details</p>
        </Link>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Revenue</span>
          <span className="text-2xl font-black text-slate-900">₹{analytics?.totalRevenue || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Orders</span>
          <span className="text-2xl font-black text-slate-900">{analytics?.totalOrders || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Today's Orders</span>
          <span className="text-2xl font-black text-slate-900">{analytics?.todayOrders || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Store Rating</span>
          <span className="text-2xl font-black text-slate-900 flex items-center gap-1 text-amber-500">
            ★ {analytics?.rating || 4.5}
          </span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Recent Kitchen Orders</h3>
          <Link to="/restaurant/orders" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No orders received yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-800">Order #{ord.orderId}</span>
                  <p className="text-slate-500">{ord.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block">₹{ord.total}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
