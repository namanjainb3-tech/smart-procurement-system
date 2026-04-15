import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const calculateTotals = (items = []) => {
  let amazon = 0, flipkart = 0, bbasket = 0;

  items.forEach((item) => {
    const qty = item?.qty || 1;

    const a = Number(item?.amazon) || 0;
    const f = Number(item?.flipkart) || 0;
    const b = Number(item?.bbasket) || 0;

    amazon += a * qty;
    flipkart += f * qty;
    bbasket += b * qty;
  });

  return { amazon, flipkart, bbasket };
};

const PriceChart = ({ items = [], dark }) => {

  const { amazon, flipkart, bbasket } = calculateTotals(items);

  const data = {
    labels: ["Amazon", "Flipkart", "BigBasket"],
    datasets: [
      {
        label: "Total Cost",
        data: [amazon, flipkart, bbasket],
        backgroundColor: [
          "rgba(255,153,0,0.9)",
          "rgba(40,116,240,0.9)",
          "rgba(52,168,83,0.9)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: dark ? "#fff" : "#000",
        },
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
    <div className={`card mt-4 p-3 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📊 Platform Comparison</h5>

      {/* 🔥 FIXED SIZE */}
      <div style={{ height: "300px", maxWidth: "600px", margin: "0 auto" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;