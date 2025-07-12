import React, { useEffect, useState } from "react";

export default function ProductosAgotados() {
  const [agotados, setAgotados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/inventario")
      .then((res) => res.json())
      .then((data) => {
        const productosSinStock = data.filter((p) => p.stock === 0);
        setAgotados(productosSinStock);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Productos Agotados</h1>

      {agotados.length === 0 ? (
        <p className="text-center text-green-600 font-semibold">
          ¡No hay productos agotados!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead className="bg-red-100">
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Proveedor</th>
                <th className="px-4 py-2 border">Precio</th>
                <th className="px-4 py-2 border">Costo</th>
              </tr>
            </thead>
            <tbody>
              {agotados.map((producto, index) => (
                <tr key={index} className="hover:bg-red-50">
                  <td className="px-4 py-2 border">{producto.nombre}</td>
                  <td className="px-4 py-2 border">{producto.proveedor}</td>
                  <td className="px-4 py-2 border">S/ {producto.precio.toFixed(2)}</td>
                  <td className="px-4 py-2 border">S/ {producto.costo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
