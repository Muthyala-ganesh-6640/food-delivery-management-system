import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import API from '../services/api';

const categoriesList = ['Biryani', 'Pizza', 'Burger', 'North Indian', 'South Indian', 'Chinese', 'Snacks', 'Desserts', 'Beverages', 'Breakfast', 'Fast Food'];

const MenuManagement = () => {
  const [foods, setFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: 'Biryani',
    price: '',
    discount: 0,
    isVeg: true,
    preparationTime: '15-20 min',
    isAvailable: true,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const restRes = await API.get('/restaurants/my/profile');
      if (restRes.data) {
        setRestaurant(restRes.data);
        const foodRes = await API.get(`/foods?restaurantId=${restRes.data._id}`);
        if (foodRes.data) setFoods(foodRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      category: 'Biryani',
      price: '',
      discount: 0,
      isVeg: true,
      preparationTime: '15-20 min',
      isAvailable: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      image: food.image,
      category: food.category,
      price: food.price,
      discount: food.discount || 0,
      isVeg: food.isVeg,
      preparationTime: food.preparationTime || '15-20 min',
      isAvailable: food.isAvailable,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        const res = await API.put(`/foods/${editingFood._id}`, formData);
        if (res.data) {
          setFoods(foods.map((f) => (f._id === editingFood._id ? res.data : f)));
        }
      } else {
        const res = await API.post('/foods', {
          ...formData,
          restaurant: restaurant._id,
        });
        if (res.data) {
          setFoods([...foods, res.data]);
        }
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await API.delete(`/foods/${id}`);
      setFoods(foods.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading menu items..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Menu Management</h1>
          <p className="text-xs text-slate-500">Add, update prices & discounts for your restaurant items</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Food</span>
        </Button>
      </div>

      {/* Food Items Table / Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food._id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                alt={food.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{food.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-1">{food.category}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-slate-900">₹{food.finalPrice || food.price}</span>
                  {food.discount > 0 && <span className="text-xs text-slate-400 line-through">₹{food.price}</span>}
                  {food.discount > 0 && <span className="text-[10px] font-bold text-rose-500">({food.discount}% OFF)</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${food.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {food.isAvailable ? 'Available' : 'Out of Stock'}
              </span>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(food)} className="p-2 text-slate-600 hover:text-brand-orange hover:bg-rose-50 rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(food._id)} className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFood ? 'Edit Food Item' : 'Add New Food Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Food Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Veg / Non-Veg</label>
              <select
                value={formData.isVeg ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'true' })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="true">Vegetarian</option>
                <option value="false">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Discount (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              rows="2"
            ></textarea>
          </div>

          <Button type="submit" fullWidth>
            {editingFood ? 'Save Changes' : 'Create Item'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagement;
