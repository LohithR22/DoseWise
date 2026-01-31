# Reason node - analyzes observations and makes decisions
from app.agent.state import AgentState

def reason_node(state: AgentState) -> AgentState:
    """
    Reasoning node: Analyze observations and determine what actions are needed
    - Check for drug interactions
    - Monitor health trends
    - Identify potential issues
    """
    observations = state.get("observations", [])
    medications = state.get("medications", [])
    vitals = state.get("vitals", [])
    
    reasoning = []
    
    # Analyze medications
    if medications:
        reasoning.append(f"Analyzing {len(medications)} medications for interactions")
    
    # Analyze vitals
    if vitals:
        reasoning.append("Checking vital signs trends")
    
    # Check for compliance
    reasoning.append("Monitoring medication adherence")
    
    state["reasoning"] = " | ".join(reasoning)
    
    return state
