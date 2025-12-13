from fastapi import FastAPI

app = FastAPI(
    title="Vendors API",
    description="Backend API for Vendors page assessment",
    version="1.0.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok"}
