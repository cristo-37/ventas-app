import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [datosEditados, setDatosEditados] = useState({});

  const fetchInventario = () => {
    fetch("http://localhost:8000/inventario")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener inventario:", err));
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const exportarExcel = () => {
    const data = productosFiltrados.map((p) => ({
      Producto: p.nombre,
      Proveedor: p.proveedor,
      Stock: p.stock,
      Costo: p.costo,
      Precio: p.precio,
      Ganancia: (p.precio - p.costo).toFixed(2),
    }));

    const hoja = XLSX.utils.json_to_sheet(data);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Inventario");

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "inventario.xlsx");
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const iniciarEdicion = (producto) => {
    setEditando(producto.nombre);
    setDatosEditados({ ...producto });
  };

  const guardarCambios = async (nombreOriginal) => {
    const body = {
      nombre: datosEditados.nombre,
      proveedor: datosEditados.proveedor,
      stock: parseInt(datosEditados.stock),
      costo: parseFloat(datosEditados.costo),
      precio: parseFloat(datosEditados.precio),
    };

    try {
      const res = await fetch(`http://localhost:8000/producto/${nombreOriginal}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditando(null);
        fetchInventario(); // Recargar la tabla
      } else {
        const error = await res.json();
        alert("Error al guardar: " + error.detail);
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const eliminarProducto = async (nombre) => {
    if (!window.confirm(`¿Deseas eliminar el producto "${nombre}"?`)) return;
    try {
      const res = await fetch(`http://localhost:8000/producto/${nombre}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchInventario(); // Recargar lista después de eliminar
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleChange = (campo, valor) => {
    setDatosEditados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventario General</h1>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={exportarExcel}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 bg-white rounded shadow">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">Proveedor</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Costo (S/.)</th>
              <th className="px-4 py-2 border">Precio (S/.)</th>
              <th className="px-4 py-2 border">Ganancia (S/.)</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {editando === p.nombre ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-32"
                      value={datosEditados.nombre}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                    />
                  ) : (
                    p.nombre
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editando === p.nombre ? (
                    <input
                      type="text"
                      className="border p-1 rounded w-32"
                      value={datosEditados.proveedor}
                      onChange={(e) => handleChange("proveedor", e.target.value)}
                    />
                  ) : (
                    p.proveedor
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editando === p.nombre ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-20"
                      value={datosEditados.stock}
                      onChange={(e) => handleChange("stock", e.target.value)}
                    />
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editando === p.nombre ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-24"
                      step="0.01"
                      value={datosEditados.costo}
                      onChange={(e) => handleChange("costo", e.target.value)}
                    />
                  ) : (
                    `S/ ${p.costo.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editando === p.nombre ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-24"
                      step="0.01"
                      value={datosEditados.precio}
                      onChange={(e) => handleChange("precio", e.target.value)}
                    />
                  ) : (
                    `S/ ${p.precio.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2 border text-green-700 font-semibold">
                  S/ {(p.precio - p.costo).toFixed(2)}
                </td>
                <td className="px-4 py-2 border flex flex-col sm:flex-row gap-2">
                  {editando === p.nombre ? (
                    <button
                      onClick={() => guardarCambios(p.nombre)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => iniciarEdicion(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarProducto(p.nombre)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosFiltrados.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No se encontraron productos
          </p>
        )}
      </div>
    </div>
  );
}
