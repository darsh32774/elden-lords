import { useState } from 'react'

const API = 'http://localhost:8000'

const PATTERN_TYPES = {
  0: { label: 'Correlation', cls: 'correlation' },
  1: { label: 'Coping Strategy', cls: 'coping' },
  2: { label: 'Trigger', cls: 'trigger' },
  3: { label: 'Bright Spot', cls: 'positive' },
}

function classifyPattern(finding, queryIndex) {
  return PATTERN_TYPES[queryIndex % 4]
}

export default function Patterns() {
  const [patterns, setPatterns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const loadPatterns = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/patterns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focus: 'low mood, drained, anxious, stressed' }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setPatterns(data.patterns || [])
      setLoaded(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group patterns by type
  const grouped = {
    correlation: [],
    coping: [],
    trigger: [],
    positive: [],
  }

  patterns.forEach((p, i) => {
    const { cls } = classifyPattern(p.finding, i)
    grouped[cls].push(p)
  })

  const hasData = patterns.length > 0

  return (
    <main className="page animate-in">
      <div className="page-header">
        <div className="page-eyebrow">Graph Traversal</div>
        <h1 className="page-title">What does your memory know?</h1>
        <p className="page-subtitle">
          Reflekt runs your journal entries through Cognee's knowledge graph and surfaces
          correlated patterns — not diagnoses. You see the connections; you draw the meaning.
        </p>
      </div>

      <div className="disclaimer">
        📊 <strong>Correlations, not causes.</strong> These are patterns the graph found across your entries.
        They're observations, not explanations. You know your life better than any algorithm does.
      </div>

      {/* Action */}
      <div className="action-row">
        <button
          id="load-patterns-btn"
          className="btn btn-primary btn-lg"
          onClick={loadPatterns}
          disabled={loading}
        >
          {loading ? '⏳ Traversing graph…' : '🔍 Surface My Patterns'}
        </button>
        {hasData && (
          <button
            className="btn btn-secondary"
            onClick={() => { setPatterns([]); setLoaded(false); }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="orb-wrapper animate-in">
          <div className="orb" />
          <p className="orb-text">Cognee is traversing your memory graph…</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Running 4 graph queries · linking emotion nodes · surfacing correlations
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="toast toast-error animate-in">
          ⚠ {error}
          <div style={{ marginTop: 6, fontSize: '0.8rem' }}>
            Make sure the backend is running and you have journal entries (or click "Load Demo Data" on the Journal page first).
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && hasData && (
        <div className="animate-in">
          {/* Stats */}
          <div className="stats-row">
            <div className="stat-chip">
              <div className="stat-value">{patterns.length}</div>
              <div className="stat-label">Patterns found</div>
            </div>
            <div className="stat-chip">
              <div className="stat-value" style={{ color: '#f43f5e' }}>{grouped.trigger.length}</div>
              <div className="stat-label">Trigger patterns</div>
            </div>
            <div className="stat-chip">
              <div className="stat-value" style={{ color: '#10b981' }}>{grouped.coping.length}</div>
              <div className="stat-label">Coping strategies</div>
            </div>
            <div className="stat-chip">
              <div className="stat-value" style={{ color: '#06b6d4' }}>{grouped.positive.length}</div>
              <div className="stat-label">Bright spots</div>
            </div>
          </div>

          {/* Trigger patterns */}
          {grouped.trigger.length > 0 && (
            <section>
              <h2 className="section-heading">⚡ Recurring Triggers</h2>
              <div className="patterns-grid">
                {grouped.trigger.map((p, i) => (
                  <PatternCard key={`trig-${i}`} finding={p.finding} type="trigger" delay={i * 60} />
                ))}
              </div>
            </section>
          )}

          {/* Correlation patterns */}
          {grouped.correlation.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h2 className="section-heading">🔗 Correlated Patterns</h2>
              <div className="patterns-grid">
                {grouped.correlation.map((p, i) => (
                  <PatternCard key={`corr-${i}`} finding={p.finding} type="correlation" delay={i * 60} />
                ))}
              </div>
            </section>
          )}

          {/* Coping strategies */}
          {grouped.coping.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h2 className="section-heading">🌿 What's helped before</h2>
              <div className="patterns-grid">
                {grouped.coping.map((p, i) => (
                  <PatternCard key={`cope-${i}`} finding={p.finding} type="coping" delay={i * 60} />
                ))}
              </div>
            </section>
          )}

          {/* Positive moments */}
          {grouped.positive.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h2 className="section-heading">✨ Bright Spots</h2>
              <div className="patterns-grid">
                {grouped.positive.map((p, i) => (
                  <PatternCard key={`pos-${i}`} finding={p.finding} type="positive" delay={i * 60} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && loaded && patterns.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <p className="empty-state-text">
            No patterns found yet. Add more journal entries (or load demo data) and try again.<br />
            Patterns need multiple entries to emerge from the graph.
          </p>
        </div>
      )}

      {/* Initial prompt */}
      {!loading && !loaded && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕸️</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>
            Your memory graph is ready
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Once you have journal entries stored, Reflekt will run 4 graph traversal queries
            to surface emotional correlations, recurring triggers, and what's helped you before.
          </p>
        </div>
      )}
    </main>
  )
}

function PatternCard({ finding, type, delay = 0 }) {
  const typeLabels = {
    correlation: 'Correlated Pattern',
    coping: 'From your past — what helped',
    trigger: 'Recurring Trigger',
    positive: 'Bright Spot',
  }

  return (
    <div
      className={`pattern-card ${type} animate-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="pattern-card-type">{typeLabels[type]}</div>
      <p className="pattern-card-text">{finding}</p>
    </div>
  )
}
