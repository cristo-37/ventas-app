import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Ventas from "./pages/ventas";
import Inventario from "./pages/inventario";
import AgregarProducto from "./pages/agregar-producto";
import ListaVentas from "./pages/ventas-dia";
import ProductosAgotados from "./pages/productos-agotados";
import DashboardResumen from "./pages/dashboard-resumen";
import VentasPorFecha from "./pages/ventas-por-fecha";
import DetalleCliente from "./pages/detalle-cliente";
import GananciaPotencial from "./pages/ganancia-potencial";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ventas" element={<Ventas />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/agregar-producto" element={<AgregarProducto />} />
      <Route path="/ventas-dia" element={<ListaVentas />} />
      <Route path="/productos-agotados" element={<ProductosAgotados />} />
      <Route path="/dashboard" element={<DashboardResumen />} />
      <Route path="/ventas-por-dia" element={<VentasPorFecha />} />
      <Route path="/ventas-cliente" element={<DetalleCliente />} />
      <Route path="/ganancia-potencial" element={<GananciaPotencial />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
              <p className="text-gray-600 text-lg">Ruta no encontrada</p>
            </div>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>
);
