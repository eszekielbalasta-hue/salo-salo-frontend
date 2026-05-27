import { useState, useRef, useEffect } from "react";

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────
const KB = {
  greetings: ["hello", "hi", "hey", "mabuhay", "kumusta", "magandang", "good morning", "good afternoon", "good evening", "kamusta"],
  menu:      ["menu", "food", "dish", "dishes", "meals", "eat", "order", "kain", "pagkain", "serve", "available", "offer"],
  price:     ["price", "cost", "how much", "magkano", "bayad", "cheap", "expensive", "afford"],
  payment:   ["pay", "payment", "gcash", "paymaya", "maya", "paypal", "cash", "piso", "bayad", "checkout"],
  order:     ["order", "track", "status", "where", "how long", "pending", "preparing", "delivered", "my order"],
  kare:      ["kare-kare", "kare kare", "kare"],
  adobo:     ["adobo"],
  sinigang:  ["sinigang"],
  lechon:    ["lechon", "litson"],
  sisig:     ["sisig"],
  halo:      ["halo-halo", "halo halo"],
  leche:     ["leche flan", "flan", "leche"],
  bibingka:  ["bibingka"],
  pancit:    ["pancit", "pansit", "noodle"],
  lumpia:    ["lumpia", "spring roll"],
  turon:     ["turon", "banana"],
  sago:      ["sago", "gulaman", "sago gulaman"],
  buko:      ["buko", "coconut"],
  thanks:    ["thank", "thanks", "salamat", "salamat po", "maraming salamat"],
  bye:       ["bye", "goodbye", "paalam", "see you", "sige"],
  help:      ["help", "tulong", "assist", "question", "ask", "support"],
  hours:     ["open", "close", "hours", "time", "bukas", "sarado", "schedule"],
  location:  ["where", "location", "address", "lugar", "find", "maps", "directions"],
  promo:     ["promo", "discount", "sale", "deal", "voucher", "coupon", "free"],
  vegetarian:["vegetarian", "vegan", "no meat", "veggies", "vegetables", "plant"],
  spicy:     ["spicy", "hot", "maanghang", "chili", "pepper"],
  bestseller:["bestseller", "best seller", "popular", "favorite", "favourite", "must try", "recommend"],
  complaint: ["complaint", "problem", "issue", "wrong", "bad", "cold", "late", "missing", "reklamo"],
  register:  ["register", "sign up", "create account", "account", "login", "sign in"],
};

