import "./ItemTable.css";
import { motion, AnimatePresence } from "framer-motion";

const ItemTable = ({ items, setItems }) => {
  if (!items.length) return null;

  const platforms = ["blinkit", "zepto", "swiggy", "bbasket"];

  const updateQty = (index, change) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          qty: Math.max(1, (item.qty || 1) + change),
        };
      })
    );
  };

  const handleDelete = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      className="card premium-table mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h5 className="mb-3">📊 Price Comparison</h5>

      <div className="table-responsive">
        <table className="table align-middle text-center">
          <thead>
            <tr>
              <th>Item</th>
              {platforms.map((p) => (
                <th key={p}>{p}</th>
              ))}
              <th>Best</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {items.map((item, i) => {
                const qty = item.qty || 1;

                const prices = platforms
                  .map((p) => item[p])
                  .filter((v) => v != null);

                const min = prices.length ? Math.min(...prices) : null;

                return (
                  <motion.tr
                    key={item.item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* ITEM */}
                    <td className="item-td">
                      <div className="item-cell">
                        <div className="img-box">
                          <img
                            src={item.image}
                            alt=""
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/40")
                            }
                          />
                        </div>
                        <span className="item-name">{item.item}</span>
                      </div>
                    </td>

                    {/* PRICES */}
                    {platforms.map((p) => {
                      const value =
                        item[p] != null ? item[p] * qty : null;

                      const isBest =
                        value && min && value === min * qty;

                      return (
                        <td key={p}>
                          {value ? (
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`price-pill ${
                                isBest ? "best" : ""
                              }`}
                            >
                              ₹{value}
                            </motion.span>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}

                    {/* BEST */}
                    <td>
                      {min ? (
                        <span className="best-pill">
                          ₹{min * qty}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* QTY */}
                    <td>
                      <div className="qty-box">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQty(i, -1)}
                        >
                          −
                        </motion.button>

                        <span>{qty}</span>

                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQty(i, 1)}
                        >
                          +
                        </motion.button>
                      </div>
                    </td>

                    {/* DELETE */}
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="delete-btn"
                        onClick={() => handleDelete(i)}
                      >
                        ✕
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ItemTable;