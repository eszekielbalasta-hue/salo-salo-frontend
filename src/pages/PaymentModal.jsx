import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const GCASH_NUMBER    = "0951-377-9596";
const PAYMAYA_NUMBER  = "0951-377-9596";
const PAYPAL_EMAIL    = "your@email.com";
const RESTAURANT_NAME = "Salo-Salo Filipino Fine Dining";

const ICONS = {
  gcash:   "data:image/png;base64,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",
  paypal:  "data:image/png;base64,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",
  paymaya: "data:image/png;base64,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",
  cash:    "data:image/png;base64,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",
};

const METHODS = [
  { id: "GCash",   icon: "gcash",   name: "GCash",   color: "#0075C9", bg: "rgba(0,117,201,0.1)",  border: "rgba(0,117,201,0.4)",  number: GCASH_NUMBER,   instruction: "Open GCash → Pay QR → Scan" },
  { id: "PayMaya", icon: "paymaya", name: "PayMaya", color: "#00A862", bg: "rgba(0,168,98,0.1)",   border: "rgba(0,168,98,0.4)",   number: PAYMAYA_NUMBER, instruction: "Open Maya → Pay QR → Scan" },
  { id: "PayPal",  icon: "paypal",  name: "PayPal",  color: "#003087", bg: "rgba(0,48,135,0.1)",   border: "rgba(0,112,255,0.4)",  number: PAYPAL_EMAIL,   instruction: "Send to PayPal email below" },
  { id: "Cash",    icon: "cash",    name: "Cash",    color: "#C9922A", bg: "rgba(201,146,42,0.1)", border: "rgba(201,146,42,0.4)", number: null,           instruction: "Pay at the counter upon receiving order" },
];

export default function PaymentModal({ total, cart, onConfirm, onCancel }) {
  const [step, setStep]       = useState(1);
  const [method, setMethod]   = useState(null);
  const [loading, setLoading] = useState(false);

  const selected = METHODS.find(m => m.id === method);

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

        {/* STEP 1 — Select method */}
        {step === 1 && (
          <div>
            <p className="modal-label">✦ Choose Payment Method</p>
            <div className="payment-methods">
              {METHODS.map(m => (
                <div
                  key={m.id}
                  className={`payment-option ${method === m.id ? "payment-selected" : ""}`}
                  style={method === m.id ? { borderColor: m.border, background: m.bg } : {}}
                  onClick={() => setMethod(m.id)}
                >
                  <div className="payment-logo-img">
                    <img
                      src={ICONS[m.icon]}
                      alt={m.name}
                      style={{
                        width: 40, height: 40,
                        objectFit: "contain",
                        borderRadius: m.id === "GCash" ? 8 : 4,
                      }}
                    />
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
                <span>Total</span>
                <span>₱{total}</span>
              </div>
            </div>

            <button className="btn-primary btn-full" onClick={handleNext} disabled={!method}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — QR */}
        {step === 2 && selected && (
          <div className="qr-step">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
              <img src={ICONS[selected.icon]} alt={selected.name}
                style={{ width:36, height:36, objectFit:"contain", borderRadius: selected.id==="GCash"?8:4 }}/>
              <p className="modal-label" style={{marginBottom:0}}>
                {selected.id === "PayPal" ? "Send Payment via PayPal" : `Scan to Pay via ${selected.name}`}
              </p>
            </div>

            <div className="qr-container" style={{ borderColor: selected.border }}>
              <img src={ICONS[selected.icon]} alt={selected.name}
                style={{ width:50, height:50, objectFit:"contain", borderRadius: selected.id==="GCash"?10:6, marginBottom:4 }}/>

              {selected.id === "PayPal" ? (
                <div style={{ textAlign:"center", padding:"1rem" }}>
                  <p style={{ color:"var(--text3)", fontSize:"0.8rem", marginBottom:"0.75rem", fontFamily:"Cinzel, serif", letterSpacing:"0.1em" }}>SEND TO EMAIL</p>
                  <p style={{ color: selected.color, fontSize:"1.1rem", fontFamily:"Cinzel, serif" }}>{PAYPAL_EMAIL}</p>
                  <p style={{ color:"var(--text3)", fontSize:"0.78rem", marginTop:6 }}>via paypal.com or PayPal app</p>
                </div>
              ) : (
                <QRCodeSVG value={qrValue} size={180} bgColor="transparent" fgColor={selected.color} level="H" includeMargin={true} />
              )}

              <p className="qr-number" style={{ color: selected.color }}>
                {selected.id === "PayPal" ? `Amount: ₱${total}` : selected.number}
              </p>
              <p className="qr-name">{RESTAURANT_NAME}</p>
            </div>

            <div className="qr-amount">
              <span className="qr-amount-label">Amount to Pay</span>
              <span className="qr-amount-value">₱{total}</span>
            </div>

            <div className="qr-steps">
              {selected.id === "PayPal" ? (
                <>
                  <p className="qr-step-item">1. Open <strong>PayPal</strong> app or go to paypal.com</p>
                  <p className="qr-step-item">2. Tap <strong>Send</strong> and enter the email above</p>
                  <p className="qr-step-item">3. Enter amount <strong>₱{total}</strong></p>
                  <p className="qr-step-item">4. Add note: <strong>Salo-Salo Order</strong></p>
                  <p className="qr-step-item">5. Screenshot your payment confirmation</p>
                </>
              ) : (
                <>
                  <p className="qr-step-item">1. Open your <strong>{selected.name}</strong> app</p>
                  <p className="qr-step-item">2. Tap <strong>Pay QR</strong> or <strong>Scan</strong></p>
                  <p className="qr-step-item">3. Scan the QR code above</p>
                  <p className="qr-step-item">4. Enter amount <strong>₱{total}</strong> and confirm</p>
                  <p className="qr-step-item">5. Screenshot your payment receipt</p>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ background: `linear-gradient(135deg, ${selected.color}CC, ${selected.color})` }} onClick={() => setStep(3)}>
                I've Paid ✓
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirm */}
        {step === 3 && selected && (
          <div className="confirm-step">
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1rem" }}>
              <img src={ICONS[selected.icon]} alt={selected.name}
                style={{ width:70, height:70, objectFit:"contain", borderRadius: selected.id==="GCash"?14:8 }}/>
            </div>
            <h3 className="confirm-title">
              {method === "Cash" ? "Pay at Counter" : "Payment Submitted!"}
            </h3>
            <p className="confirm-sub">
              {method === "Cash"
                ? `Your order will be prepared. Please pay ₱${total} at the counter.`
                : `Thank you! Your ${method} payment of ₱${total} is pending verification.`}
            </p>

            <div className="confirm-summary">
              <div className="confirm-row">
                <span>Payment Method</span>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <img src={ICONS[selected.icon]} alt={method}
                    style={{ width:18, height:18, objectFit:"contain", borderRadius:3 }}/>
                  {method}
                </span>
              </div>
              <div className="confirm-row"><span>Amount</span><span>₱{total}</span></div>
              <div className="confirm-row">
                <span>Status</span>
                <span className="confirm-status">
                  {method === "Cash" ? "Pay on delivery" : "Pending verification"}
                </span>
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