const RESPONSES = {
  greetings: [
    "Mabuhay po! 🌺 Welcome to Salo-Salo Filipino Fine Dining! I'm Lola, your virtual assistant. How can I help you today?",
    "Magandang araw po! 🌴 I'm Lola, Salo-Salo's assistant. What can I do for you today?",
    "Hello po! Welcome to Salo-Salo! 🍽 Kumain na po ba kayo? How may I assist you?",
  ],
  menu: [
    "🍽 Our menu has three categories:\n\n🥘 **Meals** — Kare-Kare (₱279), Adobo (₱199), Sinigang (₱249), Lechon (₱399), Sisig (₱229), Bicol Express (₱266), Pancit (₱189), Lumpia (₱159)\n\n🥤 **Drinks** — Buko Juice (₱90), Sago't Gulaman (₱90), Calamansi Juice (₱80)\n\n🍮 **Desserts** — Halo-Halo (₱170), Leche Flan (₱180), Bibingka (₱160), Turon (₱100)\n\nJust tap the Menu tab to browse and add items to your cart!",
  ],
  price: [
    "Our prices are very reasonable po! 😊\n\n💰 Meals start at ₱159 (Lumpia)\n💰 Drinks from ₱80\n💰 Desserts from ₱90\n💰 Most popular dishes are ₱199–₱399\n\nYou can see all prices in the Menu tab!",
  ],
  payment: [
    "We accept multiple payment methods po! 💳\n\n💙 **GCash** — Scan QR code in the app\n💚 **PayMaya/Maya** — Scan QR code in the app\n🔵 **PayPal** — Send to our PayPal email\n💵 **Cash** — Pay at the counter upon delivery\n\nJust add items to cart, tap 'Proceed to Payment', and choose your preferred method!",
  ],
  order: [
    "To track your order po, tap the **My Orders** tab in the app! 📋\n\nYour order goes through these stages:\n⏳ **Pending** — We received your order\n👨‍🍳 **Preparing** — Our chefs are cooking it\n✅ **Delivered** — Enjoy your meal!\n\nIf there's an issue with your order, please let me know po!",
  ],
  kare: [
    "🥘 **Kare-Kare** — ₱279\nA rich and creamy peanut-based stew with beef, oxtail, and fresh vegetables, traditionally served with bagoong (shrimp paste). One of our most beloved Filipino classics! It's best enjoyed with steamed rice po. 😋",
  ],
  adobo: [
    "🍖 **Adobo** — ₱199\nThe quintessential Filipino dish! Meat braised in soy sauce, vinegar, garlic, and bay leaves until tender and flavorful. We cook it the authentic way — slowly simmered to perfection. Masarap po talaga! 🤤",
  ],
  sinigang: [
    "🍲 **Sinigang** — ₱249\nA sour tamarind-based soup loaded with tender meat and fresh vegetables. Perfect for rainy days or when you need something warm and comforting! Our sinigang is made with fresh tamarind po — hindi powdered! 🌿",
  ],
  lechon: [
    "🐷 **Lechon** — ₱399\nThe king of Filipino celebrations! Whole roasted pig with crispy golden skin and juicy meat inside. Our lechon is slow-roasted for hours to achieve that perfect crunch. A must-try po! 🎉",
  ],
  sisig: [
    "🥩 **Sisig** — ₱229\nA Kapampangan classic! Sizzling chopped pork face and ears seasoned with calamansi, onions, and chili. Served on a hot plate for that satisfying sizzle. Perfect pulutan or everyday meal! 🔥",
  ],
  halo: [
    "🍧 **Halo-Halo** — ₱170\nThe ultimate Filipino dessert! A colorful mix of crushed ice, sweet beans, kaong, nata de coco, leche flan, ube ice cream, and more — all topped with evaporated milk. Perfect for the Philippine heat! ☀️",
  ],
  leche: [
    "🍮 **Leche Flan** — ₱180\nA silky smooth caramel custard that melts in your mouth. Made with egg yolks and condensed milk, topped with a beautiful golden caramel glaze. Our lola's secret recipe po! 💛",
  ],
  bibingka: [
    "🎂 **Bibingka** — ₱160\nA traditional Filipino rice cake baked in banana leaves, topped with salted egg and kesong puti. Originally a Christmas treat but we serve it all year round po! Best enjoyed warm. 🍌",
  ],
  pancit: [
    "🍜 **Pancit** — ₱189\nStir-fried noodles with vegetables and meat — a Filipino staple that symbolizes long life! We make ours with fresh ingredients and a savory sauce. Great for sharing po! 🥢",
  ],
  lumpia: [
    "🥟 **Lumpia** — ₱159\nCrispy Filipino spring rolls filled with vegetables and meat. Golden-fried to perfection and served with sweet chili sauce. A crowd favorite and perfect appetizer po! 😋",
  ],
  turon: [
    "🌯 **Turon** — ₱100\nDeep-fried banana spring rolls coated in caramelized brown sugar. Simple but absolutely delicious! A classic Filipino meryenda that everyone loves po! 🍌",
  ],
  sago: [
    "🧋 **Sago't Gulaman** — ₱90\nA refreshing Filipino drink made with tapioca pearls, gulaman (agar jelly), and brown sugar syrup. Sweet, cold, and perfect on a hot day po! 🥤",
  ],
  buko: [
    "🥥 **Buko Juice** — ₱90\nFresh young coconut juice — the taste of the Philippines! Light, refreshing, and naturally sweet. Straight from the buko po! 🌴",
  ],
  thanks: [
    "Walang anuman po! 😊 It's my pleasure to help. Is there anything else I can assist you with?",
    "Salamat din po! 🌺 Enjoy your meal at Salo-Salo! Anything else I can help you with?",
    "Of course po! That's what I'm here for. 😊 Anything else?",
  ],
  bye: [
    "Paalam po! 🌺 Thank you for visiting Salo-Salo. Enjoy your meal and come back soon! Mabuhay! 🇵🇭",
    "See you next time po! 😊 Salamat for choosing Salo-Salo. Have a wonderful day! 🌴",
  ],
  help: [
    "Of course po! I'm Lola, Salo-Salo's assistant. I can help you with:\n\n🍽 **Menu & dishes** — what we serve\n💰 **Prices** — how much dishes cost\n💳 **Payment** — GCash, PayMaya, PayPal, Cash\n📋 **Orders** — how to track your order\n⏰ **Hours** — when we're open\n⭐ **Bestsellers** — what to try first\n\nJust ask me anything po!",
  ],
  hours: [
    "⏰ Salo-Salo is open po:\n\n🌅 **Monday–Friday:** 10:00 AM – 10:00 PM\n🌺 **Saturday–Sunday:** 8:00 AM – 11:00 PM\n\nWe accept online orders through the app anytime! Place your order and we'll prepare it fresh for you. 😊",
  ],
  location: [
    "📍 Salo-Salo Filipino Fine Dining\n\nYou can find us through the app po! For delivery and dine-in inquiries, please contact our staff. We're located in a beautiful Palawan-inspired venue! 🌴\n\nIs there anything else I can help you with?",
  ],
  promo: [
    "🎉 Check the app regularly for our latest promos and specials po! We often have:\n\n⭐ Featured dishes of the day\n🎂 Special occasion packages\n🌺 Seasonal Filipino favorites\n\nFollow our updates in the app for the latest deals! 😊",
  ],
  vegetarian: [
    "🌿 We have vegetarian-friendly options po!\n\n✅ **Pinakbet** — mixed vegetables\n✅ **Pancit** — can be made vegetarian\n✅ **Lumpia** — vegetable option available\n✅ **All our desserts** — Halo-Halo, Leche Flan, Bibingka, Turon\n✅ **All drinks** — Buko Juice, Sago't Gulaman, Calamansi Juice\n\nJust let our staff know your preference po!",
  ],
  spicy: [
    "🌶️ We have spicy options po!\n\n🔥 **Bicol Express** — very spicy! Made with chili and coconut milk\n🔥 **Sisig** — spicy version available\n🌶️ **Adobo** — mild spice\n\nYou can request your preferred spice level when ordering. Para sa mga mahilig sa anghang! 😄",
  ],
  bestseller: [
    "⭐ Our bestsellers po:\n\n🥇 **Kare-Kare** (₱279) — rich peanut stew, a Filipino classic\n🥈 **Sinigang** (₱249) — sour tamarind soup, everyone loves it!\n🥉 **Sisig** (₱229) — sizzling Kapampangan specialty\n\n🍮 **Halo-Halo** (₱170) — best dessert po!\n🥤 **Buko Juice** (₱90) — refreshing and authentic\n\nMust-try po when you visit Salo-Salo! 🌺",
  ],
  complaint: [
    "Pasensya na po! 😔 I'm sorry to hear about your experience. Here's what we can do:\n\n1️⃣ If your order is wrong — please tell us immediately and we'll fix it\n2️⃣ If food arrived cold — we apologize and will address this with our team\n3️⃣ If there's a missing item — please check your order receipt and contact staff\n\nYour satisfaction is our priority po! We'll make it right. 🙏",
  ],
  register: [
    "Creating an account is easy po! 😊\n\n1️⃣ Click **Sign Out** if logged in\n2️⃣ Click **Create one** on the login page\n3️⃣ Choose your role: **Customer**, Staff, or Admin\n4️⃣ Enter your username and password\n5️⃣ Password must have uppercase, lowercase, and a number\n\nAs a **Customer**, you can browse the menu, add to cart, place orders, and pay digitally! 🌺",
  ],
  default: [
    "Pasensya na po, hindi ko masagot yan. 😊 But I can help you with:\n\n🍽 Menu & dishes · 💰 Prices · 💳 Payment methods\n📋 Orders · ⏰ Hours · ⭐ Bestsellers\n\nWhat would you like to know?",
    "Hindi ko po maintindihan yan, pero I'm here to help! Try asking about our menu, prices, payment, or orders po. 🌺",
    "Medyo nalito po ako dyan! 😅 I can answer questions about our food, prices, payments, and orders. What would you like to know?",
  ],
};

