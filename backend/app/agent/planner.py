# Plan node - creates action plan based on reasoning
from app.agent.state import AgentState

def plan_node(state: AgentState) -> AgentState:
    """
    Planning node: Create action plan based on analysis
    - Schedule reminders
    - Plan reorders
    - Schedule health checks
    """
    medications = state.get("medications", [])
    reasoning = state.get("reasoning", "")
    
    plan = []
    
    # Plan medication reminders
    for med in medications:
        plan.append(f"Schedule reminder for {med.get('name', 'medication')}")
    
    # Check inventory and plan reorders
    plan.append("Check medication inventory levels")
    plan.append("Plan reorders for low stock items")
    
    # Plan health monitoring
    plan.append("Schedule periodic health checks")
    
    state["plan"] = " | ".join(plan)
    
    return state
