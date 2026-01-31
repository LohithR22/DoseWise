# Medication registry - manages medication data
from typing import List, Dict

def get_user_medications(user_id: str) -> List[Dict]:
    """Get all medications for a user"""
    # TODO: Implement database retrieval
    return []

def add_medication(user_id: str, medication: Dict) -> bool:
    """Add a new medication for a user"""
    # TODO: Implement database insertion
    return True

def update_medication(user_id: str, medication_id: str, medication: Dict) -> bool:
    """Update medication details"""
    # TODO: Implement database update
    return True

def delete_medication(user_id: str, medication_id: str) -> bool:
    """Delete a medication"""
    # TODO: Implement database deletion
    return True
