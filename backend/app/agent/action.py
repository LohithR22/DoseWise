# Act node - executes the planned actions
from app.agent.state import AgentState
from app.notifications.reminders import send_reminder
from app.reorder.reorder_agent import check_inventory

def action_node(state: AgentState) -> AgentState:
    """
    Action node: Execute planned actions
    - Send reminders
    - Trigger reorders
    - Escalate alerts
    """
    user_id = state["user_id"]
    medications = state.get("medications", [])
    
    actions = []
    
    # Send reminders
    for med in medications:
        reminder_sent = send_reminder(user_id, med)
        if reminder_sent:
            actions.append({"type": "reminder_sent", "medication": med.get("name")})
    
    # Check inventory
    inventory_status = check_inventory(user_id)
    if inventory_status:
        actions.append({"type": "inventory_checked", "status": inventory_status})
    
    state["actions"] = actions
    state["messages"].append(f"Executed {len(actions)} actions")
    
    return state
