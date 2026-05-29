import { useState, useEffect } from "react";
import API from "../api/apiClient";

const PAY_ICONS = {
  gcash:   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  paymaya: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  paypal:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  cash:    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
};

const GCASH_NUMBER    = "09XX-XXX-XXXX";
const PAYMAYA_NUMBER  = "09XX-XXX-XXXX";
const PAYPAL_EMAIL    = "your@email.com";
const RESTAURANT_NAME = "Salo-Salo Filipino Fine Dining";

const PAYMENT_METHODS = [
  { id: "GCash",   icon: "gcash",   name: "GCash",   color: "#0075C9", bg: "rgba(0,117,201,0.1)",  border: "rgba(0,117,201,0.4)",  number: GCASH_NUMBER,   instruction: "Open GCash → Pay QR → Scan" },
  { id: "PayMaya", icon: "paymaya", name: "PayMaya", color: "#00A862", bg: "rgba(0,168,98,0.1)",   border: "rgba(0,168,98,0.4)",   number: PAYMAYA_NUMBER, instruction: "Open Maya → Pay QR → Scan" },
  { id: "PayPal",  icon: "paypal",  name: "PayPal",  color: "#003087", bg: "rgba(0,48,135,0.1)",   border: "rgba(0,112,255,0.4)",  number: PAYPAL_EMAIL,   instruction: "Send to PayPal email below" },
  { id: "Cash",    icon: "cash",    name: "Cash",    color: "#C9922A", bg: "rgba(201,146,42,0.1)", border: "rgba(201,146,42,0.4)", number: null,           instruction: "Pay at the counter upon receiving order" },
];

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
  if (n.includes("inasal"))     return "🍗";
  if (category === "Drinks")    return "🥤";
  if (category === "Desserts")  return "🍮";
  return "🍽";
};

