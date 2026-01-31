# LangGraph definition for DoseWise agent
# This module defines the multi-agent workflow using LangGraph

from langgraph.graph import StateGraph
from app.agent.state import AgentState
from app.agent.observer import observe_node
from app.agent.reasoning import reason_node
from app.agent.planner import plan_node
from app.agent.action import action_node

def create_agent_graph():
    """Create the LangGraph workflow for the DoseWise agent"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("observer", observe_node)
    workflow.add_node("reasoning", reason_node)
    workflow.add_node("planner", plan_node)
    workflow.add_node("action", action_node)
    
    # Add edges
    workflow.add_edge("observer", "reasoning")
    workflow.add_edge("reasoning", "planner")
    workflow.add_edge("planner", "action")
    
    # Set entry point
    workflow.set_entry_point("observer")
    
    return workflow.compile()

agent = create_agent_graph()
