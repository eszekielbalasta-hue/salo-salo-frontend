import { useState, useEffect } from "react";
import axios from "axios";

const ORDER_API = "/api/orders";
const MENU_API  = "/api/menu";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customerName: "", menuItem: "", quantity: 1 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [o, m] = await Promise.all([axios.get(ORDER_API), axios.get(MENU_API)]);
      setOrders(o.data); setMenuItems(m.data);
    } catch { setError("Failed to load data."); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.menuItem) return setError("Guest name and dish are required.");
    const selected = menuItems.find(m => m._id === form.menuItem);
    if (!selected) return setError("Please select a valid dish.");
    try {
      await axios.post(ORDER_API, {
        customerName: form.customerName,
        items: [{ menuItem: form.menuItem, quantity: Number(form.quantity) }],
        totalPrice: selected.price * Number(form.quantity),
      });
      setForm({ customerName: "", menuItem: "", quantity: 1 });
      setError(""); fetchAll();
    } catch { setError("Failed to place order."); }
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(`${ORDER_API}/${id}`, { status }); fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this order?")) return;
    await axios.delete(`${ORDER_API}/${id}`); fetchAll();
  };

  const counts = { Pending: 0, Preparing: 0, Delivered: 0 };
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Service</p>
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? "s" : ""} received</p>
      </div>

      <div className="stats-row">
        <div className="stat-card pending">
          <p className="stat-label"><span className="stat-dot"></span>Awaiting</p>
          <p className="stat-value">{counts.Pending}</p>
        </div>
        <div className="stat-card preparing">
          <p className="stat-label"><span className="stat-dot"></span>In Kitchen</p>
          <p className="stat-value">{counts.Preparing}</p>
        </div>
        <div className="stat-card delivered">
          <p className="stat-label"><span className="stat-dot"></span>Served</p>
          <p className="stat-value">{counts.Delivered}</p>
        </div>
      </div>

      <div className="form-card">
        <p className="form-title">New Order</p>
        {error && <p className="error-msg">{error}</p>}
        <div className="form-grid">
          <div className="form-group">
            <label>Guest Name</label>
            <input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="e.g. Maria Santos" />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
          </div>
          <div className="form-group full">
            <label>Select Dish</label>
            <select value={form.menuItem} onChange={e => setForm({...form, menuItem: e.target.value})}>
              <option value="">◆ Choose from the menu ◆</option>
              {menuItems.map(m => <option key={m._id} value={m._id}>{m.name} — ₱{m.price}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSubmit}>Place Order</button>
        </div>
      </div>

      <div className="section-divider">
        <span className="section-label">All Orders</span>
        <div className="divider-line"></div>
      </div>

      {loading ? <p className="loading">◆ &nbsp; Loading orders… &nbsp; ◆</p>
        : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-title">No Orders Yet</p>
            <p className="empty-sub">◆ Place the first order above ◆</p>
          </div>
        ) : (
          <div className="cards-grid">
            {orders.map(order => (
              <div className="card" key={order._id}>
                <div className="card-top">
                  <p className="order-customer">{order.customerName}</p>
                  <span className="order-total">₱{order.totalPrice}</span>
                </div>
                <span className={`badge ${order.status}`}>
                  <span className="badge-diamond">◆</span>
                  {order.status}
                </span>
                <div className="order-items-list">
                  {order.items.map((it, i) => (
                    <p key={i}>◇ &nbsp;{it.menuItem?.name || "Dish"} × {it.quantity}</p>
                  ))}
                </div>
                <select className="status-select" value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Delivered</option>
                </select>
                <p className="order-meta">{new Date(order.createdAt).toLocaleString()}</p>
                <div className="card-actions">
                  <button className="btn-danger" onClick={() => handleDelete(order._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}