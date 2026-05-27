import { useState, useEffect } from "react";
import axios from "axios";
import PaymentModal from "./PaymentModal";

const MENU_API  = "/api/menu";
const ORDER_API = "/api/orders";

const PAY_ICONS = {
  gcash:   "data:image/png;base64,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",
  paypal:  "data:image/png;base64,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",
  paymaya: "data:image/png;base64,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",
  cash:    "data:image/png;base64,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",
};

const getFoodIcon = (name, category) => {
  const n = name.toLowerCase();
  if (n.includes("kare"))       return "🥘";
  if (n.includes("adobo"))      return "🍖";
  if (n.includes("sinigang"))   return "🍲";
  if (n.includes("lechon"))     return "🐷";
  if (n.includes("sisig"))      return "🥩";
  if (n.includes("bicol"))      return "🌶️";
  if (n.includes("tinola"))     return "🍗";
  if (n.includes("bulalo"))     return "🦴";
  if (n.includes("pancit"))     return "🍜";
  if (n.includes("lumpia"))     return "🥟";
  if (n.includes("halo-halo"))  return "🍧";
  if (n.includes("buko"))       return "🥥";
  if (n.includes("mango"))      return "🥭";
  if (n.includes("leche flan")) return "🍮";
  if (n.includes("bibingka"))   return "🎂";
  if (n.includes("turon"))      return "🌯";
  if (n.includes("ube"))        return "🟣";
  if (n.includes("sago"))       return "🧋";
  if (n.includes("calamansi"))  return "🍋";
  if (category === "Drinks")    return "🥤";
  if (category === "Desserts")  return "🍮";
  return "🍽";
};

const PayIcon = ({ type, size = 28 }) => (
  <img
    src={PAY_ICONS[type]}
    alt={type}
    style={{ width: size, height: size, objectFit: "contain",
      borderRadius: type === "gcash" ? 8 : 4 }}
  />
);

