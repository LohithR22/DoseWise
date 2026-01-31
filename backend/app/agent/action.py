# Act node: execute planned actions (REMIND, ESCALATE, REORDER)

import logging
from app.agent.state import AgentState
from app.agent.planner import ACTION_REMIND, ACTION_ESCALATE, ACTION_REORDER, PLAN_SEP

logger = logging.getLogger(__name__)


def act(state: AgentState) -> AgentState:
    """
    Execute planned actions:
    - REMIND: send reminder (placeholder)
    - ESCALATE: escalate alert (placeholder)
    - REORDER: trigger reorder (placeholder)
    Append each executed action to action_log. Optionally add alerts.
    """
    logger.info("action: executing act node")
    plan_text = state.get("plan") or ""
    action_log = list(state.get("action_log") or [])
    alerts = list(state.get("alerts") or [])

    if not plan_text.strip():
        logger.info("action: no plan entries to execute")
        return {**state, "action_log": action_log, "alerts": alerts}

    entries = [e.strip() for e in plan_text.split(PLAN_SEP) if e.strip()]
    for entry in entries:
        if ":" not in entry:
            continue
        kind, target = entry.split(":", 1)
        kind = kind.strip().upper()
        target = target.strip()
        if kind == ACTION_REMIND:
            # Placeholder: no LLM, no external send_reminder
            action_log.append({"type": "REMIND", "target": target, "status": "logged"})
            logger.info("action: REMIND target=%s (placeholder)", target)
        elif kind == ACTION_ESCALATE:
            action_log.append({"type": "ESCALATE", "reason": target, "status": "logged"})
            alerts.append(f"Escalation: {target}")
            logger.info("action: ESCALATE reason=%s (placeholder)", target)
        elif kind == ACTION_REORDER:
            action_log.append({"type": "REORDER", "target": target, "status": "logged"})
            logger.info("action: REORDER target=%s (placeholder)", target)

    logger.info("action: executed %d entries, action_log length=%d", len(entries), len(action_log))
    return {**state, "action_log": action_log, "alerts": alerts}


def action_node(state: AgentState) -> AgentState:
    """Node entry point for LangGraph."""
    return act(state)
