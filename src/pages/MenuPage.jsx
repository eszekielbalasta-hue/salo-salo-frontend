import { useState, useEffect } from "react";
import axios from "axios";

const API = "/api/menu";

const getFoodIcon = (name, category) => {
  const n = name.toLowerCase();
  if (n.includes('kare'))        return '🥘';
  if (n.includes('adobo'))       return '🍖';
  if (n.includes('sinigang'))    return '🍲';
  if (n.includes('lechon'))      return '🐷';
  if (n.includes('sisig'))       return '🥩';
  if (n.includes('bicol'))       return '🌶️';
  if (n.includes('tinola'))      return '🍗';
  if (n.includes('bulalo'))      return '🦴';
  if (n.includes('pancit'))      return '🍜';
  if (n.includes('lumpia'))      return '🥟';
  if (n.includes('halo-halo'))   return '🍧';
  if (n.includes('buko'))        return '🥥';
  if (n.includes('mango'))       return '🥭';
  if (n.includes('leche flan'))  return '🍮';
  if (n.includes('bibingka'))    return '🎂';
  if (n.includes('turon'))       return '🌯';
  if (n.includes('ube'))         return '🟣';
  if (n.includes('sago'))        return '🧋';
  if (n.includes('calamansi'))   return '🍋';
  if (category === 'Drinks')     return '🥤';
  if (category === 'Desserts')   return '🍮';
  return '🍽';
};

export default function MenuPage({ token }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "",
    category: "Meals", imageUrl: ""
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const r = await axios.get(API, getHeaders()); setItems(r.data); }
    catch (err) { setError("Failed to load menu: " + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category)
      return setError("Name, price and category are required.");
    try {
      if (editItem) await axios.put(`${API}/${editItem._id}`, form, getHeaders());
      else await axios.post(API, form, getHeaders());
      setForm({ name: "", description: "", price: "", category: "Meals", imageUrl: "" });
      setEditItem(null); setError(""); fetchItems();
    } catch (err) { setError("Failed to save: " + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this dish?")) return;
    await axios.delete(`${API}/${id}`, getHeaders()); fetchItems();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, description: item.description || "",
      price: item.price, category: item.category,
      imageUrl: item.imageUrl || ""
    });
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
          <div className="form-group full">
            <label>Image URL (paste any image link)</label>
            <input
              value={form.imageUrl}
              onChange={e => setForm({...form, imageUrl: e.target.value})}
              placeholder="https://... (right-click any food photo online → Copy image address)"
            />
            {form.imageUrl && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={form.imageUrl}
                  alt="preview"
                  style={{ width: 60, height: 60, objectFit: "cover", border: "1px solid var(--b2)", borderRadius: 4 }}
                  onError={e => e.target.style.display = "none"}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--t3)", fontFamily: "Cinzel, serif" }}>Preview</span>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>
            {editItem ? "Update Dish" : "Add to Menu"}
          </button>
          {editItem && (
            <button className="btn-secondary" onClick={() => {
              setEditItem(null);
              setForm({ name: "", description: "", price: "", category: "Meals", imageUrl: "" });
            }}>Cancel</button>
          )}
        </div>
      </div>

      {/* Tip box */}
      <div style={{
        background: "rgba(232,160,32,0.06)",
        border: "1px solid var(--b1)",
        padding: "1rem 1.25rem",
        marginBottom: "2rem",
        fontSize: "0.78rem",
        color: "var(--t3)",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.6
      }}>
        💡 <strong style={{ color: "var(--g3)" }}>How to add a dish photo:</strong> Go to Google Images → search the dish name → right-click any photo → <em>"Copy image address"</em> → paste it in the Image URL field above!
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
              {/* Image or icon */}
              {item.imageUrl ? (
                <div style={{ position: "relative", marginBottom: 4 }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      display: "block",
                      border: "1px solid var(--b1)",
                    }}
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                  {/* Fallback icon if image fails */}
                  <div style={{ display: "none", width: "100%", height: 160, alignItems: "center", justifyContent: "center", fontSize: "3rem", background: "rgba(30,15,0,0.5)", border: "1px solid var(--b1)" }}>
                    {getFoodIcon(item.name, item.category)}
                  </div>
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.7)",
                    color: "var(--g1)",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1rem",
                    padding: "4px 10px",
                    border: "1px solid var(--b2)",
                    backdropFilter: "blur(6px)",
                  }}>₱{item.price}</span>
                </div>
              ) : (
                <div className="card-top">
                  <div className="card-icon"><span>{getFoodIcon(item.name, item.category)}</span></div>
                  <span className="price">₱{item.price}</span>
                </div>
              )}

              <h3>{item.name}</h3>
              {item.description && <p className="description">{item.description}</p>}
              <span className="badge badge-category">
                <span className="badge-diamond">◆</span> {item.category}
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