from fastapi import FastAPI

app = FastAPI(title="Autonomous Research Agent")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Autonomous Research Agent API!"}

