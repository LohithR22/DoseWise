"""Pydantic request/response schemas for DoseWise API."""

from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field


# --- Setup ---
class MedicationSetupItem(BaseModel):
    """Single medication in setup payload."""
    name: str
    dosage: str
    time: Optional[str] = "08:00"
    frequency: Optional[str] = "Daily"


class MedicationSetupRequest(BaseModel):
    """Request body for POST /setup/medications."""
    name: Optional[str] = None
    age: Optional[str] = None
    conditions: Optional[str] = None
    medications: List[MedicationSetupItem] = Field(default_factory=list)


# --- Dose confirmation ---
class DoseConfirmationRequest(BaseModel):
    """Request body for POST /dose/confirm (medicine name + timestamp)."""
    medication_name: Optional[str] = Field(None, description="Medication/medicine name")
    medication_id: Optional[str] = None  # Frontend may send id; resolved to name from state
    timestamp: Optional[datetime] = None  # Default to now if omitted
    scheduled_time: Optional[str] = None  # HH:MM for ScheduleManager


# --- Vitals ---
class VitalsSubmissionRequest(BaseModel):
    """Request body for POST /vitals/submit."""
    heart_rate: Optional[int] = None
    blood_pressure: Optional[str] = None
    temperature: Optional[float] = None
    recorded_at: Optional[datetime] = None
    # Allow extra fields for flexibility (e.g. type, value, metric)
    class Config:
        extra = "allow"


# --- Response (state is returned as raw JSON; this is for typing/docs) ---
class AgentStateResponse(BaseModel):
    """Schema for full agent state returned by GET /state and mutation endpoints."""
    class Config:
        extra = "allow"

    current_time: Optional[Any] = None
    medications: List[Any] = Field(default_factory=list)
    inventory: List[Any] = Field(default_factory=list)
    vitals: List[Any] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)
    reasoning: Optional[str] = None
    plan: Optional[str] = None
    action_log: List[Any] = Field(default_factory=list)
    alerts: List[str] = Field(default_factory=list)
