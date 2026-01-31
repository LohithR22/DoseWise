"""
FastAPI glue layer: load state, call agent/setup/dose/vitals, save state, return state.
No business logic or reasoning here.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.agent.graph import agent
from app.agent.state import AgentState, create_initial_state
from app.api.schemas import (
    DoseConfirmationRequest,
    MedicationSetupRequest,
    VitalsSubmissionRequest,
)
from app.medication.inventory import InventoryManager
from app.medication.registry import MedicationRegistry
from app.medication.schedule import ScheduleManager

# State file: only FastAPI touches the filesystem
_STORAGE_DIR = Path(__file__).resolve().parent.parent / "storage"
_STATE_PATH = _STORAGE_DIR / "state.json"


def _ensure_storage_dir() -> None:
    _STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def load_state() -> AgentState:
    """Load AgentState from storage/state.json. Return empty initial state if missing."""
    _ensure_storage_dir()
    if not _STATE_PATH.exists():
        return create_initial_state()

    try:
        with open(_STATE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        raise HTTPException(status_code=500, detail=f"Failed to load state: {e}") from e

    state = create_initial_state()
    state.update(data)

    if "current_time" in state and isinstance(state["current_time"], str):
        try:
            state["current_time"] = datetime.fromisoformat(
                state["current_time"].replace("Z", "+00:00")
            )
        except (ValueError, TypeError):
            state["current_time"] = datetime.utcnow()
    if "user_id" not in state:
        state["user_id"] = "default"
    if "messages" not in state:
        state["messages"] = []
    return state


def save_state(state: AgentState) -> None:
    """Persist AgentState to storage/state.json."""
    _ensure_storage_dir()
    out: dict[str, Any] = dict(state)
    if "current_time" in out and isinstance(out["current_time"], datetime):
        out["current_time"] = out["current_time"].isoformat()
    try:
        with open(_STATE_PATH, "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2, default=str)
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Failed to save state: {e}") from e


router = APIRouter(prefix="/api", tags=["api"])


@router.get("/state")
async def get_state() -> dict:
    """GET /state: load and return full AgentState."""
    state = load_state()
    # Serialize for response
    resp: dict[str, Any] = dict(state)
    if "current_time" in resp and isinstance(resp["current_time"], datetime):
        resp["current_time"] = resp["current_time"].isoformat()
    return resp


@router.post("/agent/run")
async def run_agent() -> dict:
    """POST /agent/run: load state, invoke LangGraph agent, save state, return updated state."""
    state = load_state()
    try:
        result = agent.invoke(state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent run failed: {e}") from e
    save_state(result)
    resp: dict[str, Any] = dict(result)
    if "current_time" in resp and isinstance(resp["current_time"], datetime):
        resp["current_time"] = resp["current_time"].isoformat()
    return resp


@router.post("/setup/medications")
async def setup_medications(payload: MedicationSetupRequest) -> dict:
    """POST /setup/medications: populate AgentState.medications and inventory, persist, return state."""
    state = load_state()
    registry = MedicationRegistry()
    schedule_mgr = ScheduleManager()
    inv_mgr = InventoryManager()

    for med in payload.medications:
        if not med.name.strip():
            continue
        timings = [med.time] if med.time else ["08:00"]
        try:
            registry.add_medication(
                name=med.name,
                dosage=med.dosage,
                timings=timings,
                before_after_food="anytime",
            )
        except ValueError:
            continue
        schedule_mgr.add_medication_schedule(med.name, timings)
        try:
            inv_mgr.add_medication(med.name, initial_quantity=30)
        except ValueError:
            pass

    state["medications"] = registry.get_all()
    state["inventory"] = inv_mgr.get_inventory_status()
    if not state.get("user_id"):
        state["user_id"] = "default"
    if "messages" not in state:
        state["messages"] = []

    save_state(state)
    resp: dict[str, Any] = dict(state)
    if "current_time" in resp and isinstance(resp["current_time"], datetime):
        resp["current_time"] = resp["current_time"].isoformat()
    return resp


@router.post("/dose/confirm")
async def dose_confirm(body: DoseConfirmationRequest) -> dict:
    """POST /dose/confirm: mark dose taken (ScheduleManager), decrement inventory (InventoryManager), persist, optionally run agent, return state."""
    state = load_state()
    medication_name = body.medication_name
    if not medication_name and body.medication_id:
        for m in state.get("medications") or []:
            mid = str(m.get("id") or m.get("name", ""))
            if mid == str(body.medication_id):
                medication_name = m.get("name") or m.get("id")
                break
        if not medication_name:
            medication_name = str(body.medication_id)
    if not medication_name:
        raise HTTPException(status_code=400, detail="medication_name or medication_id required")

    taken_at = body.timestamp or datetime.utcnow()
    scheduled_time = body.scheduled_time
    if not scheduled_time:
        scheduled_time = taken_at.strftime("%H:%M")

    schedule_mgr = ScheduleManager()
    for m in state.get("medications") or []:
        name = m.get("name") or m.get("id")
        timings = m.get("timings") or ["08:00"]
        if name == medication_name or str(m.get("id")) == str(body.medication_id):
            schedule_mgr.add_medication_schedule(medication_name, timings, start_date=taken_at)
            break
    schedule_mgr.mark_dose_taken(medication_name, scheduled_time, taken_at=taken_at)

    for m in state.get("medications") or []:
        if (m.get("name") or m.get("id")) == medication_name:
            m["last_taken_at"] = taken_at.isoformat()
            break

    inv_mgr = InventoryManager()
    for item in state.get("inventory") or []:
        mn = item.get("med_name") or item.get("name") or item.get("id")
        if not mn:
            continue
        try:
            inv_mgr.add_medication(
                mn,
                initial_quantity=item.get("quantity", 0),
                low_stock_threshold=item.get("low_stock_threshold", 10),
            )
        except ValueError:
            pass
    try:
        inv_mgr.decrement(medication_name, 1)
        state["inventory"] = inv_mgr.get_inventory_status()
    except (ValueError, KeyError):
        pass

    save_state(state)
    try:
        result = agent.invoke(state)
        save_state(result)
        state = result
    except Exception:
        pass

    resp: dict[str, Any] = dict(state)
    if "current_time" in resp and isinstance(resp["current_time"], datetime):
        resp["current_time"] = resp["current_time"].isoformat()
    return resp


@router.post("/vitals/submit")
async def vitals_submit(body: VitalsSubmissionRequest) -> dict:
    """POST /vitals/submit: append vitals to AgentState, persist, return state."""
    state = load_state()
    vitals = state.get("vitals") or []
    try:
        entry = dict(body.model_dump(exclude_none=True))
    except AttributeError:
        entry = dict(body.dict(exclude_none=True))
    if "recorded_at" not in entry:
        entry["recorded_at"] = datetime.utcnow().isoformat()
    elif isinstance(entry.get("recorded_at"), datetime):
        entry["recorded_at"] = entry["recorded_at"].isoformat()
    vitals.append(entry)
    state["vitals"] = vitals
    save_state(state)
    resp = dict(state)
    if "current_time" in resp and isinstance(resp["current_time"], datetime):
        resp["current_time"] = resp["current_time"].isoformat()
    return resp


# --- Frontend compatibility (existing frontend calls these) ---
@router.get("/medications")
async def get_medications() -> dict:
    """Return medications from state (frontend getMedications)."""
    state = load_state()
    return {"medications": state.get("medications") or []}


@router.post("/setup")
async def setup_legacy(payload: MedicationSetupRequest) -> dict:
    """Legacy POST /setup: same as /setup/medications."""
    return await setup_medications(payload)


@router.post("/medications/{medication_id}/confirm")
async def dose_confirm_by_id(medication_id: str, body: DoseConfirmationRequest) -> dict:
    """Legacy POST /medications/:id/confirm: same as /dose/confirm with medication_id."""
    try:
        kwargs = body.model_dump()
    except AttributeError:
        kwargs = body.dict()
    kwargs["medication_id"] = medication_id
    if kwargs.get("timestamp") is None:
        kwargs["timestamp"] = datetime.utcnow()
    return await dose_confirm(DoseConfirmationRequest(**kwargs))


@router.post("/vitals")
async def vitals_legacy(body: VitalsSubmissionRequest) -> dict:
    """Legacy POST /vitals: same as /vitals/submit."""
    return await vitals_submit(body)
