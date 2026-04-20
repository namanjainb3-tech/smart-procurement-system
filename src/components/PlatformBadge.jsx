const colors = {
  amazon: "#3b82f6",   
  flipkart: "#2874f0",
  blinkit: "#facc15",
  zepto: "#a855f7",
  swiggy: "#fb923c",
  bbasket: "#22c55e",
};

const PlatformBadge = ({ name, price, isBest }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-2 py-1 mb-1 rounded"
      style={{
        background: isBest ? "#16a34a" : "#f1f5f9",
        color: isBest ? "#fff" : "#000",
        fontSize: "0.85rem",
      }}
    >
      <span style={{ color: colors[name] }}>{name}</span>
      <strong>₹{price}</strong>
    </div>
  );
};

export default PlatformBadge;