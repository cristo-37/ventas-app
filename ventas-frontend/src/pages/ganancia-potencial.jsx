import React, { useEffect, useState } from "react";

export default function GananciaPotencial() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/inventario")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener inventario:", err));
  }, []);

  const totalGanancia = productos.reduce((sum, p) => {
    const gananciaPorUnidad = p.precio - p.costo;
    return sum + gananciaPorUnidad * p.stock;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Ganancia Potencial</h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 border">Producto</th>
                  <th className="px-4 py-2 border">Stock</th>
                  <th className="px-4 py-2 border">Costo (S/.)</th>
                  <th className="px-4 py-2 border">Precio (S/.)</th>
                  <th className="px-4 py-2 border">Ganancia por Unidad</th>
                  <th className="px-4 py-2 border">Ganancia Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, index) => {
                  const gananciaUnidad = p.precio - p.costo;
                  const gananciaTotal = gananciaUnidad * p.stock;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{p.nombre}</td>
                      <td className="px-4 py-2 border">{p.stock}</td>
                      <td className="px-4 py-2 border">S/ {p.costo.toFixed(2)}</td>
                      <td className="px-4 py-2 border">S/ {p.precio.toFixed(2)}</td>
                      <td className="px-4 py-2 border text-green-600 font-semibold">
                        S/ {gananciaUnidad.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border text-green-700 font-bold">
                        S/ {gananciaTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center text-xl font-bold text-green-700">
            Ganancia Potencial Total: S/ {totalGanancia.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
