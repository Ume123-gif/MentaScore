const LABELS = {
  Avg_Daily_Usage_Hours: 'Daily usage hours',
  Daily_Unlocks: 'Daily unlocks',
  Sleep_Hours_Per_Night: 'Sleep per night',
  Study_Hours: 'Study hours',
  Physical_Activity_Hours: 'Physical activity',
  Age: 'Age',
}

export default function CorrelationStrip({ correlations }) {
  const max = Math.max(...correlations.map((c) => Math.abs(c.corr)))

  return (
    <div className="card insight-card">
      <p className="section-heading">Correlation with well-being score</p>
      <p className="muted insight-desc">
        How strongly each lifestyle factor moves with the score (Pearson correlation, −1 to 1).
      </p>
      <div className="correlation-strip">
        {correlations.map((c) => {
          const widthPct = (Math.abs(c.corr) / max) * 100
          const isPositive = c.corr >= 0
          return (
            <div className="correlation-row" key={c.feature}>
              <span className="correlation-label">{LABELS[c.feature] || c.feature}</span>
              <div className="correlation-track">
                <div
                  className={`correlation-fill ${isPositive ? 'is-positive' : 'is-negative'}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span className="correlation-value">{c.corr.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
