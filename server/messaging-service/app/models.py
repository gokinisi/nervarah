from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

class RecentMessage(BaseModel):
    category: str
    text: str

class GenerateRequest(BaseModel):
    subscriber_id: str
    name: Optional[str] = None
    timezone: Optional[str] = None
    preferences: Dict[str, Any] = Field(default_factory=dict)
    recent_messages: List[RecentMessage] = Field(default_factory=list)

class GenerateResponse(BaseModel):
    text: str
    category: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
