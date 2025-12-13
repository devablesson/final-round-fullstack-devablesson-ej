from fastapi import FastAPI
from .database import engine
from .models import Base

app = FastAPI(
    title="Vendors API",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}
