# init_db.py
import sqlite3

DB_NAME = "database.db"

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# Crear tabla productos si no existe
cursor.execute("""
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    stock INTEGER NOT NULL,
    precio REAL NOT NULL
)
""")

# Puedes agregar datos de prueba aquí si quieres:
# cursor.execute("INSERT INTO productos (nombre, stock, precio) VALUES (?, ?, ?)", ("Ejemplo", 10, 9.99))

conn.commit()
conn.close()
print("Base de datos inicializada correctamente.")
