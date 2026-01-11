import random
from typing import Any, Dict, List, Optional

CATEGORIES = ["morning_ignite", "calm_focus", "confidence", "discipline", "gratitude", "athlete_mindset"]

TEMPLATES = {
    "morning_ignite": [
        "Good morning{n}. Pick one move that makes today a win—then start it in the next 5 minutes.",
        "Today is a reps day{n}. One clean action, then another. Momentum is built, not found.",
    ],
    "calm_focus": [
        "Pause{n}. Unclench your jaw, drop your shoulders, exhale longer than you inhale—3 rounds. Then do the next right thing.",
        "Your nervous system leads your performance{n}. Slow breath, soft eyes, steady hands. Proceed.",
    ],
    "confidence": [
        "Act like the version of you who already keeps promises{n}. What would they do in the next 10 minutes?",
        "Confidence is evidence{n}. Create one small proof today—something you can point to tonight.",
    ],
    "discipline": [
        "Motivation follows motion{n}. Start small, stay consistent, finish strong.",
        "No negotiating today{n}. One priority. One block of focused effort. Then you’re done.",
    ],
    "gratitude": [
        "Name one thing that’s going right{n}. Let it be true for 20 seconds. Then build from there.",
        "Send one positive message today{n}. Strengthen your network and your nervous system.",
    ],
    "athlete_mindset": [
        "Train the moment, not the mood{n}. Show up with form and focus—results follow.",
        "Champions reset fast{n}. One breath. One cue. One next rep.",
    ],
}

def generate_message(
    subscriber_id: str,
    name: Optional[str],
    timezone: Optional[str],
    preferences: Dict[str, Any],
    recent: List[Any],
) -> Dict[str, Any]:
    recent_categories = [m.category for m in recent[-3:]] if recent else []
    candidates = [c for c in CATEGORIES if c not in recent_categories[:1]] or CATEGORIES

    preferred = preferences.get("preferred_categories")
    weighted = candidates + preferred if isinstance(preferred, list) else candidates

    category = random.choice(weighted)
    template = random.choice(TEMPLATES[category])

    n = f", {name}" if name else ""
    text = template.format(n=n).strip()
    if len(text) > 320:
        text = text[:317] + "..."

    return {
        "text": text,
        "category": category,
        "metadata": {"generator_version": "rules_v1", "subscriber_id": subscriber_id},
    }
