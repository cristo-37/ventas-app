# routers/ventas.py
from fastapi import APIRouter, HTTPException
import sqlite3
import datetime

router = APIRouter()

DB_NAME = "database.db"

def obtener_numero_factura_actual():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(numero_factura) FROM ventas")
    resultado = cursor.fetchone()[0]
    conn.close()
    return resultado + 1 if resultado else 1

@router.get("/factura")
def get_numero_factura():
    try:
        numero = obtener_numero_factura_actual()
        return {"numero_factura": numero}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/nueva")
def registrar_venta(nombre: str, producto: str, cantidad: int, precio: float):
    total = cantidad * precio
    fecha = datetime.datetime.now().strftime("%Y-%m-%d")
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        numero_factura = obtener_numero_factura_actual()
        cursor.execute(
            "INSERT INTO ventas (numero_factura, nombre, producto, cantidad, precio, total, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (numero_factura, nombre, producto, cantidad, precio, total, fecha)
        )
        conn.commit()
        conn.close()
        return {"mensaje": "Venta registrada", "numero_factura": numero_factura}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
