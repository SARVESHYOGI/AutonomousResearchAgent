from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import research_routes
app = FastAPI(title="Autonomous Research Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(research_routes.router,prefix="/api",tags=["research"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Autonomous Research Agent API!"}

