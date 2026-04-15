import { useState } from "react";
import { priceData } from "../mockData";
import { normalizeName } from "../utils";

const SearchBox = ({ dark, setItems }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!query || query.length < 2) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/bulk-search?query=${query}`
      );

      const blendPrice = (base, api) => {
        if (!base) return api || null;
        if (!api) return base;
      
        const diff = Math.abs(api - base) / base;
      
        if (diff > 0.5) return base;
      
        return Math.round((base + api) / 2);
      };

      const data = await res.json();

      const normalized = normalizeName(data.name);
      const fallback = priceData[normalized] || priceData.other;

      
      const amazon = blendPrice(fallback.amazon, data.amazon);
      const flipkart = blendPrice(fallback.flipkart, data.flipkart);
      const bbasket = blendPrice(fallback.bbasket, data.bbasket);

      const prices = [amazon, flipkart, bbasket].filter(p => p != null);
      const min = prices.length ? Math.min(...prices) : null;

      setResult({
        name: data.name,
        amazon,
        flipkart,
        bbasket,
        min,
      });

    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  const addToCart = () => {
    if (!result) return;

    setItems((prev) => [
      ...prev,
      {
        item: result.name,
        amazon: result.amazon,
        flipkart: result.flipkart,
        bbasket: result.bbasket,
        qty: 1,
      },
    ]);
  };

  return (
    <div className={`card p-4 mb-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>🔍 Quick Price Check</h5>

      <div className="d-flex justify-content-center mt-3">
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <div className="input-group shadow-sm">

            <input
              type="text"
              className="form-control"
              placeholder="Search item (milk, rice, soap...)"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);

                if (!value.trim()) {
                  setResult(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchData();
              }}
            />

            <button
              className="btn btn-primary"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "..." : "🔍"}
            </button>

          </div>
        </div>
      </div>

      {result && (
        <div className="mt-4 border p-3 rounded">
          <h6>Result: {result.name}</h6>

          <p className={result.amazon === result.min ? "text-success fw-bold" : ""}>
            Amazon: ₹{result.amazon}
          </p>

          <p className={result.flipkart === result.min ? "text-success fw-bold" : ""}>
            Flipkart: ₹{result.flipkart}
          </p>

          <p className={result.bbasket === result.min ? "text-success fw-bold" : ""}>
            BigBasket: ₹{result.bbasket}
          </p>

          <h6 className="text-success">🏆 Best: ₹{result.min}</h6>

          <button className="btn btn-primary btn-sm mt-2" onClick={addToCart}>
            ➕ Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;