function PaymentModal({ total, cart, onConfirm, onCancel }) {
  const [step, setStep]       = useState(1);
  const [method, setMethod]   = useState(null);
  const [loading, setLoading] = useState(false);
  const selected = PAYMENT_METHODS.find(m => m.id === method);

  const handleNext = () => {
    if (!method) return;
    if (method === "Cash") { setStep(3); return; }
    setStep(2);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(method);
    setLoading(false);
  };

  const qrValue = selected?.number
    ? `${selected.name} Payment\nPay to: ${RESTAURANT_NAME}\nAmount: ₱${total}\n${selected.id === "PayPal" ? "Email" : "Number"}: ${selected.number}`
    : "";

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon">💳</div>
          <h2 className="modal-title">Payment</h2>
          <p className="modal-subtitle">Total: <span className="modal-amount">₱{total}</span></p>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-divider"></div>

        {step === 1 && (
          <div>
            <p className="modal-label">✦ Choose Payment Method</p>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <div key={m.id}
                  className={`payment-option ${method === m.id ? "payment-selected" : ""}`}
                  style={method === m.id ? { borderColor: m.border, background: m.bg } : {}}
                  onClick={() => setMethod(m.id)}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:44, flexShrink:0 }}>
                    <img src={PAY_ICONS[m.icon]} alt={m.name} style={{ width:40, height:40, objectFit:"contain", borderRadius: m.id==="GCash"?8:4 }}/>
                  </div>
                  <div className="payment-info">
                    <span className="payment-name" style={method === m.id ? { color: m.color } : {}}>{m.name}</span>
                    <span className="payment-hint">{m.instruction}</span>
                  </div>
                  {method === m.id && <span className="payment-check" style={{ color: m.color }}>✓</span>}
                </div>
              ))}
            </div>
            <div className="modal-summary">
              <p className="modal-label">✦ Order Summary</p>
              {cart.map((item, i) => (
                <div key={i} className="summary-row">
                  <span>{item.name} × {item.qty}</span>
                  <span>₱{item.price * item.qty}</span>
                </div>
              ))}
              <div className="summary-total">
                <span>Total</span><span>₱{total}</span>
              </div>
            </div>
            <button className="btn-primary btn-full" onClick={handleNext} disabled={!method}>Continue →</button>
          </div>
        )}

        {step === 2 && selected && (
          <div style={{ textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
              <img src={PAY_ICONS[selected.icon]} alt={selected.name} style={{ width:36, height:36, objectFit:"contain", borderRadius: selected.id==="GCash"?8:4 }}/>
              <p className="modal-label" style={{ marginBottom:0 }}>
                {selected.id === "PayPal" ? "Send Payment via PayPal" : `Scan to Pay via ${selected.name}`}
              </p>
            </div>
            <div className="qr-container" style={{ borderColor: selected.border }}>
              <img src={PAY_ICONS[selected.icon]} alt={selected.name} style={{ width:50, height:50, objectFit:"contain", borderRadius: selected.id==="GCash"?10:6 }}/>
              {selected.id === "PayPal" ? (
                <div style={{ textAlign:"center", padding:"1rem" }}>
                  <p style={{ color:"var(--t3)", fontSize:"0.8rem", marginBottom:"0.5rem", fontFamily:"Cinzel,serif" }}>SEND TO EMAIL</p>
                  <p style={{ color: selected.color, fontSize:"1.1rem", fontFamily:"Cinzel,serif" }}>{PAYPAL_EMAIL}</p>
                </div>
              ) : (
                <div style={{ background:"white", padding:12, borderRadius:8 }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <rect width="160" height="160" fill="white"/>
                    <text x="80" y="75" textAnchor="middle" fontSize="12" fill={selected.color} fontWeight="bold">{selected.name}</text>
                    <text x="80" y="95" textAnchor="middle" fontSize="10" fill="#333">QR Code</text>
                    <text x="80" y="112" textAnchor="middle" fontSize="9" fill="#666">₱{total}</text>
                    <rect x="20" y="20" width="30" height="30" fill="none" stroke={selected.color} strokeWidth="3"/>
                    <rect x="110" y="20" width="30" height="30" fill="none" stroke={selected.color} strokeWidth="3"/>
                    <rect x="20" y="110" width="30" height="30" fill="none" stroke={selected.color} strokeWidth="3"/>
                    <rect x="25" y="25" width="20" height="20" fill={selected.color}/>
                    <rect x="115" y="25" width="20" height="20" fill={selected.color}/>
                    <rect x="25" y="115" width="20" height="20" fill={selected.color}/>
                  </svg>
                </div>
              )}
              <p className="qr-number" style={{ color: selected.color }}>{selected.id === "PayPal" ? `Amount: ₱${total}` : selected.number}</p>
              <p className="qr-name">{RESTAURANT_NAME}</p>
            </div>
            <div className="qr-amount">
              <span className="qr-amount-label">Amount to Pay</span>
              <span className="qr-amount-value">₱{total}</span>
            </div>
            <div className="qr-steps">
              {selected.id === "PayPal" ? (
                <>
                  <p className="qr-step-item">1. Open <strong>PayPal</strong> app or paypal.com</p>
                  <p className="qr-step-item">2. Tap <strong>Send</strong> → enter email above</p>
                  <p className="qr-step-item">3. Amount: <strong>₱{total}</strong> · Note: <strong>Salo-Salo Order</strong></p>
                  <p className="qr-step-item">4. Screenshot your confirmation</p>
                </>
              ) : (
                <>
                  <p className="qr-step-item">1. Open <strong>{selected.name}</strong> app</p>
                  <p className="qr-step-item">2. Tap <strong>Pay QR</strong> or <strong>Scan</strong></p>
                  <p className="qr-step-item">3. Enter amount <strong>₱{total}</strong> and confirm</p>
                  <p className="qr-step-item">4. Screenshot your receipt</p>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ background:`linear-gradient(135deg,${selected.color}CC,${selected.color})` }} onClick={() => setStep(3)}>I Have Paid ✓</button>
            </div>
          </div>
        )}

        {step === 3 && selected && (
          <div className="confirm-step">
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem" }}>
              <img src={PAY_ICONS[selected.icon]} alt={selected.name} style={{ width:70, height:70, objectFit:"contain", borderRadius: selected.id==="GCash"?14:8 }}/>
            </div>
            <h3 className="confirm-title">{method === "Cash" ? "Pay at Counter" : "Payment Submitted!"}</h3>
            <p className="confirm-sub">
              {method === "Cash"
                ? `Please pay ₱${total} at the counter when your order arrives.`
                : `Thank you! Your ${method} payment of ₱${total} is pending verification.`}
            </p>
            <div className="confirm-summary">
              <div className="confirm-row">
                <span>Payment Method</span>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <img src={PAY_ICONS[selected.icon]} alt={method} style={{ width:18, height:18, objectFit:"contain", borderRadius:3 }}/>
                  {method}
                </span>
              </div>
              <div className="confirm-row"><span>Amount</span><span>₱{total}</span></div>
              <div className="confirm-row">
                <span>Status</span>
                <span className="confirm-status">{method === "Cash" ? "Pay on delivery" : "Pending verification"}</span>
              </div>
            </div>
            <div className="modal-actions">
              {method !== "Cash" && <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>}
              <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
                {loading ? "Placing order…" : "Confirm Order ✦"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    try { const r = await API.get("/api/menu"); setMenuItems(r.data); }
    catch (e) { console.error("Menu error:", e.message); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const r = await API.get("/api/orders");
      setOrders(r.data.filter(o => o.customerName === username));
    } catch (e) { console.error("Orders error:", e.message); }
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
        await API.post("/api/orders", {
          customerName: username,
          items: [{ menuItem: item._id, quantity: item.qty }],
          totalPrice: item.price * item.qty,
          paymentMethod,
          paymentStatus: "Pending",
        });
      }
      setCart([]);
      setShowPayment(false);
      setOrderSuccess(paymentMethod === "Cash"
        ? `Order placed! Please pay ₱${cartTotal} at the counter.`
        : `Order placed! ${paymentMethod} payment is pending verification.`);
      setActiveTab("orders");
      fetchOrders();
      setTimeout(() => setOrderSuccess(""), 6000);
    } catch { alert("Failed to place order. Please try again."); }
  };

  const categories = ["All", "Meals", "Drinks", "Desserts"];
  const filtered   = filter === "All" ? menuItems : menuItems.filter(i => i.category === filter);

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
                        onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
                      <div style={{ display:"none", width:"100%", height:160, alignItems:"center", justifyContent:"center", fontSize:"3rem", background:"rgba(20,10,0,0.5)" }}>
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
                      onError={e => e.target.style.display="none"}/>
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
              <div className="payment-info-bar">
                <span className="pay-badge pay-gcash">
                  <img src={PAY_ICONS.gcash} alt="GCash" style={{ width:22, height:22, objectFit:"contain", borderRadius:4 }}/> GCash
                </span>
                <span className="pay-badge pay-paymaya">
                  <img src={PAY_ICONS.paymaya} alt="PayMaya" style={{ width:22, height:22, objectFit:"contain" }}/> PayMaya
                </span>
                <span className="pay-badge pay-paypal">
                  <img src={PAY_ICONS.paypal} alt="PayPal" style={{ width:22, height:22, objectFit:"contain" }}/> PayPal
                </span>
                <span className="pay-badge pay-cash">
                  <img src={PAY_ICONS.cash} alt="Cash" style={{ width:22, height:22, objectFit:"contain" }}/> Cash
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
                      {PAY_ICONS[{ GCash:"gcash", PayMaya:"paymaya", PayPal:"paypal", Cash:"cash" }[order.paymentMethod]] &&
                        <img src={PAY_ICONS[{ GCash:"gcash", PayMaya:"paymaya", PayPal:"paypal", Cash:"cash" }[order.paymentMethod]]}
                          alt={order.paymentMethod} style={{ width:20, height:20, objectFit:"contain", borderRadius:3 }}/>
                      }
                      {order.paymentMethod}
                    </span>
                    <span className={`payment-status-badge ${order.paymentStatus}`}>
                      {order.paymentStatus === "Paid" ? "✓ Paid" : order.paymentStatus === "Pending" ? "⏳ Pending" : "✕ Failed"}
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