export function SelectField({ label, value, onChange, options, name }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        className="field-control"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SliderField({ label, value, onChange, min, max, step = 0.1, unit = '' }) {
  return (
    <label className="field">
      <span className="field-label-row">
        <span className="field-label">{label}</span>
        <span className="field-value">
          {value}
          {unit}
        </span>
      </span>
      <input
        className="field-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="field-range">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </span>
    </label>
  )
}

export function NumberField({ label, value, onChange, min, max }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="field-control"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // Preserve an empty field while editing; parse non-empty values for prediction.
          onChange(val === '' ? '' : Number(val));
        }}
      />
    </label>
  )
}
