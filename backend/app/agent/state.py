from typing import TypedDict, List, Optional, Any
from datetime import datetime

class AgentState(TypedDict):
    """State schema for the DoseWise agent"""
    user_id: str
    medications: List[dict]
    vitals: List[dict]
    observations: List[str]
    reasoning: Optional[str]
    plan: Optional[str]
    actions: List[dict]
    timestamp: datetime
    context: Optional[dict]
    messages: List[str]
