// frontend/src/pages/Training.jsx
import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Training() {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lapTimes, setLapTimes] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [episodes, setEpisodes] = useState(50);

  const startTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setLapTimes([]);
    setRewards([]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/train", {
        episodes: episodes,
      });

      // Simulated updates for frontend demo (we’ll connect to real-time later)
      for (let i = 1; i <= episodes; i++) {
        await new Promise((r) => setTimeout(r, 100));
        setProgress(Math.round((i / episodes) * 100));
        setLapTimes((prev) => [...prev, Math.max(20 + Math.random() * 10 - i * 0.05, 15)]);
        setRewards((prev) => [...prev, Math.min(30 + Math.random() * 10 + i * 0.3, 70)]);
      }

      console.log("Training Response:", response.data);
    } catch (error) {
      console.error(error);
      alert("⚠️ Training failed. Make sure FastAPI backend is running.");
    } finally {
      setIsTraining(false);
    }
  };

  const data = {
    labels: lapTimes.map((_, i) => `Ep ${i + 1}`),
    datasets: [
      {
        label: "Lap Time (s)",
        data: lapTimes,
        borderColor: "#ff6b6b",
        fill: false,
        tension: 0.2,
      },
      {
        label: "Reward",
        data: rewards,
        borderColor: "#00ffb3",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { labels: { color: "#fff" } },
    },
    scales: {
      x: { ticks: { color: "#aaa" } },
      y: { ticks: { color: "#aaa" } },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-black via-gray-900 to-black text-white py-10 px-6">
      <h1 className="text-4xl font-extrabold text-red-500 mb-2">🤖 AI Driver Training</h1>
      <p className="text-gray-400 mb-6">
        Train your AI driver to master lap performance using reinforcement learning.
      </p>

      <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700 shadow-2xl max-w-5xl w-full">
        {/* Training Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-6 items-center">
          <div className="flex items-center gap-4">
            <label>Number of Episodes:</label>
            <input
              type="number"
              value={episodes}
              min="10"
              max="500"
              className="px-3 py-2 rounded bg-gray-800 border border-gray-600 w-24 text-center"
              onChange={(e) => setEpisodes(Number(e.target.value))}
            />
          </div>
          <button
            onClick={startTraining}
            disabled={isTraining}
            className={`mt-4 md:mt-0 px-6 py-3 text-lg font-bold rounded-lg ${
              isTraining
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            {isTraining ? "Training..." : "🚀 Train AI Driver"}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-6 mb-6">
          <div
            className="bg-red-500 h-6 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-gray-400 mb-6">{progress}% Complete</div>

        {/* Chart */}
        <div className="bg-black/60 rounded-xl p-4 shadow-inner">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
