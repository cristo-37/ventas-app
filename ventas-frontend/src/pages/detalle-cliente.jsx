import React, { useEffect, useState } from "react";

export default function DetalleCliente() {
  const [cliente, setCliente] = useState("");
  const [ventas, setVentas] = useState([]);

  const obtenerVentas = () => {
    if (!cliente) return;

    fetch(`http://localhost:8000/ventas/detalle/${cliente}`)
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((err) => console.error("Error:", err));
  };

  const total = ventas.reduce((sum, v) => sum + v.subtotal, 0);
  const ganancia = ventas.reduce(
    (sum, v) => sum + (v.precio - v.costo) * v.cantidad,
    0
  );

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Ventas por Cliente</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del cliente"
          className="p-2 border rounded w-64"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
        <button
          onClick={obtenerVentas}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {ventas.length > 0 ? (
        <>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Cantidad</th>
                <th className="p-3 text-left">Subtotal</th>
                <th className="p-3 text-left">Ganancia</th>
                <th className="p-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v, i) => {
                const gananciaItem = (v.precio - v.costo) * v.cantidad;
                return (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{v.producto}</td>
                    <td className="p-3">{v.cantidad}</td>
                    <td className="p-3">S/ {v.subtotal.toFixed(2)}</td>
                    <td className="p-3 text-green-600">
                      S/ {gananciaItem.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(v.fecha).toLocaleString("es-PE", {
                        hour12: false,
                        timeZone: "America/Lima",
                      })}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-200 font-semibold">
                <td colSpan={2} className="p-3 text-right">
                  Totales:
                </td>
                <td className="p-3">S/ {total.toFixed(2)}</td>
                <td className="p-3 text-green-700">S/ {ganancia.toFixed(2)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-gray-600">No hay ventas para este cliente.</p>
      )}
    </div>
  );
}
