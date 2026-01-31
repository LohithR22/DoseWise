# LangGraph definition for DoseWise agent
# Flow: observe → reason → plan → act → observe (deterministic; use recursion_limit for one cycle)

import logging
from langgraph.graph import StateGraph
from app.agent.state import AgentState
from app.agent.observer import observe_node
from app.agent.reasoning import reason_node
from app.agent.planner import plan_node
from app.agent.action import action_node

logger = logging.getLogger(__name__)


def _logged_node(name: str, node_fn):
    """Wrap a node to log every execution."""

    def wrapped(state: AgentState) -> AgentState:
        logger.info("graph: node_execution node=%s", name)
        out = node_fn(state)
        logger.info("graph: node_complete node=%s", name)
        return out

    return wrapped


def create_agent_graph():
    """Create the LangGraph workflow for the DoseWise agent."""
    workflow = StateGraph(AgentState)

    # Add nodes with logging
    workflow.add_node("observer", _logged_node("observer", observe_node))
    workflow.add_node("reasoning", _logged_node("reasoning", reason_node))
    workflow.add_node("planner", _logged_node("planner", plan_node))
    workflow.add_node("action", _logged_node("action", action_node))

    # Deterministic edges: observe → reason → plan → act → observe
    workflow.add_edge("observer", "reasoning")
    workflow.add_edge("reasoning", "planner")
    workflow.add_edge("planner", "action")
    workflow.add_edge("action", "observer")

    workflow.set_entry_point("observer")

    return workflow.compile()


agent = create_agent_graph()
