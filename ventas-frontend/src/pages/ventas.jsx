import React, { useEffect, useState } from "react";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const cargarProductos = () => {
    fetch("http://localhost:8000/inventario")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleProductoChange = (e) => {
    const nombre = e.target.value;
    const producto = productos.find((p) => p.nombre === nombre);
    setProductoSeleccionado(producto);
    setCantidad(1);
    setMensaje("");
  };

  const calcularSubtotal = () => {
    if (productoSeleccionado && cantidad > 0) {
      return (productoSeleccionado.precio * cantidad).toFixed(2);
    }
    return "0.00";
  };

  const registrarVenta = async () => {
    if (!productoSeleccionado || !nombreCliente || cantidad <= 0) {
      setMensaje("❗ Completa todos los campos correctamente.");
      return;
    }

    if (productoSeleccionado.stock < cantidad) {
      setMensaje("❌ No hay stock suficiente.");
      return;
    }

    const venta = {
      nombre_cliente: nombreCliente,
      nombre_producto: productoSeleccionado.nombre,
      cantidad: parseInt(cantidad)
    };

    const res = await fetch("http://localhost:8000/venta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venta)
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("✅ Venta registrada con éxito");
      setCantidad(1);
      setNombreCliente("");

      // Recargar productos para actualizar stock
      await cargarProductos();

      // Actualizar producto seleccionado con nuevo stock
      const productoActualizado = productos.find(
        (p) => p.nombre === productoSeleccionado.nombre
      );
      setProductoSeleccionado(productoActualizado);
    } else {
      setMensaje(`❌ Error: ${data.detail}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Registrar Venta</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Cliente</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          placeholder="Nombre del cliente"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Producto</label>
        <select
          className="w-full border p-2 rounded"
          onChange={handleProductoChange}
          value={productoSeleccionado ? productoSeleccionado.nombre : ""}
        >
          <option value="">-- Selecciona un producto --</option>
          {productos.map((p, i) => (
            <option
              key={i}
              value={p.nombre}
              disabled={p.stock === 0}
              className={p.stock === 0 ? "line-through text-red-400" : ""}
            >
              {p.stock === 0
                ? `❌ ${p.nombre} (Agotado)`
                : `${p.nombre} - Stock: ${p.stock}`}
            </option>
          ))}
        </select>
      </div>

      {productoSeleccionado && (
        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <p>
            💰 Precio unitario:{" "}
            <strong>S/ {productoSeleccionado.precio.toFixed(2)}</strong>
          </p>
          <p>
            📦 Stock disponible:{" "}
            <strong>{productoSeleccionado.stock}</strong>
          </p>
          <p>
            🧮 Subtotal estimado:{" "}
            <strong>S/ {calcularSubtotal()}</strong>
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Cantidad</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          min="1"
          max={productoSeleccionado?.stock || 1}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          disabled={!productoSeleccionado}
        />
      </div>

      <button
        onClick={registrarVenta}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded w-full"
      >
        Registrar Venta
      </button>

      {mensaje && (
        <div className="mt-4 text-center font-semibold text-blue-700">
          {mensaje}
        </div>
      )}
    </div>
  );
}
