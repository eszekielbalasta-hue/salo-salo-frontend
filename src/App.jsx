import { useState, useEffect } from "react";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerPage from "./pages/CustomerPage";
import ChatBot from "./pages/ChatBot";
import "./App.css";

function PalawanScene() {
  return (
    <div className="palawan-scene" aria-hidden="true">
      {/* Sky layers */}
      <div className="sky-base"></div>
      <div className="sky-glow"></div>

      {/* Stars */}
      <div className="stars-layer">
        {[...Array(80)].map((_, i) => (
          <div key={i} className={`star star-${(i % 5) + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 55}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          ></div>
        ))}
      </div>

      {/* Moon */}
      <div className="moon">
        <div className="moon-crater c1"></div>
        <div className="moon-crater c2"></div>
        <div className="moon-crater c3"></div>
      </div>
      <div className="moon-glow"></div>

      {/* Milky way */}
      <div className="milky-way"></div>

      {/* Sun / Horizon glow */}
      <div className="horizon-glow"></div>
      <div className="sun-orb"></div>
      <div className="sun-halo"></div>

      {/* Distant haze / atmosphere */}
      <div className="atmosphere"></div>

      {/* ── LIMESTONE KARSTS — far layer ── */}
      <div className="karst-layer karst-far">
        <div className="karst kf1"></div>
        <div className="karst kf2"></div>
        <div className="karst kf3"></div>
        <div className="karst kf4"></div>
        <div className="karst kf5"></div>
        <div className="karst kf6"></div>
      </div>

      {/* ── LIMESTONE KARSTS — mid layer ── */}
      <div className="karst-layer karst-mid">
        <div className="karst km1"></div>
        <div className="karst km2"></div>
        <div className="karst km3"></div>
        <div className="karst km4"></div>
        <div className="karst km5"></div>
      </div>

      {/* ── JUNGLE vegetation on karsts ── */}
      <div className="jungle-top jt1"></div>
      <div className="jungle-top jt2"></div>
      <div className="jungle-top jt3"></div>

      {/* ── PALAWAN LAGOON — emerald water ── */}
      <div className="lagoon">
        <div className="lagoon-shimmer"></div>
        <div className="lagoon-wave lw1"></div>
        <div className="lagoon-wave lw2"></div>
        <div className="lagoon-wave lw3"></div>
        <div className="moon-reflection"></div>
        <div className="sun-reflection-lagoon"></div>
      </div>

      {/* ── BANCA BOAT silhouette ── */}
      <div className="banca">
        <div className="banca-hull"></div>
        <div className="banca-outrigger left"></div>
        <div className="banca-outrigger right"></div>
        <div className="banca-pole"></div>
        <div className="banca-sail"></div>
      </div>

      {/* ── FOREGROUND — near karsts ── */}
      <div className="karst-layer karst-near">
        <div className="karst kn1"></div>
        <div className="karst kn2"></div>
      </div>

      {/* ── PALM TREES ── */}
      <div className="palm-tree pt-left">
        <div className="pt-trunk"></div>
        <div className="pt-fronds">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`pt-frond f${i + 1}`}></div>
          ))}
        </div>
        <div className="coconut co1"></div>
        <div className="coconut co2"></div>
      </div>

      <div className="palm-tree pt-right">
        <div className="pt-trunk"></div>
        <div className="pt-fronds">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`pt-frond f${i + 1}`}></div>
          ))}
        </div>
        <div className="coconut co1"></div>
        <div className="coconut co2"></div>
      </div>

      {/* ── WHITE SAND BEACH ── */}
      <div className="beach">
        <div className="sand-ripple r1"></div>
        <div className="sand-ripple r2"></div>
        <div className="sand-ripple r3"></div>
        <div className="shore-foam"></div>
      </div>

      {/* ── BIRDS ── */}
      <div className="bird b1"></div>
      <div className="bird b2"></div>
      <div className="bird b3"></div>

      {/* ── FIREFLIES ── */}
      {[...Array(16)].map((_, i) => (
        <div key={i} className="firefly"
          style={{
            left: `${5 + Math.random() * 90}%`,
            bottom: `${28 + Math.random() * 35}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("menu");
  const [user, setUser]             = useState(null);
  const [authPage, setAuthPage]     = useState("login");
  const [checked, setChecked]       = useState(false);

  useEffect(() => {
    const token    = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role     = localStorage.getItem("role");
    if (token && username) setUser({ token, username, role });
    setChecked(true);
  }, []);

  const handleLogin  = (data) => setUser(data);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null); setAuthPage("login");
  };

  if (!checked) return <PalawanScene />;

  if (!user) return (
    <>
      <PalawanScene />
      {authPage === "login"
        ? <LoginPage onLogin={handleLogin} onSwitch={() => setAuthPage("register")} />
        : <RegisterPage onSwitch={() => setAuthPage("login")} />}
      <ChatBot />
    </>
  );

  if (user.role === "customer") return (
    <>
      <PalawanScene />
      <div className="app-layer">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo"><span>🍽</span></div>
            <div className="brand-text">
              <span className="brand-name">Salo-Salo</span>
              <span className="brand-tagline">◆ Filipino Fine Dining ◆</span>
            </div>
          </div>
          <div className="nav-user">
            <span className="user-badge"><span className="user-dot"></span>{user.username}<span className="user-role">Guest</span></span>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>
        <main className="main-content"><CustomerPage username={user.username} /></main>
        <footer className="page-footer">
          <div className="footer-diamonds">🌴 · 🌺 · ⛵ · 🌺 · 🌴</div>
          Salo-Salo Filipino Fine Dining &nbsp;·&nbsp; Est. 2026 &nbsp;·&nbsp; Mabuhay!
        </footer>
      </div>
      <ChatBot />
    </>
  );

  return (
    <>
      <PalawanScene />
      <div className="app-layer">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo"><span>🍽</span></div>
            <div className="brand-text">
              <span className="brand-name">Salo-Salo</span>
              <span className="brand-tagline">◆ Filipino Fine Dining ◆</span>
            </div>
          </div>
          <div className="nav-links">
            <button className={activePage === "menu"   ? "active" : ""} onClick={() => setActivePage("menu")}>Menu</button>
            <button className={activePage === "orders" ? "active" : ""} onClick={() => setActivePage("orders")}>Orders</button>
          </div>
          <div className="nav-user">
            <span className="user-badge"><span className="user-dot"></span>{user.username}<span className="user-role">{user.role}</span></span>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>

        <div className="hero-banner">
          <div className="hero-deco">
            <div className="hero-deco-line"></div>
            🌴 · 🌺 · ⛵ · 🌺 · 🌴
            <div className="hero-deco-line right"></div>
          </div>
          <div className="hero-diamond">✦ ◇ ✦</div>
          <h1 className="hero-title">Salo-Salo</h1>
          <p className="hero-subtitle">◆ &nbsp; Where Every Meal is a Celebration &nbsp; ◆</p>
          <p className="hero-tagline">Mabuhay sa Pilipinas</p>
          <div className="hero-ornament">
            <div className="hero-ornament-line"></div>
            <span>🌴 · 🌊 · ✦ · 🌊 · 🌴</span>
            <div className="hero-ornament-line right"></div>
          </div>
        </div>

        <main className="main-content">
          {activePage === "menu" ? <MenuPage token={user.token} /> : <OrdersPage />}
        </main>

        <footer className="page-footer">
          <div className="footer-diamonds">🌴 · 🌺 · ⛵ · 🌺 · 🌴</div>
          Salo-Salo Filipino Fine Dining &nbsp;·&nbsp; Est. 2026 &nbsp;·&nbsp; Mabuhay!
        </footer>
      </div>
      <ChatBot />
    </>
  );
}