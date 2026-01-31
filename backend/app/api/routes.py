from fastapi import APIRouter
from app.api.schemas import MedicationRequest, HealthVitalsRequest

router = APIRouter(prefix="/api", tags=["api"])

@router.get("/medications")
async def get_medications():
    """Get all medications"""
    return {"medications": []}

@router.post("/medications")
async def add_medication(medication: MedicationRequest):
    """Add a new medication"""
    return {"status": "created", "medication": medication}

@router.get("/vitals")
async def get_vitals():
    """Get health vitals"""
    return {"vitals": []}

@router.post("/vitals")
async def record_vitals(vitals: HealthVitalsRequest):
    """Record health vitals"""
    return {"status": "recorded", "vitals": vitals}

@router.get("/reminders")
async def get_reminders():
    """Get pending reminders"""
    return {"reminders": []}
