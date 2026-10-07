const TONE_COLORS = {
  positive: 'var(--moss)',
  neutral: 'var(--amber-deep)',
  caution: '#c98a3c',
  alert: 'var(--clay)',
}

// semi-circle gauge, score is on a 1..10 scale
export default function ScoreDial({ score, tone }) {
  const min = 1
  const max = 10
  const clamped = Math.min(max, Math.max(min, score))
  const fraction = (clamped - min) / (max - min)
  const angle = 180 * fraction // 0 = left (min), 180 = right (max)

  const cx = 110
  const cy = 110
  const r = 88

  const needleAngleRad = ((180 - angle) * Math.PI) / 180
  const needleX = cx + r * 0.72 * Math.cos(needleAngleRad)
  const needleY = cy - r * 0.72 * Math.sin(needleAngleRad)

  const color = TONE_COLORS[tone] || TONE_COLORS.neutral

  return (
    <svg width="220" height="140" viewBox="0 0 220 140" role="img" aria-label={`Score ${score} out of 10`}>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--mist-deep)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${fraction * Math.PI * r} ${Math.PI * r}`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: 'all 0.6s ease' }}
      />
      <circle cx={cx} cy={cy} r="6" fill="var(--ink)" />
      <text x={cx} y={cy - 24} textAnchor="middle" fontFamily="var(--font-display)" fontSize="30" fill="var(--ink)">
        {score.toFixed(1)}
      </text>
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily="var(--font-body)" fontSize="11" fill="var(--ink-soft)">
        out of 10
      </text>
    </svg>
  )
}
