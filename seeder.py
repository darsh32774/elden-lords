"""
MindMap — Pre-seeded journal entries for demo.
Three weeks of realistic data covering multiple emotional arcs:
 1. Work stress / Priya (team lead) trigger arc
 2. Sunday-night anxiety arc
 3. Exercise / mood correlation arc
 4. Positive moments arc
"""

SEED_ENTRIES = [
    # ── Week 1 ────────────────────────────────────────────────────────────────

    """June 9, 2026 — Tuesday
[Mood score: 3/10]

Had another call with Priya today. She opened with "this was supposed to be done last week" before I even had a chance to explain that the API was down on our end. Same pattern as before — jumping straight to blame, no questions first. I felt that familiar tightening in my chest, the one that happens when I'm trying to hold everything together and someone makes me feel like I'm failing anyway.

Didn't push back. Just said "I'll have it done by Thursday." Sat with the anger afterward for about an hour. Eventually went for a walk around the block and that helped more than I expected. The fresh air just resets something.
""",

    """June 10, 2026 — Wednesday
[Mood score: 6/10]

Better day. Worked from the coffee shop instead of home and it made a huge difference — fewer distractions, something about having ambient noise around other people working. Got through most of the backlog. Talked to Arjun after lunch about yesterday's call and just naming what happened out loud helped it feel smaller.

Feeling cautiously okay. Will see how Thursday goes.
""",

    """June 11, 2026 — Thursday
[Mood score: 4/10]

Submitted the work. Priya's response was "okay" — one word. No acknowledgment of the late nights or the actual fix I had to engineer around the broken API. Just "okay." I know I should let it go but I felt this flat, heavy disappointment. Like I'd been grinding all week for nothing.

Ran in the evening for the first time in two weeks. Legs felt terrible but my head was clearer after. Put on a podcast while cooking and that helped too. By 9pm I was genuinely fine. Weird how the body can fix things the mind can't.
""",

    """June 14, 2026 — Sunday
[Mood score: 2/10]

Sunday night. The familiar dread starting around 5pm, getting heavier as the evening goes on. It's not even about anything specific — just this background hum of "tomorrow starts another week" and all the things that could go wrong. Priya's project review is Monday morning. I keep rehearsing what she might say.

Tried watching TV but couldn't focus. The anxious hum is just there, underneath everything. Ended up writing a list of what I want to say tomorrow if she goes straight to blame again. That helped a little — like I can at least imagine having words ready instead of freezing.
""",

    """June 15, 2026 — Monday
[Mood score: 5/10]

The review went better than I'd dreaded. Priya was actually more neutral than usual — maybe she was busy with something else. I had my points ready and managed to actually say one of them (that the API issue was documented in the ticket). She acknowledged it. Small win but I'll take it.

Went for a run at lunch which I never do on Mondays. The afternoon felt lighter for it.
""",

    # ── Week 2 ────────────────────────────────────────────────────────────────

    """June 16, 2026 — Tuesday
[Mood score: 7/10]

Good day. Worked with Mihail on the new data pipeline and it was genuinely fun — the kind of collaboration where you finish each other's thoughts and the code comes out better than either of you would've written alone. Had a long lunch. Felt proud of what we shipped.

Noticed I feel differently when work feels collaborative vs solo. With Priya it's always surveillance; with Mihail it's partnership. Stark contrast.
""",

    """June 17, 2026 — Wednesday
[Mood score: 6/10]

Middling day. Nothing bad, nothing great. Got a lot of solo work done. Had a video call with my sister in the evening which lifted my mood more than I expected — I forget how much her energy charges me up. Should call more often.

Small note: skipped the run today and by evening I had this restless, low-grade irritability that I couldn't quite place. Might be connected.
""",

    """June 19, 2026 — Friday
[Mood score: 8/10]

Best day in a while. Shipped a feature I'd been quietly proud of, got genuine positive feedback from the product manager (not Priya's team), and left work on time for once. Went to the gym with Karan. Felt genuinely good — that clean tired that's different from the depleted tired I usually feel.

Moments like today are what I want more of. Collaboration, shipping things that matter, physical movement, ending at a reasonable hour.
""",

    """June 21, 2026 — Sunday
[Mood score: 3/10]

Sunday evening dread again. It's almost clockwork — the heaviness comes in around sunset. This week I at least recognized it earlier. Went for a walk before the anxiety could fully set in, which blunted it a bit. Still there but less crushing.

Priya sent a Slack message at 8pm about Monday's standup. Of course she did. The anxiety spiked immediately. I'm noticing that even seeing her name in a notification changes something in my body before I've read the message.
""",

    """June 22, 2026 — Monday
[Mood score: 4/10]

Standup was fine. Priya asked one pointed question, I answered it clearly. But I spent the whole morning waiting for the next shoe to drop, which meant I wasn't really present for the first two hours of actual work. Anxious anticipation costs more energy than the thing I'm dreading.

Ran after work. Better by evening. Called Arjun. He pointed out that I've been talking about Priya calls with this specific dread for months now. He's right. It's become its own pattern.
""",

    # ── Week 3 ────────────────────────────────────────────────────────────────

    """June 24, 2026 — Wednesday
[Mood score: 5/10]

Mid-week check. Nothing dramatic. The work is okay, the days blur a bit. Skipped running for three days and I can feel it — there's a restlessness in my evenings that I can't sit still through. It's subtle but real.

Had a long async conversation with Priya about scope changes. Somehow the async format is easier — I can read, think, then respond instead of freezing when she goes on the attack. Might ask for more async communication going forward.
""",

    """June 25, 2026 — Thursday
[Mood score: 7/10]

Ran this morning before work for the first time in a while. The day was just better. I don't know how to say it more scientifically than that — the same tasks that felt grinding yesterday felt manageable today. Finished early, spent an hour reading a book in the afternoon. Felt human.

Thinking about the pattern I keep noticing: run → better day. It's not complicated. I just have to actually do it.
""",

    """June 26, 2026 — Friday
[Mood score: 6/10]

Solid week ending. Had a call with Priya — she was less combative, more focused on problem-solving. I wonder if the async notes I've been sending changed the dynamic slightly by giving her written context before calls. Or maybe she's just in a better mood this week. Hard to know.

Noticed I felt less dread going into the call than usual. Maybe because I had my points documented. Writing things down beforehand genuinely seems to help me.
""",

    """June 28, 2026 — Sunday
[Mood score: 5/10]

Sunday, and the dread is milder than usual — maybe a 4 instead of the usual 7. Went for a run at 4pm which I think intercepted it before it could take hold. Had dinner with family, which helps ground me. 

I'm starting to think Sunday anxiety is partly about isolation — spending the day alone makes the evening feel heavier. The weeks I've been around people during the day, the dread is smaller.
""",

    """June 29, 2026 — Monday
[Mood score: 5/10]

Sprint planning day. Priya ran it efficiently, no personal friction. I got to present one item I'd prepared for, and it landed well. Felt more like myself in that room than I have in weeks.

Arjun mentioned I seem less tense lately. I told him about the write-before-the-call habit and the morning runs. He said "those are both things you can control" and that reframe actually helped. The Priya stuff isn't controllable. The run and the prep are.
""",

    """July 1, 2026 — Wednesday
[Mood score: 6/10]

Good collaborative session with Mihail again. We finished the auth refactor and it feels clean. That specific combination — interesting technical problem + someone I trust + visible progress — is reliably good for my mood. I want to engineer more situations like that.

Skipped running, felt a bit flat in the evening. But overall a net positive day. Talked to my sister again. She's good at making me laugh.
""",

    """July 2, 2026 — Thursday
[Mood score: 3/10]

Today was rough. Had a call with Priya about the deployment timeline and it completely threw me off. I walked in already stressed because I'd been up till 2am fixing the auth bug, and then she opens with "why isn't this done yet" instead of even asking how the debugging went. 

I felt this hot flash of anger first — actual heat in my chest — but under that I think it was hurt. Like she didn't even notice I'd been grinding on this alone all week. I tried to explain the blocker was on the API side, not mine, but she kept talking over me, and I just went quiet. I hate when I do that.

Afterward the anger faded into something heavier — kind of like shame. And underneath that there's this anxious hum, like I'm dreading the next call with her, replaying it, thinking of all the things I should've said.

What actually helps: writing down what I want to say BEFORE the call so I don't freeze. Talking to Arjun about it after usually calms me down faster than sitting alone does.
""",
]
