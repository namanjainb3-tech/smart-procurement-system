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

  const platforms = ["blinkit", "zepto", "swiggy", "bbasket"];

  // 🔥 calculate totals (ignore nulls)
  const totals = {};

  platforms.forEach((p) => {
    totals[p] = 0;
  });

  items.forEach((item) => {
    const qty = item.qty || 1;

    platforms.forEach((p) => {
      if (typeof item[p] === "number") {
        totals[p] += item[p] * qty;
      }
    });
  });

  // 🔥 remove platforms with 0 values
  const validEntries = Object.entries(totals).filter(([_, v]) => v > 0);

  const labels = validEntries.map(([k]) => k);
  const values = validEntries.map(([_, v]) => v);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Cost",
        data: values,
        backgroundColor: [
          "#facc15", // Blinkit
          "#a855f7", // Zepto
          "#fb923c", // Swiggy
          "#22c55e", // BigBasket
        ],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹ ${ctx.raw}`,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: dark ? "#fff" : "#000",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: dark ? "#fff" : "#000",
        },
      },
    },
  };

  return (
    <div
      className={`card mt-4 p-3 shadow-sm ${
        dark ? "bg-secondary text-light" : ""
      }`}
    >
      <h5 className="text-center mb-3">📊 Platform Comparison</h5>

      {/* 🔥 COMPACT CHART */}
      <div
        style={{
          height: "240px",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;