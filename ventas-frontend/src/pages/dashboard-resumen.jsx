import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardResumen() {
  const navigate = useNavigate();
  const [graficoData, setGraficoData] = useState([]);

  // Función para obtener datos desde el backend
  const cargarDatos = () => {
    fetch("http://localhost:8000/ventas/semanal")
      .then((res) => res.json())
      .then((data) => setGraficoData(data))
      .catch((err) => console.error("Error al cargar ventas semanales:", err));
  };

  useEffect(() => {
    // Cargar una vez al inicio
    cargarDatos();

    // Cargar cada 15 segundos
    const intervalo = setInterval(() => {
      cargarDatos();
    }, 15000); // 15000 milisegundos = 15 segundos

    // Limpiar intervalo al desmontar componente
    return () => clearInterval(intervalo);
  }, []);

  const cuadros = [
    {
      titulo: "Ventas por Día",
      descripcion: "Visualiza ventas por día y mes",
      ruta: "/ventas-por-dia",
      color: "bg-blue-100",
    },
    {
      titulo: "Ventas por Cliente",
      descripcion: "Detalle de ventas realizadas por cliente",
      ruta: "/ventas-cliente",
      color: "bg-yellow-100",
    },
    {
      titulo: "Ganancia Potencial",
      descripcion: "Proyección de ganancia por producto",
      ruta: "/ganancia-potencial",
      color: "bg-green-100",
    },
    {
      titulo: "Productos Agotados",
      descripcion: "Lista de productos sin stock",
      ruta: "/productos-agotados",
      color: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Panel de Servicios Avanzados</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {cuadros.map((cuadro, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl shadow cursor-pointer transition hover:shadow-lg ${cuadro.color}`}
            onClick={() => navigate(cuadro.ruta)}
          >
            <h2 className="text-xl font-bold mb-2">{cuadro.titulo}</h2>
            <p className="text-gray-700">{cuadro.descripcion}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Resumen Semanal de Ventas (actualizado en tiempo real)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graficoData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
