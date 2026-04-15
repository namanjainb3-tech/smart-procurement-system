import { useState } from "react";
import { priceData } from "../mockData";
import { normalizeName } from "../utils";

const allItems = Object.keys(priceData);

const SearchBox = ({ dark, setItems }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);

  const handleChange = (value) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      setResult(null);
      return;
    }

    const filtered = allItems.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));

    const name = normalizeName(value);
    const data = priceData[name];

    if (!data) {
      setResult(null);
      return;
    }

    const min = Math.min(data.amazon, data.flipkart, data.bbasket);

    setResult({ name, ...data, min });
  };

  const handleSelect = (item) => {
    setQuery(item);
    handleChange(item);
    setSuggestions([]);
  };

  const addToCart = () => {
    if (!result) return;

    setItems((prev) => {
        if (prev.some((i) => i.item === result.name.toUpperCase())) return prev;
        return [...prev, { item: result.name.toUpperCase() }];
      });
  };

  return (
    <div className={`card p-4 mb-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>🔍 Quick Price Check</h5>

      <input
        type="text"
        className="form-control mt-2"
        placeholder="Search item (milk, rice, soap...)"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />

      {suggestions.length > 0 && (
        <div className="list-group mt-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-3 border p-3 rounded">
          <h6 className="mb-2">
            Result: <span className="text-info">{result.name}</span>
          </h6>

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

          <button className="btn btn-sm btn-primary mt-2" onClick={addToCart}>
            ➕ Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;