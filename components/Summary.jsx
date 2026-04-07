import { priceData } from "../mockData";
import { normalizeName, getItemName, getQuantity } from "../utils";

const Summary = ({ items, dark }) => {
  if (!items.length) return null;

  let amazon = 0,
    flipkart = 0,
    bbasket = 0,
    optimized = 0;

  items.forEach((item) => {
    const rawName = getItemName(item);
    if (!rawName || rawName.toLowerCase().includes("total")) return;

    const name = normalizeName(rawName);
    const p = priceData[name] || {};

    const qty = item.qty || getQuantity(item);

    const prices = {
      amazon: (p.amazon || Infinity) * qty,
      flipkart: (p.flipkart || Infinity) * qty,
      bbasket: (p.bbasket || Infinity) * qty,
    };

    amazon += prices.amazon !== Infinity ? prices.amazon : 0;
    flipkart += prices.flipkart !== Infinity ? prices.flipkart : 0;
    bbasket += prices.bbasket !== Infinity ? prices.bbasket : 0;

    const min = Math.min(...Object.values(prices));
    if (min !== Infinity) optimized += min;
  });

  const best =
    Math.min(amazon, flipkart, bbasket) === amazon
      ? "Amazon"
      : Math.min(amazon, flipkart, bbasket) === flipkart
      ? "Flipkart"
      : "BigBasket";

  return (
    <div className={`card p-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>💡 Insights</h5>

      <p>Amazon: ₹{amazon}</p>
      <p>Flipkart: ₹{flipkart}</p>
      <p>BigBasket: ₹{bbasket}</p>

      <hr />

      <h6 className="text-success">Optimized: ₹{optimized}</h6>

      <div className="alert alert-primary">
        💸 You saved ₹{amazon - optimized}
      </div>

      <div className="alert alert-success">
        🏆 Best Platform: {best}
      </div>
    </div>
  );
};

export default Summary;