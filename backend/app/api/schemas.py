from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicationRequest(BaseModel):
    name: str
    dosage: str
    frequency: str
    start_date: datetime
    end_date: Optional[datetime] = None

class HealthVitalsRequest(BaseModel):
    heart_rate: Optional[int] = None
    blood_pressure: Optional[str] = None
    temperature: Optional[float] = None
    recorded_at: datetime

class ReminderSchema(BaseModel):
    id: str
    medication_id: str
    reminder_time: datetime
    status: str
