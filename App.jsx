import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import ItemTable from "./components/ItemTable";
import Summary from "./components/Summary";
import PriceChart from "./components/PriceChart";
import { FaMoon, FaSun } from "react-icons/fa";
import SearchBox from "./components/SearchBox";
import { priceData } from "./mockData";
import { normalizeName, getItemName, getQuantity } from "./utils";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const [dark, setDark] = useState(false);

  const calculateTotals = () => {
    let amazon = 0, flipkart = 0, bbasket = 0;

    items.forEach(item => {
      const rawName = getItemName(item);
      if (!rawName || rawName.toLowerCase().includes("total")) return;

      const name = normalizeName(rawName);
      const p = priceData[name] || {};

      const qty = getQuantity(item);

      amazon += (p.amazon || 0) * qty;
      flipkart += (p.flipkart || 0) * qty;
      bbasket += (p.bbasket || 0) * qty;
    });

    return { amazon, flipkart, bbasket };
  };

  const totals = calculateTotals();

  return (
    <div className={dark ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"}>

      <nav className={`navbar ${dark ? "navbar-dark bg-dark" : "navbar-dark bg-primary"} px-4`}>
        <span className="navbar-brand">Smart Procurement</span>

        <button className="btn btn-outline-light" onClick={() => setDark(!dark)}>
          {dark ? <FaSun /> : <FaMoon />}
        </button>
      </nav>

      <div className="container mt-4">
        <SearchBox dark={dark} setItems={setItems} />
        <FileUpload setItems={setItems} dark={dark} />

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm("Clear all items?")) {
                setItems([]);
                localStorage.removeItem("items");
              }
            }}
          >
          🗑 Clear All
          </button>
        </div>

        <div className="row">
          <div className="col-lg-8">
          <ItemTable items={items} setItems={setItems} dark={dark} />
          </div>

          <div className="col-lg-4">
            <Summary items={items} dark={dark} />
          </div>
        </div>

        <PriceChart totals={totals} dark={dark} />
      </div>
    </div>
  );
}

export default App;
