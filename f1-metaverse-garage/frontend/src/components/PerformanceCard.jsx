import React from "react";

export default function PerformanceCard({ title, value, color }) {
  return (
    <div className="p-4 bg-gray-900/70 rounded-xl shadow-inner border border-gray-700 hover:shadow-red-500/20 transition">
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
