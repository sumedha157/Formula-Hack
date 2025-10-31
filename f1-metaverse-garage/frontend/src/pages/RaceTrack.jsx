import React, { useEffect, useRef, useState } from "react";
import "./RaceTrack.css";
import { useNavigate } from "react-router-dom";

export default function RaceTrack() {
  const canvasRef = useRef(null);
  const [isRacing, setIsRacing] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [lap, setLap] = useState(1);
  const [gear, setGear] = useState(1);
  const [countdown, setCountdown] = useState(null); 
  const navigate = useNavigate();

  const player = useRef({ x: 250, y: 450, angle: 0 });
  const opponent = useRef({ x: 260, y: 470, angle: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const trackImg = new Image();
    trackImg.src = "/tracks/monza.png";
    const carImg = new Image();
    carImg.src = "/car-red.png";
    const aiCarImg = new Image();
    aiCarImg.src = "/car-blue.png";

    let useFallbackCar = false;
    let useFallbackAICar = false;
    let useFallbackTrack = false;
    let frameId;
    let imagesLoaded = 0;

    const onLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 3) startRace();
    };

    const onError = (imgName) => {
      console.warn(`⚠️ Failed to load ${imgName}, using fallback shape.`);
      if (imgName === "car-red") useFallbackCar = true;
      if (imgName === "car-blue") useFallbackAICar = true;
      if (imgName === "track") useFallbackTrack = true;
      imagesLoaded++;
      if (imagesLoaded === 3) startRace();
    };

    trackImg.onload = onLoad;
    carImg.onload = onLoad;
    aiCarImg.onload = onLoad;

    trackImg.onerror = () => onError("track");
    carImg.onerror = () => onError("car-red");
    aiCarImg.onerror = () => onError("car-blue");

    const startRace = () => {
      let progress = 0;
      let aiProgress = 0;

      const racePath = [
        { x: 250, y: 450 },
        { x: 300, y: 400 },
        { x: 450, y: 380 },
        { x: 600, y: 420 },
        { x: 700, y: 500 },
        { x: 600, y: 580 },
        { x: 400, y: 590 },
        { x: 280, y: 530 },
        { x: 250, y: 450 },
      ];

      const drawCar = (img, pos, angle, fallbackColor) => {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        if (fallbackColor) {
          ctx.fillStyle = fallbackColor;
          ctx.fillRect(-10, -20, 20, 40);
        } else {
          ctx.drawImage(img, -15, -25, 30, 50);
        }
        ctx.restore();
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (useFallbackTrack) {
          ctx.fillStyle = "#222";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#555";
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(450, 350, 200, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.drawImage(trackImg, 0, 0, canvas.width, canvas.height);
        }

        if (isRacing) {
          progress += speed / 300;
          aiProgress += speed / 320;
        }

        if (progress >= racePath.length - 1) {
          progress = 0;
          setLap((l) => l + 1);
        }
        if (aiProgress >= racePath.length - 1) aiProgress = 0;

        const idx = Math.floor(progress);
        const t = progress - idx;
        const nextIdx = (idx + 1) % racePath.length;
        const p1 = racePath[idx];
        const p2 = racePath[nextIdx];
        player.current.x = p1.x + (p2.x - p1.x) * t;
        player.current.y = p1.y + (p2.y - p1.y) * t;
        player.current.angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        const aiIdx = Math.floor(aiProgress);
        const aiT = aiProgress - aiIdx;
        const aiNextIdx = (aiIdx + 1) % racePath.length;
        const a1 = racePath[aiIdx];
        const a2 = racePath[aiNextIdx];
        opponent.current.x = a1.x + (a2.x - a1.x) * aiT;
        opponent.current.y = a1.y + (a2.y - a1.y) * aiT;
        opponent.current.angle = Math.atan2(a2.y - a1.y, a2.x - a1.x);

        drawCar(aiCarImg, opponent.current, opponent.current.angle, useFallbackAICar ? "#0077ff" : null);
        drawCar(carImg, player.current, player.current.angle, useFallbackCar ? "#ff3333" : null);

        frameId = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isRacing, speed]);

  // acceleration
  useEffect(() => {
    let interval;
    if (isRacing) {
      interval = setInterval(() => {
        setSpeed((s) => Math.min(s + 5, 320));
      }, 150);
    } else {
      clearInterval(interval);
      setSpeed(0);
    }
    return () => clearInterval(interval);
  }, [isRacing]);

  // gear logic
  useEffect(() => {
    if (speed < 40) setGear(1);
    else if (speed < 80) setGear(2);
    else if (speed < 130) setGear(3);
    else if (speed < 180) setGear(4);
    else if (speed < 230) setGear(5);
    else if (speed < 270) setGear(6);
    else if (speed < 310) setGear(7);
    else setGear(8);
  }, [speed]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(3);
    const timer = setInterval(() => {
      count -= 1;
      if (count === 0) {
        setCountdown("GO!");
        setTimeout(() => {
          setCountdown(null);
          setIsRacing(true);
        }, 800);
        clearInterval(timer);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  return (
    <div className="race-track-page">
      <canvas ref={canvasRef} width={900} height={600} className="race-canvas"></canvas>

      {/* 🏎️ HUD */}
      <div className="hud">
        <div>
          <p>LAP</p>
          <h2>{lap}</h2>
        </div>
        <div>
          <p>SPEED</p>
          <h2>{speed}</h2>
          <span>KPH</span>
        </div>
        <div>
          <p>GEAR</p>
          <h2>{gear}</h2>
        </div>
      </div>

      {countdown && (
        <div className={`countdown-overlay ${countdown === "GO!" ? "green" : ""}`}>
          <h1>{countdown}</h1>
        </div>
      )}

      
      <div className="controls">
        {!isRacing && !countdown && (
          <button className="start" onClick={startCountdown}>
            Start Race 🏁
          </button>
        )}
        {isRacing && (
          <button className="stop" onClick={() => setIsRacing(false)}>
            Stop ⛔
          </button>
        )}
        <button className="exit" onClick={() => navigate("/garage")}>
          Exit Game
        </button>
      </div>
    </div>
  );
}
