import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      if (res.data) setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader text="Loading notifications..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">Stay updated on your order status & offers</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-3xl mb-2">🔔</p>
          <h3 className="font-bold text-slate-800 text-sm">No notifications yet</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-2xl border transition-all ${
                notif.isRead
                  ? 'bg-white border-slate-100 text-slate-600'
                  : 'bg-rose-50/50 border-rose-200 text-slate-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-xs text-brand-orange">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-slate-800">{notif.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
