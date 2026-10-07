import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <p>
        Avg score: <strong>{payload[0].value}</strong>
      </p>
      <p className="muted">{payload[0].payload.count} respondents</p>
    </div>
  )
}

export default function BarInsight({ title, description, data, barColor = 'var(--amber-deep)' }) {
  return (
    <div className="card insight-card">
      <p className="section-heading">{title}</p>
      {description && <p className="muted insight-desc">{description}</p>}
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line-soft)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: 'var(--ink-soft)' }}
              axisLine={{ stroke: 'var(--line)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: 'var(--ink-soft)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--mist-deep)' }} />
            <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={46}>
              {data.map((entry, index) => (
                <Cell key={index} fill={barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
