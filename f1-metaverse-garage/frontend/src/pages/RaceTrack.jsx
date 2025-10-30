import React, { useEffect, useRef, useState } from "react";
import "./RaceTrack.css";
import { useNavigate } from "react-router-dom";

export default function RaceTrack() {
  const canvasRef = useRef(null);
  const [isRacing, setIsRacing] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);
  const [lap, setLap] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [player, setPlayer] = useState({ x: 200, y: 300, angle: 0 });
  const [opponent, setOpponent] = useState({ x: 180, y: 330, angle: 0 });
  const navigate = useNavigate();


  useEffect(() => {
  let interval;
  if (isRacing) {
    interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/ai/drive");
        const data = await res.json();
        setPlayer((p) => ({
          ...p,
          angle: p.angle + data.steering,
        }));
        setSpeed((s) => Math.min(s + data.throttle * 5, 320));
      } catch (err) {
        console.error("AI driving error:", err);
      }
    }, 150);
  }
  return () => clearInterval(interval);
}, [isRacing]);



  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") setSpeed((s) => Math.min(s + 10, 320));
    if (e.key === "ArrowDown") setSpeed((s) => Math.max(s - 10, 0));
    if (e.key === "ArrowLeft") setPlayer((p) => ({ ...p, angle: p.angle - 0.1 }));
    if (e.key === "ArrowRight") setPlayer((p) => ({ ...p, angle: p.angle + 0.1 }));
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

  
  // Race track animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const trackColor = "#222";
    const trackBorder = "#444";
    const carColor = "red";
    const opponentColor = "blue";

    

    const drawTrack = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simple oval track
      ctx.beginPath();
      ctx.lineWidth = 20;
      ctx.strokeStyle = trackBorder;
      ctx.arc(450, 300, 200, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = trackColor;
      ctx.arc(450, 300, 180, 0, 2 * Math.PI);
      ctx.stroke();
    };

    const drawCar = (x, y, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.fillRect(-8, -16, 16, 32);
      ctx.restore();
    };

    let angle = 0;
    let opponentAngle = 180;
    let animationFrame;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrack();

      // Update car positions if racing
      if (isRacing) {
        angle += speed / 1000;
        opponentAngle += (speed / 950) * 0.9;

        if (angle > Math.PI * 2) {
          angle = 0;
          setLap((prev) => prev + 1);
        }

        setPlayer({
          x: 450 + Math.cos(angle) * 180,
          y: 300 + Math.sin(angle) * 180,
          angle,
        });
        setOpponent({
          x: 450 + Math.cos(opponentAngle) * 180,
          y: 300 + Math.sin(opponentAngle) * 180,
          angle: opponentAngle,
        });
      }

      drawCar(player.x, player.y, carColor);
      drawCar(opponent.x, opponent.y, opponentColor);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isRacing, speed]);

  // Speed & Gear Logic
  useEffect(() => {
    let speedInterval;
    if (isRacing) {
      speedInterval = setInterval(() => {
        setSpeed((prev) => (prev < 320 ? prev + 8 : prev));
      }, 150);
    } else {
      clearInterval(speedInterval);
    }
    return () => clearInterval(speedInterval);
  }, [isRacing]);

  // Gear auto-update based on speed
  useEffect(() => {
    if (speed < 20) setGear(1);
    else if (speed < 60) setGear(2);
    else if (speed < 100) setGear(3);
    else if (speed < 160) setGear(4);
    else if (speed < 220) setGear(5);
    else if (speed < 280) setGear(6);
    else if (speed < 320) setGear(7);
    else setGear(8);
  }, [speed]);

  // Countdown before race start
  const handleStart = () => {
    let count = 3;
    setCountdown(3);
    const timer = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        setIsRacing(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  return (
    <div className="race-track-page">
      <canvas ref={canvasRef} width={900} height={600} className="race-canvas" />

      {/* HUD */}
      <div className="hud">
        <div>
          <p>SPEED</p>
          <h1>{speed}</h1>
          <p>KPH</p>
        </div>
        <div>
          <p>GEAR</p>
          <h1>{gear}</h1>
        </div>
        <div>
          <p>LAP</p>
          <h1>{lap}</h1>
        </div>
      </div>

      {/* Countdown Overlay */}
      {countdown && (
        <div className="countdown">
          <h1>{countdown}</h1>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        {!isRacing ? (
          <button className="start" onClick={handleStart}>
            Start Race 🏁
          </button>
        ) : (
          <button className="stop" onClick={() => setIsRacing(false)}>
            Stop ⛔
          </button>
        )}
        <button className="exit" onClick={() => navigate("/garage")}>
          Exit Garage
        </button>
      </div>
    </div>
  );
}
