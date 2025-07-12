import React, { useEffect, useState } from "react";

export default function VentasPorFecha() {
  const [fecha, setFecha] = useState("");       // Fecha en input
  const [ventas, setVentas] = useState([]);     // Lista de ventas
  const [error, setError] = useState(null);     // Mensaje de error

  const buscarVentas = (fechaSeleccionada) => {
    const fechaFormateada = new Date(fechaSeleccionada).toISOString().split("T")[0];

    fetch(`http://localhost:8000/ventas/por-dia?fecha=${fechaFormateada}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener ventas");
        return res.json();
      })
      .then((data) => {
        // Filtramos ventas que tengan campos esenciales no nulos
        const filtradas = data.filter(
          (v) => v.producto && v.cantidad && v.subtotal
        );
        setVentas(filtradas);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al buscar ventas:", err);
        setError("Error al obtener las ventas.");
        setVentas([]);
      });
  };

  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${yyyy}-${mm}-${dd}`;
    setFecha(fechaHoy);
    buscarVentas(fechaHoy);
  }, []);

  const total = ventas.reduce(
    (sum, v) => sum + (parseFloat(v.subtotal) || 0),
    0
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Ventas por Fecha</h1>

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => buscarVentas(fecha)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {ventas.length > 0 ? (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{v.cliente || "Sin nombre"}</td>
                <td className="p-3">{v.producto}</td>
                <td className="p-3">{v.cantidad}</td>
                <td className="p-3">S/ {parseFloat(v.subtotal).toFixed(2)}</td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(v.fecha).toLocaleString("es-PE", {
                    hour12: false,
                    timeZone: "America/Lima",
                  })}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-semibold">
              <td colSpan={3} className="p-3 text-right">
                Total:
              </td>
              <td className="p-3">S/ {total.toFixed(2)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      ) : fecha && !error ? (
        <p className="text-gray-600">No hay ventas registradas para esta fecha.</p>
      ) : null}
    </div>
  );
}
