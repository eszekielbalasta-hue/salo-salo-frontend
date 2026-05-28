import { useState, useEffect } from "react";
import API from "../api/apiClient";

const ORDER_API = "/api/orders";

export default function OrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const r = await API.get(ORDER_API); setOrders(r.data); }
    catch (err) { console.error("Failed to load orders:", err.message); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`${ORDER_API}/${id}`, { status });
      fetchOrders();
    } catch (err) { console.error("Failed to update:", err.message); }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    await API.delete(`${ORDER_API}/${id}`);
    fetchOrders();
  };

  const counts = {
    Pending:   orders.filter(o => o.status === "Pending").length,
    Preparing: orders.filter(o => o.status === "Preparing").length,
    Delivered: orders.filter(o => o.status === "Delivered").length,
  };

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Kitchen Dashboard</p>
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="stats-row">
        <div className="stat-card pending">
          <p className="stat-label"><span className="stat-dot"></span>Pending</p>
          <p className="stat-value">{counts.Pending}</p>
        </div>
        <div className="stat-card preparing">
          <p className="stat-label"><span className="stat-dot"></span>Preparing</p>
          <p className="stat-value">{counts.Preparing}</p>
        </div>
        <div className="stat-card delivered">
          <p className="stat-label"><span className="stat-dot"></span>Delivered</p>
          <p className="stat-value">{counts.Delivered}</p>
        </div>
      </div>

      <div className="cat-filter" style={{ marginBottom: "2rem" }}>
        {["All", "Pending", "Preparing", "Delivered"].map(f => (
          <button key={f} className={filter === f ? "cat-btn-active" : "cat-btn"} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="section-divider">
        <span className="section-label">Order List</span>
        <div className="divider-line"></div>
      </div>

      {loading ? (
        <p className="loading">◆ &nbsp; Loading orders… &nbsp; ◆</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-title">No Orders Yet</p>
          <p className="empty-sub">◆ Orders will appear here ◆</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(order => (
            <div className="card" key={order._id}>
              <div className="card-top">
                <p className="order-customer">{order.customerName}</p>
                <span className="order-total">₱{order.totalPrice}</span>
              </div>

              <span className={`badge ${order.status}`}>
                <span className="badge-diamond">◆</span> {order.status}
              </span>

              <div className="payment-status-row">
                <span className="payment-method-badge">
                  {order.paymentMethod === "GCash"   && "💙 "}
                  {order.paymentMethod === "PayMaya" && "💚 "}
                  {order.paymentMethod === "PayPal"  && "🔵 "}
                  {order.paymentMethod === "Cash"    && "💵 "}
                  {order.paymentMethod}
                </span>
                <span className={`payment-status-badge ${order.paymentStatus}`}>
                  {order.paymentStatus === "Paid" ? "✓ Paid"
                    : order.paymentStatus === "Pending" ? "⏳ Pending" : "✕ Failed"}
                </span>
              </div>

              <div className="order-items-list">
                {order.items.map((it, i) => (
                  <p key={i}>— {it.menuItem?.name || "Dish"} × {it.quantity}</p>
                ))}
              </div>

              <p className="order-meta">{new Date(order.createdAt).toLocaleString()}</p>

              <div className="card-divider"></div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select
                  className="status-select"
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Delivered</option>
                </select>
                <button className="btn-danger" onClick={() => deleteOrder(order._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}