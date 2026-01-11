from fastapi import FastAPI, HTTPException
from app.models import GenerateRequest, GenerateResponse
from app.generator import generate_message

app = FastAPI(title="Messaging Service", version="0.1.0")

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    try:
        return generate_message(
            subscriber_id=req.subscriber_id,
            name=req.name,
            timezone=req.timezone,
            preferences=req.preferences,
            recent=req.recent_messages,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
