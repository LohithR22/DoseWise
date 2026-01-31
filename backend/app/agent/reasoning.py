# Reason node: decide problem, urgency, and whether escalation is needed

import logging
from app.agent.state import AgentState

logger = logging.getLogger(__name__)

# Urgency levels (no LLM yet)
URGENCY_LOW = "low"
URGENCY_MEDIUM = "medium"
URGENCY_HIGH = "high"
URGENCY_CRITICAL = "critical"


def reason(state: AgentState) -> AgentState:
    """
    Decide:
    - what problem exists
    - urgency level
    - whether escalation is needed
    """
    logger.info("reasoning: executing reason node")
    observations = state.get("observations") or []
    reasoning_parts: list[str] = []
    problem: str = "none"
    urgency: str = URGENCY_LOW
    escalation_needed: bool = False

    # Derive problem from observations
    has_due = any("due_medicines:" in o and "none" not in o for o in observations)
    has_missed = any("missed_doses:" in o and "none" not in o for o in observations)
    has_low_inv = any("low_inventory:" in o and "none" not in o for o in observations)
    has_abnormal = any("abnormal_vitals:" in o and "none" not in o for o in observations)

    if has_abnormal:
        problem = "abnormal_vitals"
        urgency = URGENCY_HIGH
        escalation_needed = True
        reasoning_parts.append("Abnormal vitals detected; escalation recommended.")
    if has_missed:
        if problem == "none":
            problem = "missed_doses"
        urgency = URGENCY_MEDIUM if urgency == URGENCY_LOW else urgency
        escalation_needed = escalation_needed or False  # optional: escalate after N misses
        reasoning_parts.append("Missed doses identified.")
    if has_due and not has_missed:
        if problem == "none":
            problem = "due_medicines"
        reasoning_parts.append("Medicines are due; remind user.")
    if has_low_inv:
        if problem == "none":
            problem = "low_inventory"
        urgency = URGENCY_MEDIUM if urgency == URGENCY_LOW else urgency
        reasoning_parts.append("Low inventory; consider reorder.")

    if problem == "none":
        reasoning_parts.append("No actionable problem detected.")

    reasoning_text = " ".join(reasoning_parts)
    reasoning_text += f" problem={problem} urgency={urgency} escalation_needed={escalation_needed}"

    logger.info(
        "reasoning: problem=%s urgency=%s escalation_needed=%s",
        problem, urgency, escalation_needed,
    )
    return {
        **state,
        "reasoning": reasoning_text,
        "_problem": problem,
        "_urgency": urgency,
        "_escalation_needed": escalation_needed,
    }


def reason_node(state: AgentState) -> AgentState:
    """Node entry point for LangGraph."""
    return reason(state)