const SUGGESTIONS = [
  "What are your bestsellers?",
  "How do I pay with GCash?",
  "What is Kare-Kare?",
  "Are you open now?",
  "Do you have vegetarian options?",
  "How do I track my order?",
];

// ─── MATCHING LOGIC ───────────────────────────────────────────────────────────
function getResponse(input) {
  const text = input.toLowerCase().trim();

  for (const [key, keywords] of Object.entries(KB)) {
    if (keywords.some(k => text.includes(k))) {
      const responses = RESPONSES[key] || RESPONSES.default;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Mabuhay po! 🌺 I'm Lola, your Salo-Salo assistant. Ask me about our menu, prices, payment, or orders. How can I help you today?" },
  ]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { from: "user", text: userText }]);
    setInput("");
    setTyping(true);

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const response = getResponse(userText);
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: response }]);
      if (!open) setUnread(u => u + 1);
    }, 800 + Math.random() * 600);
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1
            ? <strong key={j} style={{ color: "var(--g3)", fontWeight: 600 }}>{part}</strong>
            : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating button */}
      <button className="chat-fab" onClick={() => setOpen(o => !o)}>
        <span className="chat-fab-icon">{open ? "✕" : "🌺"}</span>
        <span className="chat-fab-label">{open ? "Close" : "Lola"}</span>
        {!open && unread > 0 && <span className="chat-unread">{unread}</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">🌺</div>
            <div className="chat-header-info">
              <p className="chat-name">Lola</p>
              <p className="chat-status">
                <span className="chat-online-dot"></span>
                Salo-Salo Assistant · Always Online
              </p>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from === "user" ? "chat-msg-user" : "chat-msg-bot"}`}>
                {m.from === "bot" && <div className="chat-bot-avatar">🌺</div>}
                <div className="chat-bubble">{formatText(m.text)}</div>
              </div>
            ))}

            {typing && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-bot-avatar">🌺</div>
                <div className="chat-bubble chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !typing && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything po..."
              disabled={typing}
            />
            <button className="chat-send" onClick={() => sendMessage()} disabled={typing || !input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}