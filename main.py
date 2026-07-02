"""
MindMap — Emotional Pattern Journal
FastAPI backend wrapping Cognee's graph memory engine.
"""

import os
import asyncio
from datetime import datetime
from typing import Optional

import cognee
from cognee.api.v1.visualize.visualize import visualize_graph
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel


load_dotenv()


EMOTION_AWARE_PROMPT = """
Extract entities and relationships from the text into a knowledge graph.

In addition to people, events, dates, and actions, you MUST extract every
feeling, mood, or emotional reaction the writer describes (e.g. anger, hurt,
shame, anxiety, pride, joy, nostalgia) as its own node with type "emotion".

For every emotion node, add edges connecting it to:
- the person or event that triggered it (relationship_name: "triggered_by")
- the person who felt it (relationship_name: "felt_by")
- the date/time it occurred (relationship_name: "occurred_on"), if known
- any resulting behavior or coping action (relationship_name: "led_to"), if mentioned
- the day of week (relationship_name: "day_of_week"), if derivable
- any health/sleep context (relationship_name: "health_context"), if mentioned

Also extract:
- activities mentioned (node type: "activity")
- people mentioned (node type: "person")
- locations (node type: "location")
- coping strategies that helped (node type: "coping_strategy", relationship: "helped_with")

Do not skip emotions just because they are described briefly or in passing.
Always link coping strategies back to the emotional state they addressed.
"""

# ─── App setup ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="MindMap API",
    description="Emotional pattern journal powered by Cognee graph memory",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), ".artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)


# ─── Schemas ─────────────────────────────────────────────────────────────────
class JournalEntry(BaseModel):
    text: str
    mood_score: Optional[int] = None  # 1–10
    date_label: Optional[str] = None  # e.g. "July 2, 2026"


class RecallQuery(BaseModel):
    query: str


class PatternQuery(BaseModel):
    focus: Optional[str] = "low mood, drained, anxious, stressed"


# ─── Helpers ─────────────────────────────────────────────────────────────────
def _format_entry(entry: JournalEntry) -> str:
    """Prepend date and mood metadata to journal text before storing in Cognee."""
    date_str = entry.date_label or datetime.now().strftime("%B %d, %Y — %I:%M %p")
    mood_line = ""
    if entry.mood_score is not None:
        mood_line = f"\n[Mood score: {entry.mood_score}/10]"
    return f"{date_str}{mood_line}\n\n{entry.text}"


PATTERN_QUERIES = [
    "What recurring emotional patterns appear across multiple journal entries? "
    "List correlations: what situations, people, or activities appear repeatedly "
    "alongside low mood, stress, anxiety, or feeling drained?",

    "What coping strategies has the writer used when feeling low or stressed? "
    "Which activities or actions did they mention helped them feel better?",

    "What triggers appear most often before negative emotional states? "
    "Look for repeated mentions of specific people, tasks, times, or situations.",

    "Are there any positive patterns — times when the writer felt good, energized, or proud? "
    "What was happening in those moments?",
]


# ─── Endpoints ───────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "MindMap API"}


@app.post("/journal")
async def add_journal_entry(entry: JournalEntry):
    """Store a new journal entry into Cognee's knowledge graph."""
    try:
        formatted = _format_entry(entry)
        await cognee.remember(formatted, custom_prompt=EMOTION_AWARE_PROMPT)
        return {
            "success": True,
            "message": "Entry added to your memory graph.",
            "chars_stored": len(formatted),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recall")
async def recall_query(query: RecallQuery):
    """Free-form semantic + graph query over all stored journal entries."""
    try:
        results = await cognee.recall(query_text=query.query)
        items = []
        for r in results:
            text = r.text if hasattr(r, "text") else str(r)
            if text.strip():
                items.append({"text": text})
        return {"query": query.query, "results": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/patterns")
async def get_patterns(body: PatternQuery):
    """
    Run a suite of pattern-detection queries against Cognee's graph.
    Returns correlated observations — never diagnoses.
    """
    try:
        all_patterns = []

        for q in PATTERN_QUERIES:
            results = await cognee.recall(query_text=q)
            for r in results:
                text = r.text if hasattr(r, "text") else str(r)
                if text.strip() and len(text) > 30:
                    all_patterns.append({"query": q, "finding": text})

        # Deduplicate roughly by text similarity (simple prefix check)
        seen = set()
        unique = []
        for p in all_patterns:
            key = p["finding"][:80]
            if key not in seen:
                seen.add(key)
                unique.append(p)

        return {"patterns": unique[:20]}  # Cap at 20 pattern cards
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/seed")
async def seed_demo_data():
    """Load pre-seeded multi-week journal entries for demo purposes."""
    from seeder import SEED_ENTRIES
    try:
        count = 0
        for entry_text in SEED_ENTRIES:
            await cognee.remember(entry_text, custom_prompt=EMOTION_AWARE_PROMPT)
            count += 1
        return {
            "success": True,
            "message": f"Seeded {count} entries into your memory graph.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/forget")
async def forget_everything():
    """Clear all memory from Cognee. Use with caution."""
    try:
        await cognee.forget(everything=True)
        return {"success": True, "message": "All memory cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/visualize")
async def visualize():
    """Generate and return the Cognee knowledge graph visualization."""
    try:
        graph_path = os.path.join(ARTIFACTS_DIR, "mindmap_graph.html")
        await visualize_graph(graph_path)
        return FileResponse(graph_path, media_type="text/html")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
