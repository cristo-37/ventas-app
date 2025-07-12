from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
import os

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

class Venta(BaseModel):
    nombre_cliente: str
    nombre_producto: str
    cantidad: int

class Producto(BaseModel):
    nombre: str
    stock: int
    precio: float
    proveedor: str
    costo: float

class ProductoUpdate(BaseModel):
    nombre: str
    proveedor: str
    stock: int
    costo: float
    precio: float

def get_connection():
    return sqlite3.connect(DB_PATH)

@router.post("/venta")
def registrar_venta(venta: Venta):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT stock, precio FROM inventario WHERE nombre=?", (venta.nombre_producto,))
        resultado = cursor.fetchone()
        if not resultado:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        stock, precio = resultado
        if venta.cantidad > stock:
            raise HTTPException(status_code=400, detail="Stock insuficiente")

        subtotal = precio * venta.cantidad
        fecha_actual = (datetime.utcnow() - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute("""
            INSERT INTO ventas (nombre_cliente, nombre_articulo, cantidad, subtotal, fecha_creacion)
            VALUES (?, ?, ?, ?, ?)
        """, (venta.nombre_cliente, venta.nombre_producto, venta.cantidad, subtotal, fecha_actual))

        cursor.execute("UPDATE inventario SET stock = stock - ? WHERE nombre = ?",
                       (venta.cantidad, venta.nombre_producto))
        conn.commit()
        conn.close()
        return {
            "mensaje": "Venta registrada con éxito",
            "producto": venta.nombre_producto,
            "cantidad": venta.cantidad,
            "stock_restante": stock - venta.cantidad,
            "subtotal": subtotal
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/inventario")
def listar_inventario():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, proveedor, stock, costo, precio FROM inventario")
        productos = cursor.fetchall()
        conn.close()
        return [
            {
                "nombre": p[0],
                "proveedor": p[1],
                "stock": p[2],
                "costo": p[3],
                "precio": p[4]
            }
            for p in productos
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ventas")
def listar_ventas():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT v.nombre_cliente, v.nombre_articulo, v.cantidad, v.subtotal, i.costo, v.fecha_creacion
            FROM ventas v
            JOIN inventario i ON v.nombre_articulo = i.nombre
        """)
        ventas = cursor.fetchall()
        conn.close()
        return [
            {
                "nombre_cliente": v[0],
                "nombre_articulo": v[1],
                "cantidad": v[2],
                "subtotal": v[3],
                "costo": v[4],
                "fecha_creacion": v[5]
            }
            for v in ventas
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producto/{nombre}")
def obtener_producto(nombre: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, stock, precio FROM inventario WHERE nombre=?", (nombre,))
        producto = cursor.fetchone()
        conn.close()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"nombre": producto[0], "stock": producto[1], "precio": producto[2]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/producto")
def agregar_producto(producto: Producto):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO inventario (nombre, stock, precio, proveedor, costo) VALUES (?, ?, ?, ?, ?)",
                       (producto.nombre, producto.stock, producto.precio, producto.proveedor, producto.costo))
        conn.commit()
        conn.close()
        return {"mensaje": "Producto agregado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/producto/{nombre}")
def actualizar_producto(nombre: str, producto: ProductoUpdate):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE inventario SET nombre=?, proveedor=?, stock=?, costo=?, precio=? WHERE nombre=?",
                       (producto.nombre, producto.proveedor, producto.stock, producto.costo, producto.precio, nombre))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        conn.commit()
        conn.close()
        return {"mensaje": "Producto actualizado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/producto/{nombre}")
def eliminar_producto(nombre: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM inventario WHERE nombre=?", (nombre,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        conn.commit()
        conn.close()
        return {"mensaje": "Producto eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producto/agotados")
def productos_agotados():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, proveedor, stock FROM inventario WHERE stock = 0")
        data = cursor.fetchall()
        conn.close()
        return [{"nombre": d[0], "proveedor": d[1], "stock": d[2]} for d in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ventas/semanal")
def ventas_semanal():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Fecha hace 6 días (incluye hoy)
        hace_6_dias = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")

        cursor.execute("""
            SELECT DATE(fecha_creacion) AS fecha, SUM(subtotal) AS total
            FROM ventas
            WHERE DATE(fecha_creacion) >= ?
            GROUP BY DATE(fecha_creacion)
            ORDER BY fecha
        """, (hace_6_dias,))
        resultados = cursor.fetchall()
        conn.close()

        return [{"nombre": r[0], "total": round(r[1], 2)} for r in resultados]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/resumen")
def resumen_dashboard():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM inventario")
        total_productos = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM ventas")
        total_ventas = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(subtotal) FROM ventas")
        total_recaudado = cursor.fetchone()[0] or 0

        cursor.execute("""
            SELECT SUM((i.precio - i.costo) * v.cantidad)
            FROM ventas v
            JOIN inventario i ON v.nombre_articulo = i.nombre
        """)
        total_ganancia = cursor.fetchone()[0] or 0

        conn.close()
        return {
            "total_productos": total_productos,
            "total_ventas": total_ventas,
            "total_recaudado": round(total_recaudado, 2),
            "total_ganancia": round(total_ganancia, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ventas/por-dia")
def ventas_por_dia(fecha: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT nombre_articulo, cantidad, subtotal, nombre_cliente, fecha_creacion
            FROM ventas
            WHERE DATE(fecha_creacion) = ?
        """, (fecha,))
        data = cursor.fetchall()
        conn.close()
        return [
            {
                "producto": d[0],
                "cantidad": d[1],
                "subtotal": d[2],
                "cliente": d[3],
                "fecha": d[4]
            }
            for d in data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ventas/detalle/{cliente}")
def ventas_por_cliente(cliente: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT v.nombre_articulo, v.cantidad, v.subtotal, i.costo, i.precio, v.fecha_creacion
            FROM ventas v
            JOIN inventario i ON v.nombre_articulo = i.nombre
            WHERE v.nombre_cliente = ?
        """, (cliente,))
        data = cursor.fetchall()
        conn.close()
        return [
            {
                "producto": d[0],
                "cantidad": d[1],
                "subtotal": d[2],
                "costo": d[3],
                "precio": d[4],
                "fecha": d[5]
            }
            for d in data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producto/{nombre}/ganancia-potencial")
def ganancia_potencial(nombre: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT stock, precio, costo FROM inventario WHERE nombre=?", (nombre,))
        data = cursor.fetchone()
        if not data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        stock, precio, costo = data
        ganancia_total = (precio - costo) * stock
        conn.close()
        return {"producto": nombre, "stock": stock, "ganancia_potencial": round(ganancia_total, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
