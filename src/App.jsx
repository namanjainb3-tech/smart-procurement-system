import { useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";
import ItemTable from "./components/ItemTable";
import Summary from "./components/Summary";
import PriceChart from "./components/PriceChart";
import FileUpload from "./components/FileUpload";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("dark", dark);
    document.body.style.background = dark ? "#111" : "#f8fafc";
  }, [dark]);

  return (
    <div className={`container mt-3 ${dark ? "text-light" : ""}`}>

      {/* NAVBAR */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 mb-4 rounded"
        style={{
          background: "linear-gradient(90deg,#2563eb,#4f46e5)",
          color: "white",
          height: "70px"
        }}
      >
        <h5 className="m-0">🛒 Smart Procurement</h5>

        <button
          className="btn btn-light btn-sm"
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* HERO */}
      <div className="card p-5 text-center mb-4 shadow-sm">
        <h2 className="fw-bold">
          Find the Cheapest Way to Shop 🧠
        </h2>

        <p className="text-muted">
          Compare Blinkit, Zepto, Swiggy & more instantly
        </p>

        <div className="d-flex justify-content-center gap-2 mt-2">
          {["milk", "rice", "oil", "soap"].map((item) => (
            <button
              key={item}
              className="btn btn-light"
              onClick={() => setQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <SearchBox setItems={setItems} query={query} setQuery={setQuery} />

      <FileUpload setItems={setItems} dark={dark} />

      <ItemTable items={items} setItems={setItems} />

      <div className="row mt-4">
        <div className="col-md-6">
          <Summary items={items} />
        </div>

        <div className="col-md-6">
          <PriceChart items={items} />
        </div>
      </div>

      {items.length > 0 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-danger"
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