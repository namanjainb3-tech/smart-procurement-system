const Summary = ({ items }) => {
  if (!items.length) {
    return (
      <div className="card p-5 text-center shadow-sm">
        <h5 className="fw-bold">💡 Smart Insights</h5>
        <p className="text-muted">Add items to unlock insights</p>
      </div>
    );
  }

  const platforms = ["blinkit", "zepto", "swiggy", "bbasket"];

  const totals = {
    blinkit: 0,
    zepto: 0,
    swiggy: 0,
    bbasket: 0,
  };

  items.forEach((item) => {
    const qty = item.qty || 1;

    platforms.forEach((p) => {
      if (typeof item[p] === "number") {
        totals[p] += item[p] * qty;
      }
    });
  });

  const validTotals = Object.entries(totals).filter(([_, v]) => v > 0);

  const best = validTotals.length
    ? validTotals.reduce((a, b) => (a[1] < b[1] ? a : b))
    : null;

  const values = validTotals.map(([_, v]) => v);
  const savings = Math.max(...values) - Math.min(...values);

  return (
    <div className="card p-4 shadow-sm">

      <h5 className="mb-3">💡 Insights</h5>

      {/* 🔥 PLATFORM CARDS */}
      <div className="row">
        {validTotals.map(([k, v]) => (
          <div className="col-6 mb-2" key={k}>
            <div
              className="p-3 text-center rounded"
              style={{
                background: k === best?.[0] ? "#dcfce7" : "#f8fafc",
                border:
                  k === best?.[0]
                    ? "2px solid #16a34a"
                    : "1px solid #e5e7eb",
              }}
            >
              <div style={{ textTransform: "capitalize" }}>{k}</div>
              <strong>₹{v}</strong>
              {k === best?.[0] && (
                <div className="text-success small">🏆 Best</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 SAVINGS BANNER */}
      {best && savings > 0 && (
        <div
          className="mt-3 p-3 text-center rounded"
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "white",
            fontWeight: "600",
          }}
        >
          💰 You save ₹{savings} by choosing {best[0]}
        </div>
      )}

      {/* 🔥 AI LINE */}
      {best && (
        <div className="mt-2 text-center text-muted small">
          🤖 Buy most items from <strong>{best[0]}</strong> for max savings
        </div>
      )}
    </div>
  );
};

export default Summary;