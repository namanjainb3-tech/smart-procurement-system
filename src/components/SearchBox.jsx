import { useState } from "react";

const SearchBox = ({ setItems, query, setQuery }) => {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://smart-procurement-system.onrender.com/api/search?query=${query}`
      );

      const data = await res.json();

      setItems((prev) => {
        const exists = prev.some(
          (item) => item.item === data.name
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            item: data.name,
            image: data.image,
            blinkit: data.blinkit,
            zepto: data.zepto,
            swiggy: data.swiggy,
            bbasket: data.bbasket,
            qty: 1,
          },
        ];
      });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h5>🔍 Quick Price Check</h5>

      <div className="input-group mt-3">
        <input
          className="form-control"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
        />

        <button
          className="btn btn-primary"
          onClick={fetchData}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;