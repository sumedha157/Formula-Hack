import React, { useState } from "react";
import axios from "axios";
import "./Circuits.css";
import { useNavigate } from "react-router-dom";
import backgroundCircuit from "../assets/background-circuit.png"; // ✅ use your image
import monzaImg from "../assets/monza_f1_circuit.jpeg";
import silverstoneImg from "../assets/Silverstone_f1_circuit.jpeg";
import monacoImg from "../assets/Monaco_f1_circuit.jpeg";
import spaImg from "../assets/spa_f1_circuit.jpg";

const tracks = [
  { name: "Monza", country: "Italy", img: monzaImg },
  { name: "Silverstone", country: "Great Britain", img: silverstoneImg },
  { name: "Monaco", country: "Monaco", img: monacoImg },
  { name: "Spa", country: "Belgium", img: spaImg },
];
export default function Circuits() {
  const [selectedTrack, setSelectedTrack] = useState("Monza");
  const [aiDifficulty, setAiDifficulty] = useState(85);
  const [laps, setLaps] = useState(25);
  const [carTeam, setCarTeam] = useState("Red Bull Racing");
  const [collisions, setCollisions] = useState(true);
  const [damage, setDamage] = useState("Full");
  const [startingGrid, setStartingGrid] = useState("Qualifying");
  const [weather, setWeather] = useState("Sunny");
  const [dynamicWeather, setDynamicWeather] = useState(false);
  const navigate = useNavigate();

  const handleStartRace = async () => {
    try {
      const raceConfig = {
        track: selectedTrack,
        ai_difficulty: aiDifficulty,
        laps,
        car_team: carTeam,
        collisions,
        damage,
        starting_grid: startingGrid,
        weather,
        dynamic_weather: dynamicWeather,
      };

      await axios.post("http://127.0.0.1:8000/api/race/setup", raceConfig);
      navigate("/garage");
    } catch (err) {
      console.error("Error saving race config:", err);
      alert("⚠️ Unable to start race. Check backend connection.");
    }
  };

  // ✅ Background styling using your local image
  const backgroundStyle = {
    backgroundImage: `url(${backgroundCircuit})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100%",
    position: "relative",
  };

  return (
    <div className="app" style={backgroundStyle}>
      <div className="overlay" /> {/* ✅ same overlay for readability */}

      <div className="header">
        <h2>🏁 Race Setup</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <h3>Select Track</h3>

      <div className="track-grid">
        {tracks.map((t) => (
          <div
            key={t.name}
            className={`track-card ${selectedTrack === t.name ? "selected" : ""}`}
            onClick={() => setSelectedTrack(t.name)}
          >
            <img src={t.img} alt={t.name} />
            <div className="track-info">
              <h4>{t.name}</h4>
              <p>{t.country}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-grid">
        {/* Race Settings */}
        <div className="settings-card">
          <h4>Race Settings</h4>
          <div className="setting">
            <label>AI Difficulty</label>
            <input
              type="range"
              min="0"
              max="100"
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
            />
            <span>{aiDifficulty}</span>
          </div>

          <div className="setting">
            <label>Number of Laps</label>
            <input
              type="number"
              min="1"
              max="100"
              value={laps}
              onChange={(e) => setLaps(e.target.value)}
            />
          </div>

          <div className="setting">
            <label>Car & Team</label>
            <select value={carTeam} onChange={(e) => setCarTeam(e.target.value)}>
              <option>Red Bull Racing</option>
              <option>Ferrari</option>
              <option>Mercedes</option>
              <option>McLaren</option>
            </select>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="settings-card">
          <h4>Gameplay Settings</h4>
          <div className="setting">
            <label>Collisions</label>
            <input
              type="checkbox"
              checked={collisions}
              onChange={() => setCollisions(!collisions)}
            />
          </div>

          <div className="setting">
            <label>Damage</label>
            <select value={damage} onChange={(e) => setDamage(e.target.value)}>
              <option>Full</option>
              <option>Visual Only</option>
              <option>Off</option>
            </select>
          </div>

          <div className="setting">
            <label>Starting Grid</label>
            <select
              value={startingGrid}
              onChange={(e) => setStartingGrid(e.target.value)}
            >
              <option>Qualifying</option>
              <option>Random</option>
              <option>Reverse Grid</option>
            </select>
          </div>
        </div>

        {/* Weather Settings */}
        <div className="settings-card">
          <h4>Weather Settings</h4>
          <div className="weather-options">
            {["Sunny", "Cloudy", "Rain"].map((w) => (
              <button
                key={w}
                className={`weather-btn ${weather === w ? "active" : ""}`}
                onClick={() => setWeather(w)}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="setting">
            <label>Dynamic Weather</label>
            <input
              type="checkbox"
              checked={dynamicWeather}
              onChange={() => setDynamicWeather(!dynamicWeather)}
            />
          </div>
        </div>
      </div>

      <button className="start-btn" onClick={() => navigate("/arena")}>
        Start Race →
      </button>
    </div>
  );
}
