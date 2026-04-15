import { priceData } from "../mockData";
import { normalizeName, getItemName, getQuantity } from "../utils";

const ItemTable = ({ items, setItems, dark }) => {
  if (!items.length) return null;

  const handleDelete = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, change) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const currentQty = item.qty || getQuantity(item);
        const newQty = Math.max(1, currentQty + change);

        return { ...item, qty: newQty };
      })
    );
  };

  return (
    <div className={`card p-3 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📊 Price Comparison</h5>

      <table className="table table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Amazon</th>
            <th>Flipkart</th>
            <th>BigBasket</th>
            <th>Best</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => {
            const rawName = getItemName(item);
            if (!rawName || rawName.toLowerCase().includes("total")) return null;

            const name = normalizeName(rawName);
            const p = priceData[name] || {};

            const qty = item.qty || getQuantity(item);

            const prices = {
              amazon: (p.amazon || Infinity) * qty,
              flipkart: (p.flipkart || Infinity) * qty,
              bbasket: (p.bbasket || Infinity) * qty,
            };

            const min = Math.min(...Object.values(prices));

            return (
              <tr key={i}>
                <td>
                  {rawName}
                  <span className="badge bg-info ms-2">{name}</span>
                </td>

                {["amazon", "flipkart", "bbasket"].map((k) => (
                  <td
                    key={k}
                    className={
                      prices[k] === min ? "bg-success text-white" : ""
                    }
                  >
                    ₹{prices[k] !== Infinity ? prices[k] : "-"}
                  </td>
                ))}

                <td className="fw-bold text-success">
                  ₹{min !== Infinity ? min : "-"}
                </td>

                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQty(i, -1)}
                    >
                      -
                    </button>

                    <span className="fw-bold">{qty}</span>

                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => updateQty(i, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(i)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;