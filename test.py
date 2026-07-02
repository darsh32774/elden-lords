import cognee
import asyncio
import os
from cognee.api.v1.visualize.visualize import visualize_graph

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

Do not skip emotions just because they are described briefly or in passing.
"""

async def main():
    await cognee.forget(everything=True)

    journal_entry = """
July 2, 2026 — 9:47 PM
Today was rough. Had a call with Priya, my team lead, about the deployment timeline and it completely threw me off. I walked in already stressed because I'd been up till 2am fixing the auth bug, and then she opens with "why isn't this done yet" instead of even asking how the debugging went. I felt this hot flash of anger first, like actual heat in my chest, but under that I think it was hurt — like she didn't even notice I'd been grinding on this alone all week.
I tried to explain the blocker was on the API side, not mine, but she kept talking over me, and I just went quiet. I hate when I do that. I had so much more to say but I could feel my throat tightening and I didn't trust my voice not to crack, so I just said "okay, I'll have it done by Thursday" and got off the call. Then I sat at my desk for like ten minutes just staring at nothing.
Afterward the anger faded into this heavier feeling — kind of like shame, honestly. Like maybe I should've pushed back harder and defended myself instead of shrinking. And underneath THAT there's this anxious hum, like I'm now dreading the next call with her, replaying it and thinking of all the things I should've said.
What gets me is this isn't the first time. Same thing happened with her in March over the sprint review — she jumps to blame before asking questions, and I just fold instead of explaining myself clearly. I think what actually helps, when I look back, is writing down what I want to say BEFORE the call so I don't freeze. Talking to Arjun about it after usually calms me down faster than sitting alone does.
Anyway. Tired. Going to try to let this go before bed but I know I'll probably think about it in the shower tomorrow like I always do.
"""

    print("Remembering the journal entry...")
    await cognee.remember(journal_entry, custom_prompt=EMOTION_AWARE_PROMPT)

    print("\n=== Retrieval Results ===")
    results = await cognee.recall(
        query_text="What happened in the call with Priya? How did I feel?"
    )
    for i, result in enumerate(results):
        print(f"\nResult {i+1}:")
        print(result.text[:500] + "..." if len(result.text) > 500 else result.text)

    print("\n=== Pattern Retrieval ===")
    pattern_results = await cognee.recall(
        query_text="recurring patterns with team lead or Priya"
    )
    for i, result in enumerate(pattern_results):
        print(f"\nPattern Result {i+1}:")
        print(result.text[:400] + "..." if len(result.text) > 400 else result.text)

    print("\nGenerating graph visualization...")
    visualize_graph_path = os.path.join(
        os.path.dirname(__file__), ".artifacts", "mental_journal_graph.html"
    )
    await visualize_graph(visualize_graph_path)
    print(f"Graph saved to: {visualize_graph_path}")


if __name__ == '__main__':
    asyncio.run(main())
