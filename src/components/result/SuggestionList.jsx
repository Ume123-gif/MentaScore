import './SuggestionList.css'

export default function SuggestionList({ suggestions }) {
  return (
    <ul className="suggestion-list">
      {suggestions.map((s) => (
        <li key={s.title} className="suggestion-item">
          <span className="suggestion-tag">{s.tag}</span>
          <div>
            <p className="suggestion-title">{s.title}</p>
            <p className="suggestion-detail muted">{s.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
