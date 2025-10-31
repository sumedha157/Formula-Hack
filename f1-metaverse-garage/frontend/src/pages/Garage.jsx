import React from "react";
import { useNavigate } from "react-router-dom";
import "./Garage.css";

import carImg from "../assets/car1.png";
import thumb1 from "../assets/car1.png";
import thumb2 from "../assets/car2.png";
import thumb3 from "../assets/car3.png";
import thumb4 from "../assets/car4.png";
import thumb5 from "../assets/car5.png";

import livery1 from "../assets/car6.png";
import livery2 from "../assets/car7.png";
import livery3 from "../assets/car9.png";
import livery4 from "../assets/car11.png";

export default function Garage() {
  const navigate = useNavigate();

  const cars = [
    { name: "F1-75", team: "Scuderia Ferrari", img: thumb1 },
    { name: "W13", team: "Mercedes-AMG", img: thumb2 },
    { name: "RB18", team: "Red Bull Racing", img: thumb3, selected: true },
    { name: "MCL36", team: "McLaren", img: thumb4 },
    { name: "A522", team: "Alpine F1 Team", img: thumb5 },
  ];

  const liveries = [livery1, livery2, livery3, livery4];

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo-ball" />
          <span>F1 METAVERSE GARAGE</span>
        </div>

        <nav className="nav">
          <a className="active">Garage</a>
          <a onClick={() => navigate("/circuits")}>Race Setup</a>
          <a onClick={() => navigate("/arena")}>Arena</a>
          <div className="credits">
            Credits: <strong>1,250,000</strong>
          </div>
          <div className="avatar" />
        </nav>
      </header>

      <main className="container">
        <section className="left-panel">
          <h2>RB18</h2>
          <p className="team">Oracle Red Bull Racing</p>
          <p className="desc">
            The pinnacle of aerodynamic efficiency and raw power, engineered for championship glory.
          </p>

          <div className="stats">
            <p className="stat-title">Performance Stats</p>
            <div className="chart-placeholder"></div>
            <div className="rating-row">
              <span>Overall Rating</span>
              <div className="bar">
                <div className="fill" style={{ width: "94%" }}></div>
              </div>
              <span className="score">94 / 100</span>
            </div>
          </div>
        </section>

        <section className="center-panel">
          <div className="car-image">
            <img src={carImg} alt="RB18" />
            <p className="hint">↔ Click and drag to rotate</p>
          </div>
        </section>

        <section className="right-panel">
          <h3>Customization</h3>
          <div className="tabs">
            <button className="tab active">Liveries</button>
            <button className="tab">Upgrades</button>
            <button className="tab">Components</button>
          </div>

          <div className="livery-grid">
            {liveries.map((src, i) => (
              <div key={i} className={`livery ${i === 0 ? "selected" : ""}`}>
                <img src={src} alt={`livery${i}`} />
              </div>
            ))}
            <div className="livery add">+</div>
          </div>

          <button className="confirm-btn" onClick={() => navigate("/circuits")}>
            Confirm Selection
          </button>
        </section>
      </main>

      <footer className="bottom-row">
        {cars.map((car, i) => (
          <div
            key={i}
            className={`car-thumb ${car.selected ? "selected" : ""}`}
          >
            <img src={car.img} alt={car.name} />
            <p>{car.name}</p>
            <span>{car.team}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
