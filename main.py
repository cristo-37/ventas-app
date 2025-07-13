from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.ventas import router as ventas_router
from routers.inventario import router as inventario_router



app = FastAPI()

origins = ["*"]  # en producción puedes restringirlo

@app.get("/")
def root():
    return {"mensaje": "API funcionando correctamente"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ventas_router)
app.include_router(inventario_router)

