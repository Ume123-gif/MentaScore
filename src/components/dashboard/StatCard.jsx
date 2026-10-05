export default function StatCard({ label, value, unit }) {
  return (
    <div className="card stat-card">
      <p className="section-heading">{label}</p>
      <p></p>
      <p className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>
    </div>
  )
}
