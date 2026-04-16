const PlatformCards = ({ totals }) => {
    const entries = Object.entries(totals).filter(([_, v]) => v > 0);
  
    if (!entries.length) return null;
  
    const best = entries.reduce((a, b) => (a[1] < b[1] ? a : b));
  
    return (
      <div className="d-flex gap-3 flex-wrap justify-content-center mt-3">
  
        {entries.map(([k, v]) => (
          <div
            key={k}
            className={`card p-3 text-center shadow-sm`}
            style={{
              width: "120px",
              border: k === best[0] ? "2px solid green" : "1px solid #eee"
            }}
          >
            <div style={{ fontSize: "14px", textTransform: "capitalize" }}>
              {k}
            </div>
            <strong>₹{v}</strong>
  
            {k === best[0] && (
              <div className="text-success small">🏆 Best</div>
            )}
          </div>
        ))}
  
      </div>
    );
  };
  
  export default PlatformCards;