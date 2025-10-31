import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/home";
import Garage from "./pages/Garage";
import Training from "./pages/Training";
import Circuits from "./pages/Circuits";
import RaceArena from "./pages/RaceArena";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />        
        <Route path="/garage" element={<Garage />} /> 
        <Route path="/training" element={<Training />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/circuits" element={<Circuits />} />
         <Route path="/arena" element={<RaceArena />} />
         <Route path="/race" element={<RaceArena />} />      
         </Routes>
    </Router>
  );
}
