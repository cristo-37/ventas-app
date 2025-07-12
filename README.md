# 🛒 Ventas App

Aplicación web para la gestión de inventario y ventas, desarrollada con **FastAPI** (backend) y **React** (frontend). Usa **SQLite** como base de datos local.

---

## 📂 Estructura del Proyecto

ventas-app/
├── backend/ # API con FastAPI
│ ├── main.py
│ ├── api_servicio.py
│ └── database.db # Base de datos
├── frontend/ # Interfaz en React
│ └── src/pages/
└── README.md

yaml
Copiar
Editar

---

## 🚀 Funcionalidades

- Registrar productos al inventario 🆕
- Actualizar y eliminar productos 📝❌
- Registrar ventas por cliente 💰
- Ver ventas por fecha 📅
- Ver detalle de ventas por cliente 🧾
- Ver productos agotados 🚨
- Dashboard con resumen de:
  - Total productos
  - Total ventas
  - Recaudado
  - Ganancia 📊
- Gráfico dinámico semanal 📈

---

## ⚙️ Tecnologías

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** FastAPI
- **Base de datos:** SQLite
- **Gráficos:** Recharts

---

## 🧪 Cómo ejecutar el proyecto localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/Cristo-37/ventas-app.git
cd ventas-app
2. Inicia el backend
bash
Copiar
Editar
cd backend
python -m venv venv
venv\Scripts\activate      # En Windows
pip install fastapi uvicorn
uvicorn main:app --reload
📍 API corriendo en: http://localhost:8000
📍 Docs Swagger: http://localhost:8000/docs

3. Inicia el frontend
bash
Copiar
Editar
cd ../frontend
npm install
npm run dev
🌐 App disponible en: http://localhost:5173

🛠 Requisitos
Python 3.10+

Node.js y npm

Navegador web moderno

🧠 Notas
La base de datos database.db está en la carpeta backend/

Los datos se guardan de forma persistente

El gráfico del dashboard se actualiza dinámicamente con cada venta nueva
