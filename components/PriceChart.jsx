import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PriceChart = ({ totals, dark }) => {
  if (!totals) return null;

  const data = {
    labels: ["Amazon", "Flipkart", "BigBasket"],
    datasets: [
      {
        label: "Total Cost",
        data: [totals.amazon, totals.flipkart, totals.bbasket],
        backgroundColor: [
          "rgba(255, 153, 0, 0.9)",
          "rgba(40, 116, 240, 0.9)",
          "rgba(52, 168, 83, 0.9)",
        ],
        borderRadius: 8, 
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    
    plugins: {
      legend: {
        labels: {
          color: dark ? "#eaeaea" : "#000",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#ddd",
        borderColor: "#444",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `₹ ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: dark ? "#ddd" : "#000",
          font: { size: 13 },
        },
        grid: {
          color: dark ? "rgba(255,255,255,0.1)" : "#ddd",
        },
      },
      y: {
        ticks: {
          color: dark ? "#ddd" : "#000",
          font: { size: 13 },
        },
        grid: {
          color: dark ? "rgba(255,255,255,0.1)" : "#ddd",
        },
      },
    },
  };

  return (
    <div className={`card mt-4 p-3 ${dark ? "bg-secondary text-light" : ""}`}>
      <h5>📊 Platform Comparison</h5>
      <div style={{ height: "300px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;