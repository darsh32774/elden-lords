import { useState } from 'react'

const API = 'http://localhost:8000'

const PLACEHOLDER = `Today was rough. Had a call with my manager about the timeline and it completely threw me off — I'd been up till 2am fixing the bug and she opened with "why isn't this done yet" before even asking how it went.

I felt this flash of anger first, but under that I think it was hurt. I tried to explain but just went quiet. I hate when I do that.

Went for a walk afterward and it helped more than I expected...`

const MOOD_EMOJIS = ['😔', '😞', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩']

function getMoodColor(score) {
  if (score <= 3) return '#f43f5e'
  if (score <= 5) return '#f59e0b'
  if (score <= 7) return '#06b6d4'
  return '#10b981'
}

export default function Journal() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState(5)
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      showToast('Write something first — even a few sentences.', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          mood_score: mood,
          date_label: new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      showToast(`Saved to your memory graph (${data.chars_stored} chars indexed)`, 'success')
      setText('')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch(`${API}/seed`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      showToast(data.message, 'success')
    } catch (err) {
      showToast(`Seed failed: ${err.message}`, 'error')
    } finally {
      setSeeding(false)
    }
  }

  const handleForget = async () => {
    if (!confirm('Clear ALL memory from your graph? This cannot be undone.')) return
    try {
      await fetch(`${API}/forget`, { method: 'DELETE' })
      showToast('Memory cleared. Fresh start.', 'info')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    }
  }

  const moodColor = getMoodColor(mood)
  const sliderBg = `linear-gradient(to right, ${moodColor} 0%, ${moodColor} ${(mood - 1) * 11.1}%, rgba(255,255,255,0.08) ${(mood - 1) * 11.1}%, rgba(255,255,255,0.08) 100%)`

  return (
    <main className="page animate-in">
      <div className="page-header">
        <div className="page-eyebrow">Your Private Space</div>
        <h1 className="page-title">Write what's on your mind</h1>
        <p className="page-subtitle">
          Reflekt remembers what you write — not just the words, but the emotions,
          people, and patterns woven through them. Over time, it surfaces what you can't see from inside the day.
        </p>
      </div>

      <div className="disclaimer">
        🔒 <strong>Reflection tool, not a therapist.</strong> Reflekt surfaces patterns from your own words.
        If things feel genuinely heavy, please reach out to someone you trust or a professional.
      </div>

      {/* Action row */}
      <div className="action-row">
        <button
          id="seed-demo-btn"
          className="btn btn-secondary"
          onClick={handleSeed}
          disabled={seeding}
        >
          {seeding ? '⏳ Seeding…' : '🌱 Load Demo Data (3 weeks)'}
        </button>
        <button
          id="forget-btn"
          className="btn btn-danger btn-sm"
          onClick={handleForget}
        >
          🗑 Clear Memory
        </button>
      </div>

      {/* Journal card */}
      <div className={`card ${text.length > 50 ? 'card-glow' : ''}`}>
        <textarea
          id="journal-entry-input"
          className="journal-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={9}
        />

        {/* Mood slider */}
        <div className="mood-section">
          <div className="mood-label">
            <span className="mood-label-text">How are you feeling today?</span>
            <div
              className="mood-score-badge"
              style={{ background: `${moodColor}20`, borderColor: moodColor, color: moodColor }}
            >
              {mood}
            </div>
          </div>
          <input
            id="mood-slider"
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="mood-slider"
            style={{ background: sliderBg }}
          />
          <div className="mood-emojis">
            {MOOD_EMOJIS.map((e, i) => (
              <span
                key={i}
                style={{ opacity: i === mood - 1 ? 1 : 0.3, transition: 'opacity 0.2s', cursor: 'pointer', fontSize: i === mood - 1 ? '1.4rem' : '1.1rem' }}
                onClick={() => setMood(i + 1)}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            id="submit-journal-btn"
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <span style={{ animation: 'orbPulse 1s infinite' }}>⏳</span>
                Adding to graph…
              </>
            ) : (
              <>✨ Save to Memory Graph</>
            )}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type} animate-in`}>
          {toast.type === 'success' && '✓ '}{toast.message}
        </div>
      )}

      {/* How it works */}
      <hr className="section-divider" />
      <h2 className="section-heading">How Reflekt works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {[
          { icon: '📝', title: 'You write', desc: 'Freeform journal entries — no structure required.' },
          { icon: '🕸️', title: 'Cognee graphs it', desc: 'Emotions, people, events, and actions become graph nodes and edges.' },
          { icon: '🔍', title: 'Patterns surface', desc: 'After multiple entries, correlated patterns emerge from the graph.' },
          { icon: '💡', title: 'You decide', desc: 'Reflekt presents evidence. You draw the conclusions — it\'s your life.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
