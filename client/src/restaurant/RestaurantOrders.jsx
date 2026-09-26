import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import API from '../services/api';

const RestaurantOrders = () => {
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data) {
        setOrders(orders.map((o) => (o._id === orderId ? res.data : o)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading kitchen orders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Kitchen Orders</h1>
        <p className="text-xs text-slate-500">Real-time status updates for active customer orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Order #{order.orderId}</span>
                <h3 className="font-bold text-slate-800 text-sm">{order.customer?.name} ({order.customer?.phone})</h3>
                <p className="text-xs text-slate-500">{order.address?.street}, {order.address?.area}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full uppercase">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
                <span className="font-extrabold text-slate-900 text-sm">₹{order.total}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 text-xs text-slate-600">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.quantity}x {i.name}</span>
                  <span className="font-bold">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* Status Control Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              {order.orderStatus === 'PLACED' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'CONFIRMED')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'CANCELLED')}
                    className="px-4 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100"
                  >
                    Reject Order
                  </button>
                </>
              )}

              {order.orderStatus === 'CONFIRMED' && (
                <button
                  onClick={() => handleUpdateStatus(order._id, 'PREPARING')}
                  className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600"
                >
                  Start Preparing
                </button>
              )}

              {order.orderStatus === 'PREPARING' && (
                <button
                  onClick={() => handleUpdateStatus(order._id, 'READY_FOR_PICKUP')}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
                >
                  Ready For Pickup
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantOrders;
