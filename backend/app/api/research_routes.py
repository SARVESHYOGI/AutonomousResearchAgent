from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter(prefix="/research", tags=["research"])

class ResearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 10

@router.post("/")
async def start_research(request: ResearchRequest):
    return {"message": f"Research started for query: {request.query}", "max_results": request.max_results}

@router.get("/{id}")
async def get_research_report():
    return {"message": "Research status: In progress"}

@router.get("/history")
async def get_research_history():
    return {"message": "Research history retrieved successfully", "history": []}

@router.delete("/{id}")
async def delete_research_report():
    return {"message": "Research report deleted successfully"}