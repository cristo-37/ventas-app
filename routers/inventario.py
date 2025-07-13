from fastapi import APIRouter, HTTPException
import sqlite3

router = APIRouter()
DB_NAME = "database.db"

@router.get("/inventario")
def obtener_inventario():
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT nombre, stock, precio FROM productos")
        filas = cursor.fetchall()
        conn.close()
        productos = [{"nombre": f[0], "stock": f[1], "precio": f[2]} for f in filas]
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
