import React, { useState } from "react";
import axios from "axios";
import CarModel from "../components/CarModel";
import PerformanceCard from "../components/PerformanceCard";

export default function Garage() {
  const [setup, setSetup] = useState({
    downforce: 50,
    drag: 40,
    engine: 80,
    tire: "medium",
    fuel: 50,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setSetup((prev) => ({ ...prev, [key]: value }));

  const predictPerformance = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/predict", setup);
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to fetch performance prediction. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6">
      {/* Header */}
      <header className="w-full max-w-6xl text-center mb-8">
        <div className="inline-flex items-center justify-center">
          <span className="title-icon" aria-hidden="true" />
          <h1 className="neon-title">F1 Metaverse Garage</h1>
        </div>
        <p className="muted mt-2">Tune your F1 car and predict performance in real time.</p>
      </header>

      {/* Main two-column area */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Panel — Controls */}
        <div className="card bg-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="section-head">⚙️ Car Tuning Controls</h2>
          </div>

          {/* Downforce */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Downforce: <span className="hud">{setup.downforce}</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={setup.downforce}
              onChange={(e) => update("downforce", Number(e.target.value))}
            />
          </div>

          {/* Drag */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Drag: <span className="hud">{setup.drag}</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={setup.drag}
              onChange={(e) => update("drag", Number(e.target.value))}
            />
          </div>

          {/* Engine */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Engine Power: <span className="hud">{setup.engine}</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={setup.engine}
              onChange={(e) => update("engine", Number(e.target.value))}
            />
          </div>

          {/* Fuel */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Fuel Load: <span className="hud">{setup.fuel}</span></label>
            <input
              type="range"
              min="0"
              max="100"
              value={setup.fuel}
              onChange={(e) => update("fuel", Number(e.target.value))}
            />
          </div>

          {/* Tire Type */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Tire Type:</label>
            <select
              value={setup.tire}
              onChange={(e) => update("tire", e.target.value)}
              className="w-full text-black rounded-md p-2"
            >
              <option value="soft">Soft (fastest, wears quick)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="hard">Hard (durable, slower)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={predictPerformance}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "⏳ Calculating..." : "🚀 Predict Performance"}
            </button>
          </div>
        </div>

        {/* Right Panel — 3D + Prediction */}
        <div className="card bg-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-gray-700 flex flex-col items-center">
          <h2 className="section-head mb-4">🏎️ Your F1 Car Preview</h2>

          <div className="canvas-wrap w-full h-[420px] mb-6">
            <div className="canvas-frame w-full h-full">
              <CarModel engine={setup.engine} />
              </div>
</div>


          <h2 className="section-head mb-4">📊 Predicted Performance</h2>
          
          <div className="w-full">
            {prediction ? (
              <div className="space-y-4">
                <PerformanceCard
                  title="Estimated Lap Time"
                  value={`${prediction.predicted_lap_time.toFixed(2)}s`}
                  color="text-yellow-400"
                />
                {/* Show additional info when available */}
                {"predicted_lap_times" in prediction && (
                  <div>
                    <div className="text-sm muted mb-1">Lap times:</div>
                    <div className="flex gap-2">
                      {prediction.predicted_lap_times.map((t, i) => (
                        <div key={i} className="hud">{t.toFixed(2)}s</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="muted text-center">Adjust your car setup and click “Predict Performance” to see results.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="page-footer mt-8 max-w-6xl text-center">
        © {new Date().getFullYear()} F1 Metaverse Garage — Built for the Hackathon
      </footer>
    </div>
  );
}
