import React, { useState, useEffect } from "react";
import axios from "axios";

// 1. LIVE Render API Endpoint
const API_MENU = "https://salo-salo-backend.onrender.com/api/menu";

export default function MenuPageJWT() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Meals");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Helper to grab token and configure authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const r = await axios.get(API_MENU);
      setMenuItems(r.data);
    } catch (err) {
      console.error("Failed to fetch menu items.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return alert("Please fill in the Item Name and Price.");

    const itemPayload = { name, price: Number(price), category, description, imageUrl };

    try {
      if (editingId) {
        // Update existing item
        await axios.put(`${API_MENU}/${editingId}`, itemPayload, getAuthHeaders());
        alert("Dish updated successfully!");
      } else {
        // Add new item
        await axios.post(API_MENU, itemPayload, getAuthHeaders());
        alert("New dish added to the menu!");
      }
      resetForm();
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed or server error.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setDescription(item.description || "");
    setImageUrl(item.imageUrl || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`${API_MENU}/${id}`, getAuthHeaders());
      alert("Dish deleted successfully.");
      fetchMenuItems();
    } catch (err) {
      alert("Failed to delete item. Ensure you are authorized.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("Meals");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px', padding: '30px', maxWidth: '1300px', margin: '0 auto', color: '#fff' }}>
      
      {/* LEFT COLUMN: MANAGEMENT FORM */}
      <div style={{ 
        background: 'linear-gradient(145deg, #1a0f05, #0a0500)', 
        border: '1px solid rgba(247, 208, 112, 0.3)',
        padding: '25px',
        position: 'sticky',
        top: '20px'
      }}>
        <div style={{ borderBottom: '1px solid rgba(247, 208, 112, 0.3)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ color: '#f7d070', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', margin: 0 }}>
            {editingId ? "Edit Menu Item" : "Add New Dish"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#f7d070', fontSize: '0.8rem', textTransform: 'uppercase' }}>Item Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ background: '#25150b', border: '1px solid #b58d2a', padding: '10px', color: '#fff' }}
              placeholder="e.g., Chicken Adobo"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#f7d070', fontSize: '0.8rem', textTransform: 'uppercase' }}>Price (₱) *</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              style={{ background: '#25150b', border: '1px solid #b58d2a', padding: '10px', color: '#fff' }}
              placeholder="199"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#f7d070', fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ background: '#25150b', border: '1px solid #b58d2a', padding: '10px', color: '#fff', cursor: 'pointer' }}
            >
              <option value="Meals">Meals</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#f7d070', fontSize: '0.8rem', textTransform: 'uppercase' }}>Image URL</label>
            <input 
              type="text" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ background: '#25150b', border: '1px solid #b58d2a', padding: '10px', color: '#fff' }}
              placeholder="https://example.com/food.jpg"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#f7d070', fontSize: '0.8rem', textTransform: 'uppercase' }}>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              style={{ background: '#25150b', border: '1px solid #b58d2a', padding: '10px', color: '#fff', minHeight: '80px', resize: 'vertical' }}
              placeholder="Describe the flavors and ingredients..."
            />
          </div>

          <button 
            type="submit"
            style={{ 
              marginTop: '10px',
              width: '100%',
              background: 'linear-gradient(to bottom, #f7d070, #b58d2a)',
              border: 'none',
              padding: '12px',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
          >
            {editingId ? "Save Changes" : "Create Item"}
          </button>

          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              style={{ background: 'transparent', border: '1px solid #ff4a4a', color: '#ff4a4a', padding: '10px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* RIGHT COLUMN: CURRENT LIVE MENU ENTRIES */}
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#f7d070', fontSize: '2.5rem', margin: '0 0 5px 0' }}>Menu Dashboard</h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>Securely managing live listings with JWT verified actions.</p>
        </div>

        {loading ? (
          <p style={{ color: '#f7d070' }}>◆ Fetching backend records… ◆</p>
        ) : menuItems.length === 0 ? (
          <p>No dishes on the database menu yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {menuItems.map((item) => (
              <div 
                key={item._id} 
                style={{ 
                  background: 'linear-gradient(145deg, #2a1a10, #140c05)', 
                  border: '1px solid rgba(247, 208, 112, 0.2)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >
                {/* Micro Thumbnail / Visual Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #b58d2a' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: '#25150b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #b58d2a', fontSize: '1.5rem' }}>🍽</div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontFamily: 'serif', fontSize: '1.2rem' }}>{item.name}</h3>
                      <span style={{ fontSize: '0.7rem', background: '#f7d070', color: '#000', padding: '2px 6px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.category}</span>
                    </div>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#bbb' }}>{item.description || "No description provided."}</p>
                  </div>
                </div>

                {/* Actions & Price Right Aligned */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '120px' }}>
                  <span style={{ color: '#f7d070', fontWeight: 'bold', fontSize: '1.2rem' }}>₱{item.price}</span>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleEdit(item)}
                      style={{ background: 'transparent', border: '1px solid #f7d070', color: '#f7d070', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      style={{ background: '#ff4a4a', border: 'none', color: '#fff', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 'bold' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}