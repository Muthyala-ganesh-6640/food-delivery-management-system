import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import API from '../services/api';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Home',
    houseNo: '',
    street: '',
    area: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '',
    landmark: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/addresses');
      if (res.data) setAddresses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/addresses', formData);
      if (res.data) {
        setAddresses([...addresses, res.data]);
        setShowForm(false);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/addresses/${id}`);
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading addresses..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Saved Addresses</h1>
          <p className="text-xs text-slate-500">Manage your home, work, & other delivery locations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Address</span>
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="House / Flat No."
            required
            value={formData.houseNo}
            onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <input
            type="text"
            placeholder="Street Address"
            required
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <input
            type="text"
            placeholder="Area"
            required
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <input
            type="text"
            placeholder="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <input
            type="text"
            placeholder="Pincode"
            required
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <Button type="submit" className="sm:col-span-2">Save Address</Button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-orange bg-rose-100 px-2 py-0.5 rounded mb-2 inline-block">
                {addr.type}
              </span>
              <p className="text-xs font-bold text-slate-800">{addr.houseNo}, {addr.street}</p>
              <p className="text-xs text-slate-500">{addr.area}, {addr.city} - {addr.pincode}</p>
            </div>
            <button onClick={() => handleDelete(addr._id)} className="text-slate-400 hover:text-rose-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
