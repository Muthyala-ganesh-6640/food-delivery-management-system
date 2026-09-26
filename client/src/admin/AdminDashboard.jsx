import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users as UsersIcon, Utensils, Bike, ShoppingBag, DollarSign, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard');
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading admin control center..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Super Admin Control Center
          </span>
          <h1 className="text-3xl font-black mt-2">FoodExpress Platform Overview</h1>
          <p className="text-xs text-purple-200 mt-1">Monitor users, restaurants, delivery partners & platform revenue</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reports"
            className="bg-white text-purple-900 font-extrabold text-xs px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
          >
            Sales Reports
          </Link>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Platform Revenue</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{stats?.totalRevenue || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Orders</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalOrders || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Active Customers</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 block mb-1">Verified Restaurants</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.totalRestaurants || 0}</span>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-900">
          <span className="text-xs font-semibold block">Today's Orders</span>
          <span className="text-xl font-extrabold">{stats?.todayOrders || 0}</span>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-900">
          <span className="text-xs font-semibold block">Pending Orders</span>
          <span className="text-xl font-extrabold">{stats?.pendingOrders || 0}</span>
        </div>

        <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-2xl text-cyan-900">
          <span className="text-xs font-semibold block">Active Delivery Riders</span>
          <span className="text-xl font-extrabold">{stats?.activeDeliveryPartners || 0}</span>
        </div>

        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-900">
          <span className="text-xs font-semibold block">Cancelled Orders</span>
          <span className="text-xl font-extrabold">{stats?.cancelledOrders || 0}</span>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link to="/admin/users" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <UsersIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Users</span>
        </Link>

        <Link to="/admin/restaurants" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <Utensils className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Restaurants</span>
        </Link>

        <Link to="/admin/delivery-partners" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <Bike className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Riders</span>
        </Link>

        <Link to="/admin/orders" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <ShoppingBag className="w-6 h-6 text-rose-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Orders</span>
        </Link>

        <Link to="/admin/coupons" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Coupons</span>
        </Link>

        <Link to="/admin/reports" className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:border-purple-200 hover:shadow-md transition-all">
          <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-800 block">Reports</span>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Recent Platform Activity</h3>
        <div className="space-y-3">
          {stats?.recentOrders?.map((ord) => (
            <div key={ord._id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-800">Order #{ord.orderId}</span>
                <p className="text-slate-500">{ord.customer?.name} → {ord.restaurant?.name}</p>
              </div>
              <span className="font-extrabold text-slate-900">₹{ord.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
