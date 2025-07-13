from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.productos import router as productos_router

app = FastAPI()

origins = ["*"]  # en producción puedes restringirlo

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos_router)
