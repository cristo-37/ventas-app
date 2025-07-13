import React, { useEffect, useState } from "react";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/inventario`)


      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar el inventario:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Inventario de Productos
      </h2>

      {cargando ? (
        <p className="text-center text-gray-600">Cargando inventario...</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos en inventario.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Precio (S/)</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="py-2 px-4">{producto.nombre}</td>
                  <td className="py-2 px-4">{producto.stock}</td>
                  <td className="py-2 px-4">{producto.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
