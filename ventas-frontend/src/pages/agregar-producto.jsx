import React, { useState } from "react";

export default function AgregarProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    stock: "",
    precio: "",
    proveedor: "",
    costo: "",
  });

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !producto.nombre ||
      !producto.stock ||
      !producto.precio ||
      !producto.proveedor ||
      !producto.costo
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    fetch("http://localhost:8000/producto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: producto.nombre,
        stock: parseInt(producto.stock),
        precio: parseFloat(producto.precio),
        proveedor: producto.proveedor,
        costo: parseFloat(producto.costo),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.mensaje || "Producto agregado.");
        setProducto({
          nombre: "",
          stock: "",
          precio: "",
          proveedor: "",
          costo: "",
        });
      })
      .catch((err) => alert("Error al agregar producto: " + err));
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-6 text-center">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={producto.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio (S/.)"
          value={producto.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="proveedor"
          placeholder="Proveedor"
          value={producto.proveedor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="costo"
          placeholder="Costo (S/.)"
          value={producto.costo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Agregar Producto
        </button>
      </form>
    </div>
  );
}
