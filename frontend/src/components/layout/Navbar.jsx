import './Navbar.css'

const TABS = [
  { id: 'predict', label: 'Check your score' },
  { id: 'dashboard', label: 'Dataset insights' },
]

export default function Navbar({ activeTab, onChangeTab }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M2 12.5c1.6 0 1.6-3 3.2-3s1.6 6 3.2 6 1.6-9 3.2-9 1.6 9 3.2 9 1.6-6 3.2-6 1.6 3 3.2 3"
                stroke="var(--amber-deep)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="navbar-title">MentaScore</span>
        </div>

        <nav className="navbar-tabs" aria-label="Primary">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`navbar-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => onChangeTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
