import { useState } from "react";

const SearchBox = ({ setItems, query, setQuery }) => {
  const [loading, setLoading] = useState(false);

  const normalizePrice = (val) => {
    if (val === null || val === undefined) return null;

    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const fetchData = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const API_URL = "http://localhost:5000";

      const res = await fetch(
        `${API_URL}/api/search?query=${query}`
      );

      const data = await res.json();

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await fetch(
        "http://localhost:5000/api/user-item",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            google_id: user.google_id,
            item_name: data.name,
            image: data.image,
            amazon: data.amazon,
            flipkart: data.flipkart,
            blinkit: data.blinkit,
            zepto: data.zepto,
            swiggy: data.swiggy,
            bbasket: data.bbasket,
            qty: 1,
          }),
        }
      );

      const newItem = {
        item: data.name,
        image: data.image,

        amazon: normalizePrice(
          data.amazon
        ),
        flipkart: normalizePrice(
          data.flipkart
        ),
        blinkit: normalizePrice(
          data.blinkit
        ),
        zepto: normalizePrice(
          data.zepto
        ),
        swiggy: normalizePrice(
          data.swiggy
        ),
        bbasket: normalizePrice(
          data.bbasket
        ),

        // TRUST STATUS
        amazon_status:
          data.amazon_status,
        flipkart_status:
          data.flipkart_status,
        blinkit_status:
          data.blinkit_status,
        zepto_status:
          data.zepto_status,
        swiggy_status:
          data.swiggy_status,
        bbasket_status:
          data.bbasket_status,

        qty: 1,
      };

      setItems((prev) => {
        const index = prev.findIndex(
          (item) =>
            item.item.toLowerCase() ===
            data.name.toLowerCase()
        );

        if (index !== -1) {
          const updated = [...prev];

          updated[index] = {
            ...prev[index],
            ...newItem,
            qty:
              prev[index].qty || 1,
          };

          return updated;
        }

        return [...prev, newItem];
      });
    } catch (err) {
      console.error(
        "Fetch error:",
        err
      );
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
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            fetchData()
          }
        />

        <button
          className="btn btn-primary"
          onClick={fetchData}
        >
          {loading
            ? "..."
            : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;