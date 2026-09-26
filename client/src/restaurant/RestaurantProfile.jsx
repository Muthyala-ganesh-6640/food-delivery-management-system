import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import API from '../services/api';

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    cuisine: '',
    openingTime: '09:00 AM',
    closingTime: '11:00 PM',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get('/restaurants/my/profile');
      if (res.data) {
        setRestaurant(res.data);
        setFormData({
          name: res.data.name || '',
          description: res.data.description || '',
          logo: res.data.logo || '',
          banner: res.data.banner || '',
          cuisine: res.data.cuisine ? res.data.cuisine.join(', ') : '',
          openingTime: res.data.openingTime || '09:00 AM',
          closingTime: res.data.closingTime || '11:00 PM',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const cuisineArr = formData.cuisine.split(',').map((c) => c.trim());
      const res = await API.put(`/restaurants/${restaurant._id}`, {
        ...formData,
        cuisine: cuisineArr,
      });
      if (res.data) {
        setRestaurant(res.data);
        setMsg('Restaurant profile saved successfully!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading store profile..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Restaurant Settings</h1>
        <p className="text-xs text-slate-500">Update logo, banner, opening hours & description</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {msg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Restaurant Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Cuisines (Comma Separated)</label>
            <input
              type="text"
              required
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Opening Time</label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Closing Time</label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Logo Image URL</label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Banner Image URL</label>
            <input
              type="text"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              rows="3"
            ></textarea>
          </div>

          <Button type="submit" fullWidth>
            Save Restaurant Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantProfile;
