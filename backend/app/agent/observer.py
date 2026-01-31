# Observe node: populate observations from current state

import logging
from typing import Any

from app.agent.state import AgentState

logger = logging.getLogger(__name__)


def observe(state: AgentState) -> AgentState:
    """
    Populate observations from state:
    - due medicines
    - missed doses
    - low inventory
    - abnormal vitals
    """
    logger.info("observer: executing observe node")
    observations: list[str] = []
    current_time = state.get("current_time")
    medications = state.get("medications") or []
    inventory = state.get("inventory") or []
    vitals = state.get("vitals") or []

    # Due medicines: medications that are due at or before current_time
    due_medicines = _due_medicines(medications, current_time)
    if due_medicines:
        observations.append(f"due_medicines:{','.join(due_medicines)}")
    else:
        observations.append("due_medicines:none")

    # Missed doses: inferred from schedule vs current time (placeholder logic)
    missed = _missed_doses(medications, current_time)
    if missed:
        observations.append(f"missed_doses:{','.join(missed)}")
    else:
        observations.append("missed_doses:none")

    # Low inventory
    low = _low_inventory(inventory)
    if low:
        observations.append(f"low_inventory:{','.join(low)}")
    else:
        observations.append("low_inventory:none")

    # Abnormal vitals
    abnormal = _abnormal_vitals(vitals)
    if abnormal:
        observations.append(f"abnormal_vitals:{','.join(abnormal)}")
    else:
        observations.append("abnormal_vitals:none")

    logger.info("observer: observations=%s", observations)
    return {**state, "observations": observations}


def _due_medicines(medications: list[dict], current_time: Any) -> list[str]:
    """Names of medications due at or before current_time."""
    names: list[str] = []
    for m in medications:
        name = m.get("name") or m.get("id") or "unknown"
        # Placeholder: if next_dose_at exists and is <= current_time, consider due
        next_at = m.get("next_dose_at") or m.get("next_dose")
        if next_at is not None and current_time is not None:
            try:
                from datetime import datetime
                if isinstance(next_at, datetime):
                    if next_at <= current_time:
                        names.append(str(name))
                elif isinstance(next_at, str):
                    dt = datetime.fromisoformat(next_at.replace("Z", "+00:00"))
                    if dt <= current_time:
                        names.append(str(name))
            except Exception:
                pass
        # If no schedule info, treat as due when medication exists (placeholder)
        elif not names and medications:
            names.append(str(name))
            break
    return names


def _missed_doses(medications: list[dict], current_time: Any) -> list[str]:
    """Names of medications with missed doses (placeholder: past due window)."""
    missed: list[str] = []
    for m in medications:
        name = m.get("name") or m.get("id") or "unknown"
        last_taken = m.get("last_taken_at") or m.get("last_taken")
        if last_taken is None:
            continue
        # Placeholder: if we have due_medicines and no recent take, could be missed
        next_at = m.get("next_dose_at") or m.get("next_dose")
        if next_at and current_time:
            try:
                from datetime import datetime
                if isinstance(next_at, datetime):
                    n = next_at
                else:
                    n = datetime.fromisoformat(str(next_at).replace("Z", "+00:00"))
                if isinstance(current_time, datetime) and n < current_time:
                    missed.append(str(name))
            except Exception:
                pass
    return missed


def _low_inventory(inventory: list[dict]) -> list[str]:
    """Ids/names of items with low stock."""
    low: list[str] = []
    for item in inventory:
        quantity = item.get("quantity") or item.get("remaining") or 0
        threshold = item.get("low_threshold") or item.get("threshold") or 7
        if quantity <= threshold:
            ident = item.get("medication_id") or item.get("name") or item.get("id") or "unknown"
            low.append(str(ident))
    return low


def _abnormal_vitals(vitals: list[dict]) -> list[str]:
    """Labels for vitals outside normal range (placeholder thresholds)."""
    abnormal: list[str] = []
    for v in vitals:
        kind = v.get("type") or v.get("metric") or "unknown"
        value = v.get("value")
        if value is None:
            continue
        try:
            num = float(value)
        except (TypeError, ValueError):
            continue
        # Placeholder thresholds
        if kind in ("heart_rate", "hr") and (num < 50 or num > 120):
            abnormal.append(f"{kind}={num}")
        elif kind in ("blood_pressure_systolic", "bp_sys") and (num < 90 or num > 160):
            abnormal.append(f"{kind}={num}")
        elif kind in ("blood_pressure_diastolic", "bp_dia") and (num < 60 or num > 100):
            abnormal.append(f"{kind}={num}")
        elif kind in ("temperature", "temp") and (num < 36.0 or num > 38.0):
            abnormal.append(f"{kind}={num}")
    return abnormal


# LangGraph node: same signature, name used in graph
def observe_node(state: AgentState) -> AgentState:
    """Node entry point for LangGraph."""
    return observe(state)
