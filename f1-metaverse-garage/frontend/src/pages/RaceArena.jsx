import React from "react";
import "./RaceArena.css";
import { useNavigate } from "react-router-dom";

export default function RaceArena() {
  const navigate = useNavigate();

  return (
    <div className="race-dashboard">
      {/* Top Left Info */}
      <div className="position-box">
        <p>POSITION</p>
        <h2>P3 / 12</h2>
      </div>
      <div className="lap-box">
        <p>LAP</p>
        <h2>2 / 50</h2>
      </div>

      {/* Top Right Info */}
      <div className="timing-box">
        <p>Current Lap: 1:28.451</p>
        <p>Last Lap: 1:27.982</p>
        <p>
          Best Lap: <span className="highlight">1:27.115</span>
        </p>
      </div>

      {/* Center Camera View */}
      <div className="car-view">
        <img
          src="https://i.imgur.com/mYH7Qwd.jpeg"
          alt="Track view"
          className="track-image"
        />
      </div>

      {/* Speed HUD */}
      <div className="hud">
        <div className="speed">
          <p>SPEED</p>
          <h1>320</h1>
          <p>KPH</p>
        </div>
        <div className="gear">
          <p>GEAR</p>
          <h1>8</h1>
        </div>
        <div className="rpm">
          <p>RPM</p>
          <h1>11500</h1>
        </div>
      </div>

      {/* Mini Map */}
      <div className="map-box">
        <img
          src="https://i.imgur.com/xqC4oOS.jpeg"
          alt="Map"
          className="map"
        />
      </div>

      {/* Exit / Back to Circuits */}
      <button className="exit-btn" onClick={() => navigate("/circuits")}>
        ← Exit Race
      </button>
    </div>
  );
}
