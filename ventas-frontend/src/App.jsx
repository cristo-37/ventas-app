import React from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center">
        <img
          src="/logo.png"
          alt="Logo del sistema"
          className="w-28 h-28 mx-auto mb-6 rounded-full border-4 border-sky-400 shadow-md"
        />
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">
          Sistema de Ventas e Inventario
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/ventas")}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Ventas
          </button>
          <button
            onClick={() => navigate("/inventario")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Inventario
          </button>
          <button
            onClick={() => navigate("/agregar-producto")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Agregar Producto
          </button>
          <button
            onClick={() => navigate("/ventas-dia")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Ventas del Día
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition col-span-1 sm:col-span-2"
          >
            Panel de Servicios Avanzados
          </button>
        </div>
      </div>
    </div>
  );
}
