import React from "react";
import "./Home.css"; 
import heroImg from "../assets/hero.png";
import avatarImg from "../assets/avatar.jpeg";
import { useNavigate } from "react-router-dom";


function TopBar() {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-logo">🏁</div>
        <div className="brand-title">F1 Metaverse</div>
      </div>

      <div className="player">
        <img
          src={avatarImg}
          alt="avatar"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://i.imgur.com/6YVQZ3f.png";
          }}
        />
        <div className="player-info">
          <div className="player-name">Player01</div>
          <div className="player-meta">Rank: Rookie | Team Velocity</div>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ label, primary, onClick }) {
  return (
    <button
      className={`menu-btn ${primary ? "primary" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const backgroundStyle = heroImg
    ? { backgroundImage: `url(${heroImg})` }
    : {
        background:
          "linear-gradient(90deg,#0b0b0b 0%, #1b1b1b 50%, #0b0b0b 100%)",
      };

  return (
    <div className="back" style={backgroundStyle}>
      <div className="overlay" />

      <TopBar />

      <main className="center-area">
        <h1 className="title">
          START YOUR
          <br />
          ENGINE
        </h1>

        <p className="subtitle">
          The ultimate racing experience awaits.
          <br />
          Compete, customize, and conquer the track.
        </p>

        <div className="buttons">
          <MenuButton
            label="START RACE"
            primary
            onClick={() => navigate("/garage")}
          />
          <MenuButton
            label="GAME MODES"
            onClick={() => navigate("/training")}
          />
          <MenuButton
            label="DRIVER PROFILE"
            onClick={() => alert("Driver profile coming soon!")}
          />
          <MenuButton
            label="SETTINGS"
            onClick={() => alert("Settings feature coming soon!")}
          />
          <button className="quit" onClick={() => alert("Game exited!")}>
            QUIT GAME
          </button>
        </div>

        <div className="footer-links">
          <a href="#patch">Patch Notes</a>
          <a href="#support">Support</a>
          <a href="#community">Community</a>
        </div>

        <div className="copyright">
          © 2025 F1 Metaverse Garage — Version 1.0.0
        </div>
      </main>
    </div>
  );
}
