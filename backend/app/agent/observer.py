# Observe node - gathers information about user state
from app.agent.state import AgentState
from app.medication.registry import get_user_medications
from app.health.vitals import get_recent_vitals

def observe_node(state: AgentState) -> AgentState:
    """
    Observation node: Gather current state information
    - Check medication schedules
    - Retrieve recent health vitals
    - Identify any missed doses
    """
    user_id = state["user_id"]
    
    # Get medications
    medications = get_user_medications(user_id)
    
    # Get recent vitals
    vitals = get_recent_vitals(user_id)
    
    # Generate observations
    observations = []
    if medications:
        observations.append(f"Found {len(medications)} active medications")
    if vitals:
        observations.append(f"Retrieved {len(vitals)} recent vital readings")
    
    state["medications"] = medications
    state["vitals"] = vitals
    state["observations"] = observations
    
    return state
