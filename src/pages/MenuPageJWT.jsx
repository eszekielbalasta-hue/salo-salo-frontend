import { useState, useEffect } from "react";
import axios from "axios";

const API = "/api/menu";

const getFoodIcon = (name, category) => {
  const n = name.toLowerCase();
  if (n.includes('kare'))                               return '🥘';
  if (n.includes('adobo'))                              return '🍖';
  if (n.includes('sinigang'))                           return '🍲';
  if (n.includes('lechon') || n.includes('litson'))     return '🐷';
  if (n.includes('sisig'))                              return '🥩';
  if (n.includes('bicol') || n.includes('laing'))       return '🌶️';
  if (n.includes('tinola'))                             return '🍗';
  if (n.includes('nilaga'))                             return '🍖';
  if (n.includes('caldereta') || n.includes('kaldereta'))return '🥩';
  if (n.includes('paksiw'))                             return '🐟';
  if (n.includes('bangus'))                             return '🐠';
  if (n.includes('crispy pata') || n.includes('pata')) return '🍗';
  if (n.includes('bulalo'))                             return '🦴';
  if (n.includes('pancit') || n.includes('pansit'))     return '🍜';
  if (n.includes('palabok'))                            return '🍝';
  if (n.includes('rice') || n.includes('sinangag'))     return '🍚';
  if (n.includes('longganisa'))                         return '🌭';
  if (n.includes('tocino'))                             return '🥓';
  if (n.includes('tapa'))                               return '🥩';
  if (n.includes('lumpia'))                             return '🥟';
  if (n.includes('arroz caldo'))                        return '🍲';
  if (n.includes('menudo'))                             return '🍛';
  if (n.includes('dinuguan'))                           return '🍛';
  if (n.includes('kinilaw'))                            return '🐟';
  if (n.includes('inihaw'))                             return '🍢';
  if (n.includes('isaw'))                               return '🍡';
  if (n.includes('halo-halo') || n.includes('halo halo')) return '🍧';
  if (n.includes('sago') || n.includes('gulaman'))      return '🧋';
  if (n.includes('buko') || n.includes('coconut'))      return '🥥';
  if (n.includes('calamansi'))                          return '🍋';
  if (n.includes('mango'))                              return '🥭';
  if (n.includes('coffee') || n.includes('kape'))       return '☕';
  if (n.includes('tea'))                                return '🍵';
  if (n.includes('juice'))                              return '🧃';
  if (n.includes('leche flan') || n.includes('flan'))   return '🍮';
  if (n.includes('bibingka'))                           return '🎂';
  if (n.includes('puto'))                               return '🧁';
  if (n.includes('turon'))                              return '🌯';
  if (n.includes('ube'))                                return '🟣';
  if (n.includes('polvoron'))                           return '🍪';
  if (n.includes('yema'))                               return '🟡';
  if (n.includes('ice cream'))                          return '🍦';
  if (n.includes('cassava'))                            return '🍠';
  if (n.includes('biko') || n.includes('kalamay'))      return '🍡';
  if (category === 'Drinks')   return '🥤';
  if (category === 'Desserts') return '🍮';
  return '🍽';
};

export default function MenuPage({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Meals" });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const r = await axios.get(API, { headers }); setItems(r.data); }
    catch { setError("Failed to load menu."); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category)
      return setError("Name, price and category are required.");
    try {
      if (editItem) await axios.put(`${API}/${editItem._id}`, form, { headers });
      else await axios.post(API, form, { headers });
      setForm({ name: "", description: "", price: "", category: "Meals" });
      setEditItem(null); setError(""); fetchItems();
    } catch { setError("Failed to save item."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this dish from the menu?")) return;
    await axios.delete(`${API}/${id}`, { headers }); fetchItems();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description || "", price: item.price, category: item.category });
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Our Offerings</p>
        <h1 className="page-title">The Menu</h1>
        <p className="page-subtitle">{items.length} dish{items.length !== 1 ? "es" : ""} crafted with passion</p>
      </div>

      <div className="form-card">
        <p className="form-title">{editItem ? "Edit Dish" : "Add New Dish"}</p>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-grid">
          <div className="form-group">
            <label>Dish Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Kare-Kare" />
          </div>
          <div className="form-group">
            <label>Price (₱)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="350" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Meals</option>
              <option>Drinks</option>
              <option>Desserts</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="A brief description..." />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>
            {editItem ? "Update Dish" : "Add to Menu"}
          </button>
          {editItem && (
            <button className="btn-secondary" onClick={() => {
              setEditItem(null);
              setForm({ name: "", description: "", price: "", category: "Meals" });
            }}>Cancel</button>
          )}
        </div>
      </div>

      <div className="section-divider">
        <span className="section-label">All Dishes</span>
        <div className="divider-line"></div>
      </div>

      {loading ? (
        <p className="loading">◆ &nbsp; Preparing the menu… &nbsp; ◆</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽</div>
          <p className="empty-title">The Menu Awaits</p>
          <p className="empty-sub">◆ Add your first masterpiece above ◆</p>
        </div>
      ) : (
        <div className="cards-grid">
          {items.map(item => (
            <div className="card" key={item._id}>
              <div className="card-top">
                <div className="card-icon">
                  <span>{getFoodIcon(item.name, item.category)}</span>
                </div>
                <span className="price">₱{item.price}</span>
              </div>
              <h3>{item.name}</h3>
              {item.description && <p className="description">{item.description}</p>}
              <span className="badge badge-category">
                <span className="badge-diamond">◆</span>
                {item.category}
              </span>
              <div className="card-divider"></div>
              <div className="card-actions">
                <button className="btn-ghost" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}