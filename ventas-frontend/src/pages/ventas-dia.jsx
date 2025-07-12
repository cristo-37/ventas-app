import React, { useEffect, useState } from "react";

export default function ListaVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data));
  }, []);

  const totalGeneral = ventas.reduce((sum, v) => sum + v.subtotal, 0);
  const gananciaTotal = ventas.reduce((sum, v) => sum + (v.subtotal - v.costo * v.cantidad), 0);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Ventas del Día</h1>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Producto</th>
            <th className="p-3 text-left">Cantidad</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Ganancia</th>
            <th className="p-3 text-left">Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => {
            const ganancia = venta.subtotal - venta.costo * venta.cantidad;

            return (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{venta.nombre_cliente || "—"}</td>
                <td className="p-3">{venta.nombre_articulo}</td>
                <td className="p-3">{venta.cantidad}</td>
                <td className="p-3">S/ {venta.subtotal.toFixed(2)}</td>
                <td className="p-3 text-green-600 font-semibold">S/ {ganancia.toFixed(2)}</td>
                <td className="p-3 text-gray-600">
                  {new Date(venta.fecha_creacion).toLocaleString()}
                </td>
              </tr>
            );
          })}

          {/* Totales */}
          <tr className="bg-gray-200 font-bold">
            <td className="p-3" colSpan={3}>
              Totales del Día
            </td>
            <td className="p-3">S/ {totalGeneral.toFixed(2)}</td>
            <td className="p-3 text-green-600">S/ {gananciaTotal.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
