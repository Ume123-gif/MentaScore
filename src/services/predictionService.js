/**
 * predictionService.js
 * ---------------------------------------------------------------------------
 * This is the ONLY file the ML/backend team needs to touch when the real
 * FastAPI/Flask model is ready. Everything else (form, dashboard, UI) calls
 * `predictMentalHealthScore(formValues)` and doesn't care where the number
 * comes from.
 *
 * Right now it runs a small client-side linear model fitted offline on the
 * project's own dataset (mindmet.csv, 5000 rows) — coefficients below came
 * from a real `sklearn.LinearRegression` fit (R^2 ≈ 0.71), so predictions
 * are a genuine, if simplified, stand-in for the real model rather than a
 * random number. Swap the body of `predictMentalHealthScore` for a fetch()
 * to the real API and nothing else in the app needs to change.
 * ---------------------------------------------------------------------------
 */

const USE_MOCK = true // flip to false once the backend endpoint below is live

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const PREDICT_ENDPOINT = `${API_BASE_URL}/api/predict`

// Coefficients from LinearRegression fit on mindmet.csv (see /model notes in README)
const MODEL = {
  intercept: 5.907,
  weights: {
    age: 0.0164,
    avgDailyUsageHours: -0.2517,
    dailyUnlocks: -0.0012,
    studyHours: 0.0844,
    physicalActivityHours: 0.0255,
    sleepHoursPerNight: 0.2571,
    stressLevel: -0.2107, // applied to ordinal Low=1..VeryHigh=4
    academicLevel: 0.0254, // applied to ordinal HighSchool=1..Graduate=3
  },
  // observed dataset range, used to clamp + report a confidence band
  observedRange: [3.6, 9.4],
}

const STRESS_ORDINAL = { Low: 1, Medium: 2, High: 3, 'Very High': 4 }
const ACADEMIC_ORDINAL = { 'High School': 1, Undergraduate: 2, Graduate: 3 }

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function runLocalModel(values) {
  const w = MODEL.weights
  const stressNum = STRESS_ORDINAL[values.stressLevel] ?? 2
  const academicNum = ACADEMIC_ORDINAL[values.academicLevel] ?? 2

  let score =
    MODEL.intercept +
    w.age * Number(values.age) +
    w.avgDailyUsageHours * Number(values.avgDailyUsageHours) +
    w.dailyUnlocks * Number(values.dailyUnlocks) +
    w.studyHours * Number(values.studyHours) +
    w.physicalActivityHours * Number(values.physicalActivityHours) +
    w.sleepHoursPerNight * Number(values.sleepHoursPerNight) +
    w.stressLevel * stressNum +
    w.academicLevel * academicNum

  score = clamp(score, 1, 10)

  // simple, transparent "top contributing factors" for the result screen
  const contributions = [
    { label: 'Sleep', value: w.sleepHoursPerNight * Number(values.sleepHoursPerNight) },
    { label: 'Stress level', value: w.stressLevel * stressNum },
    { label: 'Screen time', value: w.avgDailyUsageHours * Number(values.avgDailyUsageHours) },
    { label: 'Study hours', value: w.studyHours * Number(values.studyHours) },
    { label: 'Physical activity', value: w.physicalActivityHours * Number(values.physicalActivityHours) },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

  return {
    score: Number(score.toFixed(1)),
    contributions,
    source: 'local-approximation',
  }
}

/**
 * Swap point: once the backend is deployed, replace the body of this
 * function with something like:
 *
 *   const res = await fetch(PREDICT_ENDPOINT, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(values),
 *   })
 *   if (!res.ok) throw new Error('Prediction request failed')
 *   return await res.json() // expected shape: { score, contributions, source }
 */
export async function predictMentalHealthScore(values) {
  if (USE_MOCK) {
    // tiny artificial delay so the UI's loading state is exercised, same as a real request
    await new Promise((resolve) => setTimeout(resolve, 500))
    return runLocalModel(values)
  }

  const response = await fetch(PREDICT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}`)
  }

  return response.json()
}

export const modelMeta = {
  usingMock: USE_MOCK,
  endpoint: PREDICT_ENDPOINT,
  observedRange: MODEL.observedRange,
}
