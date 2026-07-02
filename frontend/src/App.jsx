import { useState } from 'react'
import Journal from './pages/Journal'
import Patterns from './pages/Patterns'
import Ask from './pages/Ask'

const PAGES = ['journal', 'patterns', 'ask']

export default function App() {
  const [page, setPage] = useState('journal')

  return (
    <div className="app-shell">
      {/* Navigation */}
      <nav className="nav">
        <a className="nav-logo" href="#" onClick={(e) => { e.preventDefault(); setPage('journal'); }}>
          <div className="nav-logo-icon">🧠</div>
          <span className="nav-logo-text">Reflekt</span>
        </a>

        <div className="nav-links">
          <button
            className={`nav-link${page === 'journal' ? ' active' : ''}`}
            onClick={() => setPage('journal')}
            id="nav-journal"
          >
            ✍️ Journal
          </button>
          <button
            className={`nav-link${page === 'patterns' ? ' active' : ''}`}
            onClick={() => setPage('patterns')}
            id="nav-patterns"
          >
            🔍 Patterns
          </button>
          <button
            className={`nav-link${page === 'ask' ? ' active' : ''}`}
            onClick={() => setPage('ask')}
            id="nav-ask"
          >
            💬 Ask Memory
          </button>
        </div>
      </nav>

      {/* Pages */}
      {page === 'journal' && <Journal />}
      {page === 'patterns' && <Patterns />}
      {page === 'ask' && <Ask />}
    </div>
  )
}
