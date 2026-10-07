import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ScatterInsight({ title, description, data, xLabel, dotColor = 'var(--moss)' }) {
  return (
    <div className="card insight-card">
      <p className="section-heading">{title}</p>
      {description && <p className="muted insight-desc">{description}</p>}
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--line-soft)" />
            <XAxis
              dataKey="x"
              name={xLabel}
              type="number"
              tick={{ fontSize: 12, fill: 'var(--ink-soft)' }}
              axisLine={{ stroke: 'var(--line)' }}
              tickLine={false}
            />
            <YAxis
              dataKey="y"
              name="Score"
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: 'var(--ink-soft)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid var(--line-soft)',
                fontSize: 12,
              }}
            />
            <Scatter data={data} fill={dotColor} fillOpacity={0.55} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
