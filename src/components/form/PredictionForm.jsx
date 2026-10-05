import { useState } from 'react'
import { SelectField, SliderField, NumberField } from './FormField.jsx'
import edaInsights from '../../data/edaInsights.json'
import './FormField.css'
import './PredictionForm.css'

const { formOptions } = edaInsights

const initialValues = {
  age: 21,
  gender: formOptions.genders[0],
  country: 'Other',
  academicLevel: 'Undergraduate',
  mostUsedPlatform: 'Instagram',
  purposeOfUse: 'Entertainment',
  avgDailyUsageHours: 4.5,
  dailyUnlocks: 150,
  studyHours: 3,
  physicalActivityHours: 1.5,
  sleepHoursPerNight: 7,
  stressLevel: 'Medium',
}

export default function PredictionForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(initialValues)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <fieldset className="form-section">
        <legend>
          <h3>About you</h3>
          <p className="muted">Basic demographic context the model was trained on.</p>
        </legend>
        <div className="field-grid">
          <NumberField
            label="Age"
            value={values.age}
            min={formOptions.ranges.age[0]}
            max={formOptions.ranges.age[1]}
            onChange={(v) => update('age', v)}
          />
          <SelectField
            label="Gender"
            value={values.gender}
            options={formOptions.genders}
            onChange={(v) => update('gender', v)}
          />
          <SelectField
            label="Country"
            value={values.country}
            options={formOptions.countries}
            onChange={(v) => update('country', v)}
          />
          <SelectField
            label="Academic level"
            value={values.academicLevel}
            options={formOptions.academicLevels}
            onChange={(v) => update('academicLevel', v)}
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <h3>Digital habits</h3>
          <p className="muted">How you typically use your phone and social platforms.</p>
        </legend>
        <div className="field-grid">
          <SelectField
            label="Most used platform"
            value={values.mostUsedPlatform}
            options={formOptions.platforms}
            onChange={(v) => update('mostUsedPlatform', v)}
          />
          <SelectField
            label="Primary purpose of use"
            value={values.purposeOfUse}
            options={formOptions.purposes}
            onChange={(v) => update('purposeOfUse', v)}
          />
          <SliderField
            label="Average daily usage"
            value={values.avgDailyUsageHours}
            min={0}
            max={12}
            step={0.1}
            unit="h"
            onChange={(v) => update('avgDailyUsageHours', v)}
          />
          <SliderField
            label="Daily phone unlocks"
            value={values.dailyUnlocks}
            min={0}
            max={300}
            step={1}
            onChange={(v) => update('dailyUnlocks', v)}
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <h3>Lifestyle & wellbeing</h3>
          <p className="muted">The factors most strongly linked to your score.</p>
        </legend>
        <div className="field-grid">
          <SliderField
            label="Study hours per day"
            value={values.studyHours}
            min={0}
            max={12}
            step={0.1}
            unit="h"
            onChange={(v) => update('studyHours', v)}
          />
          <SliderField
            label="Physical activity per day"
            value={values.physicalActivityHours}
            min={0}
            max={6}
            step={0.1}
            unit="h"
            onChange={(v) => update('physicalActivityHours', v)}
          />
          <SliderField
            label="Sleep per night"
            value={values.sleepHoursPerNight}
            min={0}
            max={12}
            step={0.1}
            unit="h"
            onChange={(v) => update('sleepHoursPerNight', v)}
          />
          <SelectField
            label="Perceived stress level"
            value={values.stressLevel}
            options={formOptions.stressLevels}
            onChange={(v) => update('stressLevel', v)}
          />
        </div>
      </fieldset>

      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Estimating your score…' : 'Get my well-being score'}
      </button>
    </form>
  )
}
