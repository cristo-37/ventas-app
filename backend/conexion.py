import sqlite3

def conectar_db():
    """Conectar a la base de datos SQLite."""
    return sqlite3.connect('database.db')

def crear_tablas(cursor):
    """Crear las tablas inventario y venta."""
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventario (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        proveedor TEXT NOT NULL,
        precio REAL NOT NULL,
        costo REAL NOT NULL,
        stock INTEGER NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS venta (
        id INTEGER PRIMARY KEY,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_total REAL NOT NULL,
        fecha TEXT NOT NULL,
        FOREIGN KEY (producto_id) REFERENCES inventario(id)
    )
    ''')

def insertar_producto(cursor, nombre, proveedor, precio, costo, stock):
    """Insertar un nuevo producto en el inventario."""
    cursor.execute('''
    INSERT INTO inventario (nombre, proveedor, precio, costo, stock) VALUES (?, ?, ?, ?, ?)
    ''', (nombre, proveedor, precio, costo, stock))

def insertar_venta(cursor, producto_id, cantidad, precio_total, fecha):
    """Insertar una nueva venta."""
    cursor.execute('''
    INSERT INTO venta (producto_id, cantidad, precio_total, fecha) VALUES (?, ?, ?, ?)
    ''', (producto_id, cantidad, precio_total, fecha))

def consultar_inventario(cursor):
    """Consultar todos los productos en el inventario."""
    cursor.execute('SELECT * FROM inventario')
    return cursor.fetchall()

def consultar_ventas(cursor):
    """Consultar todas las ventas."""
    cursor.execute('SELECT * FROM venta')
    return cursor.fetchall()

def main():
    # Conectar a la base de datos
    conexion = conectar_db()
    cursor = conexion.cursor()

    # Crear tablas
    crear_tablas(cursor)

    # Insertar datos de ejemplo
    insertar_producto(cursor, 'Producto A', 'Proveedor X', 10.99, 5.00, 100)
    insertar_producto(cursor, 'Producto B', 'Proveedor Y', 15.50, 7.00, 50)
    insertar_venta(cursor, 1, 2, 21.98, '2024-12-01')  # Venta del Producto A
    insertar_venta(cursor, 2, 1, 15.50, '2024-12-02')  # Venta del Producto B

    # Guardar cambios
    conexion.commit()

    # Consultar e imprimir el inventario
    print("Inventario:")
    for producto in consultar_inventario(cursor):
        print(producto)

    # Consultar e imprimir las ventas
    print("\nVentas:")
    for venta in consultar_ventas(cursor):
        print(venta)

    # Cerrar la conexión
    conexion.close()

if __name__ == '__main__':
    main()