import React, { useEffect, useRef, useState } from "react";
import "./RaceArena.css";
import { useNavigate } from "react-router-dom";

export default function RaceArena() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [position, setPosition] = useState("1st");
  const [lap, setLap] = useState(1);
  const [totalLaps, setTotalLaps] = useState(3);
  const [speed, setSpeed] = useState(125);
  const [rpm, setRpm] = useState(8500);
  const [bestLap, setBestLap] = useState("01:23.456");
  const [currentLapTime, setCurrentLapTime] = useState("00:00.000");
  const [showFinalLap, setShowFinalLap] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const trackImg = new Image();
    trackImg.src = "/tracks/monza.png"; // your background track
    const carImg = new Image();
    carImg.src = "/car-red.png"; // your car sprite

    let progress = 0;
    let frame;
    const car = { x: 0, y: 0, angle: 0 };

    // Simulated Monza-like path
    const racePath = [
      { x: 200, y: 500 },
      { x: 400, y: 480 },
      { x: 600, y: 400 },
      { x: 800, y: 350 },
      { x: 1000, y: 370 },
      { x: 1150, y: 500 },
      { x: 1100, y: 600 },
      { x: 800, y: 650 },
      { x: 600, y: 700 },
      { x: 400, y: 650 },
      { x: 200, y: 550 },
      { x: 200, y: 500 },
    ];

    // CAMERA CONFIG
    let cameraX = 0;
    let cameraY = 0;

    // Draw car
    const drawCar = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.drawImage(carImg, -15, -25, 30, 50);
      ctx.restore();
    };

    // Draw entire scene
    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw track (static)
      ctx.drawImage(trackImg, -cameraX, -cameraY, 1300, 700);

      // Draw car relative to camera
      drawCar(car.x - cameraX, car.y - cameraY, car.angle);
    };

    // Animation
    const animate = () => {
      progress += 0.004;
      if (progress >= racePath.length - 1) {
        progress = 0;
        setLap((l) => (l < totalLaps ? l + 1 : 1));
      }

      const idx = Math.floor(progress);
      const t = progress - idx;
      const p1 = racePath[idx];
      const p2 = racePath[(idx + 1) % racePath.length];
      car.x = p1.x + (p2.x - p1.x) * t;
      car.y = p1.y + (p2.y - p1.y) * t;
      car.angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      // CAMERA: gently follow the car position (no rotation)
      cameraX += ((car.x - canvas.width / 2) - cameraX) * 0.05;
      cameraY += ((car.y - canvas.height / 2) - cameraY) * 0.05;

      drawScene();
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [totalLaps]);

  // Speed + RPM simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed((s) => (s >= 220 ? 125 : s + Math.random() * 5));
      setRpm((r) => (r >= 11500 ? 8500 : r + Math.random() * 150));
      setCurrentLapTime(
        `0${Math.floor(Math.random() * 2)}:${(20 + Math.random() * 40).toFixed(
          3
        )}`
      );
    }, 300);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lap === totalLaps) {
      setShowFinalLap(true);
      setTimeout(() => setShowFinalLap(false), 3000);
    }
  }, [lap, totalLaps]);

  return (
    <div className="race-arena">
      <canvas ref={canvasRef} width={1300} height={700} className="race-canvas" />

      {showFinalLap && <div className="final-lap">Final Lap!</div>}

      <div className="mini-map">
        <img
          src="https://i.imgur.com/NMZT2AV.png"
          alt="Map"
          className="map-image"
        />
      </div>

      <div className="hud-bottom">
        <div className="hud-left">
          <div className="info-box">
            <p>Position</p>
            <h3>{position}/8</h3>
          </div>
          <div className="info-box">
            <p>Lap</p>
            <h3>
              {lap}/{totalLaps}
            </h3>
          </div>
          <div className="info-box">
            <p>Best Lap</p>
            <h3>{bestLap}</h3>
          </div>
        </div>

        <div className="hud-right">
          <div className="rpm-box">
            <div className="rpm-top">
              <p>RPM</p>
              <h2>{speed.toFixed(0)}</h2>
              <span>MPH</span>
            </div>
            <div className="rpm-bar">
              <div
                className="rpm-fill"
                style={{ width: `${(rpm / 12000) * 100}%` }}
              ></div>
            </div>
            <p className="current-lap">Current Lap: {currentLapTime}</p>
          </div>
        </div>
      </div>

      <button className="exit-btn" onClick={() => navigate("/garage")}>
        ⬅ Exit Race
      </button>
    </div>
  );
}