export default function CustomerPage({ username }) {
  const [menuItems, setMenuItems]       = useState([]);
  const [cart, setCart]                 = useState([]);
  const [orders, setOrders]             = useState([]);
  const [activeTab, setActiveTab]       = useState("menu");
  const [loading, setLoading]           = useState(true);
  const [showPayment, setShowPayment]   = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [filter, setFilter]             = useState("All");

  useEffect(() => { fetchMenu(); fetchOrders(); }, []);

  const fetchMenu = async () => {
    try { const r = await axios.get(MENU_API); setMenuItems(r.data); }
    catch { console.error("Failed to load menu"); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const r = await axios.get(ORDER_API);
      setOrders(r.data.filter(o => o.customerName === username));
    } catch { console.error("Failed to load orders"); }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c._id === item._id);
      if (exists) return prev.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(c => c._id === id ? { ...c, qty } : c));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handlePaymentConfirm = async (paymentMethod) => {
    try {
      for (const item of cart) {
        await axios.post(ORDER_API, {
          customerName:  username,
          items:         [{ menuItem: item._id, quantity: item.qty }],
          totalPrice:    item.price * item.qty,
          paymentMethod: paymentMethod,
          paymentStatus: "Pending",
        });
      }
      setCart([]);
      setShowPayment(false);
      setOrderSuccess(
        paymentMethod === "Cash"
          ? `Order placed! Please pay ₱${cartTotal} at the counter.`
          : `Order placed! ${paymentMethod} payment is pending verification.`
      );
      setActiveTab("orders");
      fetchOrders();
      setTimeout(() => setOrderSuccess(""), 6000);
    } catch { alert("Failed to place order. Please try again."); }
  };

  const categories = ["All", "Meals", "Drinks", "Desserts"];
  const filtered   = filter === "All" ? menuItems : menuItems.filter(i => i.category === filter);

  const payMethodIcon = { GCash: "gcash", PayMaya: "paymaya", PayPal: "paypal", Cash: "cash" };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Welcome, {username}</p>
        <h1 className="page-title">Salo-Salo</h1>
        <p className="page-subtitle">◆ Authentic Filipino Fine Dining ◆</p>
      </div>

      <div className="customer-tabs">
        <button className={activeTab === "menu"   ? "ctab-active" : "ctab"} onClick={() => setActiveTab("menu")}>🍽 Menu</button>
        <button className={activeTab === "cart"   ? "ctab-active" : "ctab"} onClick={() => setActiveTab("cart")}>
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className={activeTab === "orders" ? "ctab-active" : "ctab"} onClick={() => setActiveTab("orders")}>📋 My Orders</button>
      </div>

      {activeTab === "menu" && (
        <div>
          <div className="cat-filter">
            {categories.map(c => (
              <button key={c} className={filter === c ? "cat-btn-active" : "cat-btn"}
                onClick={() => setFilter(c)}
                style={{ display:"flex", alignItems:"center", gap:6 }}>
                {c === "Meals" && "🍽"}{c === "Drinks" && "🥤"}{c === "Desserts" && "🍮"} {c}
              </button>
            ))}
          </div>

          {loading ? <p className="loading">◆ Loading menu… ◆</p> : (
            <div className="cards-grid">
              {filtered.map(item => (
                <div className="card" key={item._id}>
                  {item.imageUrl ? (
                    <div style={{ position:"relative", marginBottom:4 }}>
                      <img src={item.imageUrl} alt={item.name}
                        style={{ width:"100%", height:160, objectFit:"cover", border:"1px solid var(--b1)", display:"block" }}
                        onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                      />
                      <div style={{ display:"none", width:"100%", height:160, alignItems:"center", justifyContent:"center", fontSize:"3rem", background:"rgba(20,10,0,0.5)", border:"1px solid var(--b1)" }}>
                        {getFoodIcon(item.name, item.category)}
                      </div>
                      <span style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.75)", color:"var(--g1)", fontFamily:"Playfair Display,serif", fontSize:"1rem", padding:"4px 10px", border:"1px solid var(--b2)", backdropFilter:"blur(6px)" }}>₱{item.price}</span>
                    </div>
                  ) : (
                    <div className="card-top">
                      <div className="card-icon"><span>{getFoodIcon(item.name, item.category)}</span></div>
                      <span className="price">₱{item.price}</span>
                    </div>
                  )}
                  <h3>{item.name}</h3>
                  {item.description && <p className="description">{item.description}</p>}
                  <span className="badge badge-category"><span className="badge-diamond">◆</span> {item.category}</span>
                  <div className="card-divider"></div>
                  <button className="btn-primary" onClick={() => addToCart(item)}>+ Add to Order</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "cart" && (
        <div>
          <div className="section-divider">
            <span className="section-label">Your Cart</span>
            <div className="divider-line"></div>
          </div>
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p className="empty-title">Your cart is empty</p>
              <p className="empty-sub">◆ Browse the menu and add dishes ◆</p>
            </div>
          ) : (
            <div className="cart-container">
              {cart.map(item => (
                <div className="cart-item" key={item._id}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name}
                      style={{ width:48, height:48, objectFit:"cover", border:"1px solid var(--b1)", flexShrink:0, borderRadius:2 }}
                      onError={e => e.target.style.display="none"}
                    />
                  ) : (
                    <div className="cart-icon">{getFoodIcon(item.name, item.category)}</div>
                  )}
                  <div className="cart-info">
                    <p className="cart-name">{item.name}</p>
                    <p className="cart-price">₱{item.price} each</p>
                  </div>
                  <div className="cart-qty">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart-subtotal">₱{item.price * item.qty}</span>
                  <button className="btn-danger" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              ))}

              <div className="cart-total">
                <span className="cart-total-label">◆ Total</span>
                <span className="cart-total-amount">₱{cartTotal}</span>
              </div>

              {/* Payment icons using real logos */}
              <div className="payment-info-bar">
                <span className="pay-badge pay-gcash">
                  <PayIcon type="gcash" size={22}/> GCash
                </span>
                <span className="pay-badge pay-paymaya">
                  <PayIcon type="paymaya" size={22}/> PayMaya
                </span>
                <span className="pay-badge pay-paypal">
                  <PayIcon type="paypal" size={22}/> PayPal
                </span>
                <span className="pay-badge pay-cash">
                  <PayIcon type="cash" size={22}/> Cash
                </span>
              </div>

              <button className="btn-primary btn-full" onClick={() => setShowPayment(true)}>
                Proceed to Payment — ₱{cartTotal}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          {orderSuccess && <p className="success-msg" style={{ marginBottom:"1.5rem" }}>✓ &nbsp;{orderSuccess}</p>}
          <div className="section-divider">
            <span className="section-label">My Orders</span>
            <div className="divider-line"></div>
          </div>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-title">No orders yet</p>
              <p className="empty-sub">◆ Place your first order from the menu ◆</p>
            </div>
          ) : (
            <div className="cards-grid">
              {orders.map(order => (
                <div className="card" key={order._id}>
                  <div className="card-top">
                    <p className="order-customer">#{order._id.slice(-6).toUpperCase()}</p>
                    <span className="order-total">₱{order.totalPrice}</span>
                  </div>
                  <span className={`badge ${order.status}`}>
                    <span className="badge-diamond">◆</span> {order.status}
                  </span>
                  <div className="payment-status-row">
                    <span className="payment-method-badge" style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {payMethodIcon[order.paymentMethod] &&
                        <PayIcon type={payMethodIcon[order.paymentMethod]} size={20}/>
                      }
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPayment && (
        <PaymentModal
          total={cartTotal}
          cart={cart}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}