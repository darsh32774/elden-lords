import { useState, useRef } from 'react'

const API = 'http://localhost:8000'

const SUGGESTED_QUESTIONS = [
  'What patterns repeat around times I felt drained or low?',
  'What helped me feel better in the past?',
  'Who or what triggered my stress most often?',
  'When did I feel genuinely good, and what was happening then?',
  'What do I do when I\'m avoiding something difficult?',
  'What does a good day look like for me, based on my entries?',
]

export default function Ask() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  const askMemory = async (q) => {
    const question = q || query.trim()
    if (!question) return

    setLoading(true)
    setError(null)
    const thisQuery = question
    setQuery('')

    try {
      const res = await fetch(`${API}/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: thisQuery }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()

      const newEntry = {
        question: thisQuery,
        results: data.results || [],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setHistory((prev) => [newEntry, ...prev])
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askMemory()
    }
  }

  return (
    <main className="page animate-in">
      <div className="page-header">
        <div className="page-eyebrow">Graph Query</div>
        <h1 className="page-title">Ask your memory anything</h1>
        <p className="page-subtitle">
          Cognee searches across all your journal entries using graph traversal and semantic recall.
          Ask about patterns, people, feelings — anything you've written about.
        </p>
      </div>

      <div className="disclaimer">
        💬 <strong>Recall, not advice.</strong> Answers come from your own words.
        Reflekt surfaces what you wrote — it doesn't generate opinions or prescribe actions.
      </div>

      {/* Suggested questions */}
      <h2 className="section-heading">Try asking</h2>
      <div className="suggestion-pills">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            className="suggestion-pill"
            onClick={() => askMemory(q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      <hr className="section-divider" />

      {/* Input row */}
      <div className="chat-input-row">
        <textarea
          ref={inputRef}
          id="ask-memory-input"
          className="chat-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="What do you want to know about your emotional patterns? (Enter to send)"
          rows={2}
        />
        <button
          id="ask-submit-btn"
          className="btn btn-teal"
          onClick={() => askMemory()}
          disabled={loading || !query.trim()}
          style={{ height: '52px' }}
        >
          {loading ? '⏳' : '→'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="orb-wrapper animate-in">
          <div className="orb" style={{ background: 'radial-gradient(circle at 35% 35%, #67e8f9, #06b6d4)' }} />
          <p className="orb-text">Searching your memory graph…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="toast toast-error animate-in" style={{ marginTop: '1rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          {history.map((entry, i) => (
            <div key={i} className="animate-in" style={{ marginBottom: '2rem', animationDelay: `${i * 30}ms` }}>
              {/* Question bubble */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '10px',
                gap: '8px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  background: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: '14px 14px 4px 14px',
                  padding: '10px 16px',
                  maxWidth: '75%',
                  fontSize: '0.9rem',
                  color: 'var(--accent-light)',
                  lineHeight: 1.5,
                }}>
                  {entry.question}
                </div>
                <span style={{ fontSize: '1.2rem', marginTop: '4px' }}>🤔</span>
              </div>

              {/* Answer */}
              {entry.results.length === 0 ? (
                <div className="chat-result" style={{ color: 'var(--text-muted)' }}>
                  Nothing found for this query. Try adding more journal entries or rephrasing.
                </div>
              ) : (
                <div>
                  {entry.results.map((r, j) => (
                    <div key={j} className="chat-result" style={{ marginBottom: j < entry.results.length - 1 ? '8px' : 0 }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>🧠</span>
                        <p style={{ margin: 0 }}>{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {entry.timestamp}
              </div>

              {i < history.length - 1 && <hr className="section-divider" style={{ margin: '1.5rem 0 0' }} />}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 && !loading && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">💭</div>
          <p className="empty-state-text">
            Your conversation with your memory graph will appear here.<br />
            Start by clicking one of the suggested questions above.
          </p>
        </div>
      )}
    </main>
  )
}
