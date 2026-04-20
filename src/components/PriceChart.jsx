import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PriceChart = ({ items = [], dark }) => {
  if (!items.length) return null;

  const platforms = ["amazon", "flipkart", "blinkit", "zepto", "swiggy", "bbasket"];

  const totals = {};

  platforms.forEach((p) => (totals[p] = 0));

  items.forEach((item) => {
    const qty = item.qty || 1;

    platforms.forEach((p) => {
      if (typeof item[p] === "number") {
        totals[p] += item[p] * qty;
      }
    });
  });

  const validEntries = Object.entries(totals).filter(([_, v]) => v > 0);

  // ✅ SAFETY CHECK (VERY IMPORTANT)
  if (!validEntries.length) return null;

  const labels = validEntries.map(([k]) => k);
  const values = validEntries.map(([_, v]) => v);

  const colorMap = {
      amazon: "#3b82f6",
      flipkart: "#2874f0", 
      blinkit: "#facc15",
      zepto: "#a855f7",
      swiggy: "#fb923c",
      bbasket: "#22c55e",
  };

  const backgroundColors = labels.map(
    (l) => colorMap[l] || "#999" // fallback to avoid crash
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Total Cost",
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div
      className={`card mt-4 p-3 shadow-sm ${
        dark ? "bg-secondary text-light" : ""
      }`}
    >
      <h5 className="text-center mb-3">📊 Platform Comparison</h5>

      <div style={{ height: "240px", maxWidth: "500px", margin: "0 auto" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;