const Summary = ({ items, dark }) => {
  if (!items.length) return null;

  let amazon = 0,
    flipkart = 0,
    bbasket = 0,
    optimized = 0;

  const plan = {
    Amazon: [],
    Flipkart: [],
    BigBasket: [],
  };

  items.forEach((item) => {
    const qty = item.qty || 1;

    const prices = {
      Amazon: item.amazon ? item.amazon * qty : Infinity,
      Flipkart: item.flipkart ? item.flipkart * qty : Infinity,
      BigBasket: item.bbasket ? item.bbasket * qty : Infinity,
    };

    // totals
    amazon += prices.Amazon !== Infinity ? prices.Amazon : 0;
    flipkart += prices.Flipkart !== Infinity ? prices.Flipkart : 0;
    bbasket += prices.BigBasket !== Infinity ? prices.BigBasket : 0;

    // best per item
    const best = Object.entries(prices).sort((a, b) => a[1] - b[1])[0];

    if (best[1] !== Infinity) {
      optimized += best[1];
      plan[best[0]].push(item.item);
    }
  });

  const bestPlatform =
    Math.min(amazon, flipkart, bbasket) === amazon
      ? "Amazon"
      : Math.min(amazon, flipkart, bbasket) === flipkart
      ? "Flipkart"
      : "BigBasket";

  const worst = Math.max(amazon, flipkart, bbasket);
  const savings = worst - optimized;

  return (
    <div className={`card p-4 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>💡 Insights</h5>

      {/* Platform Totals */}
      <div className="mb-2">
        <p>Amazon: ₹{amazon}</p>
        <p>Flipkart: ₹{flipkart}</p>
        <p>BigBasket: ₹{bbasket}</p>
      </div>

      <hr />

      {/* Optimized */}
      <h6 className="text-success">Optimized Cost: ₹{optimized}</h6>

      <div className="alert alert-primary">
        💸 You save ₹{savings}
      </div>

      <div className="alert alert-success">
        🏆 Best Platform Overall: {bestPlatform}
      </div>

      {/* Buy Plan */}
      <h6 className="mt-3">🛒 Optimized Buy Plan</h6>

      {Object.entries(plan).map(([platform, list]) =>
        list.length ? (
          <div key={platform} className="mb-2">
            <strong>{platform}:</strong>
            <div style={{ fontSize: "0.9rem" }}>
              {list.join(", ")}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Summary;