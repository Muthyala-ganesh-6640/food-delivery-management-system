import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import API from '../services/api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountAmount: 20,
    minOrderValue: 199,
    maxDiscount: 150,
    expiryDate: '2027-12-31',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await API.get('/coupons');
      if (res.data) setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/coupons', formData);
      if (res.data) {
        setCoupons([...coupons, res.data]);
        setShowModal(false);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading coupons..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coupon Code Management</h1>
          <p className="text-xs text-slate-500">Create promotional deals & discount coupons</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          <span>Create Coupon</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="bg-rose-50 text-brand-orange text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                {c.code}
              </span>
              <p className="text-xs font-bold text-slate-800 mt-2">{c.description}</p>
              <p className="text-xs text-slate-500">
                Discount: {c.discountType === 'PERCENTAGE' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
              </p>
              <p className="text-xs text-slate-400">Min Order: ₹{c.minOrderValue}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => handleDelete(c._id)} className="text-rose-600 text-xs font-bold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Coupon">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. SUPER50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Discount Type</label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <Button type="submit" fullWidth>
            Create Coupon
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;
