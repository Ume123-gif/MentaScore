import ScoreDial from './ScoreDial.jsx'
import SuggestionList from './SuggestionList.jsx'
import { getScoreVerdict, getWellnessSuggestions } from '../../utils/wellnessEngine.js'
import './ResultPanel.css'

export default function ResultPanel({ result, formValues, onReset }) {
  const verdict = getScoreVerdict(result.score)
  const suggestions = getWellnessSuggestions(formValues)

  return (
    <div className="result-panel card">
      <div className="result-top">
        <ScoreDial score={result.score} tone={verdict.tone} />
        <div className="result-verdict">
          <p className="section-heading">Your estimated score</p>
          <h2>{verdict.label}</h2>
          <p className="muted">{verdict.description}</p>
        </div>
      </div>

      <div className="result-contributions">
        <p className="section-heading">What moved this score most</p>
        <ul className="contribution-list">
          {result.contributions.slice(0, 3).map((c) => (
            <li key={c.label} className={c.value >= 0 ? 'is-positive' : 'is-negative'}>
              <span>{c.label}</span>
              <span className="contribution-sign">{c.value >= 0 ? 'Helping' : 'Holding back'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="result-suggestions">
        <p className="section-heading">Suggestions worth trying</p>
        <SuggestionList suggestions={suggestions} />
      </div>

      <button className="reset-btn" onClick={onReset}>
        Try different inputs
      </button>
    </div>
  )
}
