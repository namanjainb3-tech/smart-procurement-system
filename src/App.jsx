// src/App.jsx

import { useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";
import ItemTable from "./components/ItemTable";
import Summary from "./components/Summary";
import PriceChart from "./components/PriceChart";
import FileUpload from "./components/FileUpload";
import Login from "./components/Login";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const loadUserItems = async () => {
      if (!user) return;
  
      try {
        const res = await fetch(
          `http://smart-procurement-system.onrender.com/api/user-items/${user.google_id}`
        );
  
        const data = await res.json();
  
        const cleaned = data.map((item) => ({
          ...item,
          amazon: Number(item.amazon) || 0,
          flipkart: Number(item.flipkart) || 0,
          blinkit: Number(item.blinkit) || 0,
          zepto: Number(item.zepto) || 0,
          swiggy: Number(item.swiggy) || 0,
          bbasket: Number(item.bbasket) || 0,
          qty: Number(item.qty) || 1,
        }));
  
        setItems(cleaned);
  
      } catch (err) {
        console.log(err);
      }
    };
  
    loadUserItems();
  }, [user]);

  const [query, setQuery] = useState("");

  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("dark", dark);

    document.body.style.background = dark
      ? "linear-gradient(135deg,#0f172a,#111827,#020617)"
      : "linear-gradient(135deg,#eef2ff,#f8fafc,#ffffff)";

    document.body.style.minHeight = "100vh";
  }, [dark]);

  // ==========================
  // LOGIN SCREEN
  // ==========================
  if (!user) {
    return (
      <div className="container py-5">
        <Login setUser={setUser} />
      </div>
    );
  }

  // ==========================
  // MAIN DASHBOARD
  // ==========================
  return (
    <div
      className={`container py-4 ${
        dark ? "text-light" : "text-dark"
      }`}
    >
      {/* NAVBAR */}
      <div
        className="mb-4 rounded-4 shadow-lg p-3"
        style={{
          background:
            "linear-gradient(90deg,#2563eb,#4f46e5,#7c3aed)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          {/* LEFT */}
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "44px",
                height: "44px",
                background: "rgba(255,255,255,0.15)",
                fontSize: "20px",
              }}
            >
              🛒
            </div>

            <div>
              <h5 className="m-0 text-white fw-bold">
                Smart Procurement
              </h5>

              <small style={{ color: "rgba(255,255,255,0.75)" }}>
                Real-time Smart Grocery Buying
              </small>
            </div>
          </div>

          {/* RIGHT */}
          <div className="d-flex flex-wrap gap-2 align-items-center">

            {/* USER */}
            <div
              className="px-3 py-2 rounded-pill d-flex align-items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#14b8a6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <span className="small fw-semibold">
                {user.name}
              </span>
            </div>

            {/* THEME */}
            <button
              className="btn btn-light btn-sm rounded-pill px-3"
              onClick={() => setDark(!dark)}
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            {/* LOGOUT */}
            <button
              className="btn btn-danger btn-sm rounded-pill px-3"
              onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
              }}
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      {/* HERO */}
      <div
        className="p-5 text-center mb-4 rounded-4 shadow-lg"
        style={{
          background: dark
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          border: dark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h1 className="fw-bold mb-3">
          Find the Cheapest Way to Shop 🧠
        </h1>

        <p
          className="mb-4"
          style={{
            fontSize: "1.15rem",
            opacity: 0.8,
          }}
        >
          Compare Blinkit, Zepto, Swiggy, Amazon &
          more instantly
        </p>

        <div className="d-flex justify-content-center gap-2 flex-wrap">
          {["milk", "rice", "oil", "soap"].map((item) => (
            <button
              key={item}
              className="btn btn-light rounded-pill px-4 shadow-sm"
              onClick={() => setQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <SearchBox
        setItems={setItems}
        query={query}
        setQuery={setQuery}
      />

      <FileUpload
        setItems={setItems}
        dark={dark}
        user={user}
      />

      <ItemTable
        items={items}
        setItems={setItems}
      />

      <div className="row mt-4 g-4">
        <div className="col-lg-6">
          <Summary items={items} />
        </div>

        <div className="col-lg-6">
          <PriceChart items={items} />
        </div>
      </div>

      {items.length > 0 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-danger px-4 py-2 rounded-pill shadow"
            onClick={() => setItems([])}
          >
            🗑 Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default App;