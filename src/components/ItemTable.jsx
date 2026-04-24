import "./ItemTable.css";
import { motion, AnimatePresence } from "framer-motion";

const ItemTable = ({ items, setItems }) => {
  if (!items || !items.length) return null;

  const platforms = [
    "amazon",
    "flipkart",
    "blinkit",
    "zepto",
    "swiggy",
    "bbasket",
  ];

  const getNumber = (val) => {
    if (val === null || val === undefined) return null;

    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const getBestPlatform = (item) => {
    let bestPlatform = null;
    let bestPrice = Infinity;

    platforms.forEach((p) => {
      const val = getNumber(item[p]);

      if (val !== null && val < bestPrice) {
        bestPrice = val;
        bestPlatform = p;
      }
    });

    return bestPlatform;
  };

  const getDeepLink = (platform, query) => {
    const q = encodeURIComponent(query);

    const links = {
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
      blinkit: `https://blinkit.com/s/?q=${q}`,
      zepto: `https://www.zeptonow.com/search?query=${q}`,
      swiggy: `https://www.swiggy.com/instamart/search?custom_back=true&query=${q}`,
      bbasket: `https://www.bigbasket.com/ps/?q=${q}`,
    };

    return links[platform];
  };

  // ✅ FIXED COMPACT STATUS BADGE
  const getStatusBadge = (status) => {
    let color = "#16a34a";
    let text = "Live";

    if (status === "cache") {
      color = "#f59e0b";
      text = "Cache";
    }

    if (status === "estimated") {
      color = "#ef4444";
      text = "Est";
    }

    return (
      <small
        style={{
          color,
          display: "block",
          fontWeight: "600",
          marginTop: "3px",
          fontSize: "11px",
          lineHeight: "1",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </small>
    );
  };

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
                <th
                  key={p}
                  style={{ textTransform: "capitalize", minWidth: "90px" }}
                >
                  {p}
                </th>
              ))}

              <th>Best</th>
              <th>Qty</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {items.map((item, i) => {
                const qty = item.qty || 1;

                const validPrices = platforms
                  .map((p) => getNumber(item[p]))
                  .filter((v) => v !== null);

                const min =
                  validPrices.length > 0
                    ? Math.min(...validPrices)
                    : null;

                const bestPlatform =
                  getBestPlatform(item);

                return (
                  <motion.tr
                    key={item.item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
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

                        <span className="item-name">
                          {item.item}
                        </span>
                      </div>
                    </td>

                    {/* PLATFORMS */}
                    {platforms.map((p) => {
                      const num = getNumber(item[p]);

                      const value =
                        num !== null
                          ? num * qty
                          : null;

                      const isBest =
                        num !== null &&
                        min !== null &&
                        num === min;

                      const status =
                        item[`${p}_status`] ||
                        "live";

                      return (
                        <td
                          key={p}
                          style={{ minWidth: "90px" }}
                        >
                          {value !== null ? (
                            <>
                              <span
                                className={`price-pill ${
                                  isBest
                                    ? "best"
                                    : ""
                                }`}
                              >
                                ₹{value}
                              </span>

                              {getStatusBadge(
                                status
                              )}
                            </>
                          ) : (
                            <span className="text-muted">
                              -
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* BEST */}
                    <td>
                      {min !== null ? (
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
                        <button
                          onClick={() =>
                            updateQty(i, -1)
                          }
                        >
                          −
                        </button>

                        <span>{qty}</span>

                        <button
                          onClick={() =>
                            updateQty(i, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* ORDER */}
                    <td>
                      {bestPlatform ? (
                        <button
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() =>
                            window.open(
                              getDeepLink(
                                bestPlatform,
                                item.item
                              ),
                              "_blank"
                            )
                          }
                        >
                          🛒{" "}
                          {bestPlatform ===
                          "swiggy"
                            ? "instamart"
                            : bestPlatform}
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* DELETE */}
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(i)
                        }
                      >
                        ✕
                      </button>
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