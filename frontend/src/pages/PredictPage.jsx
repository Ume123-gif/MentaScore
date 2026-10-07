import { useState } from 'react'
import PredictionForm from '../components/form/PredictionForm.jsx'
import ResultPanel from '../components/result/ResultPanel.jsx'
import { predictMentalHealthScore } from '../services/predictionService.js'
import './PredictPage.css'

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formValues, setFormValues] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(values) {
    setIsLoading(true)
    setError(null)
    setFormValues(values)
    try {
      const prediction = await predictMentalHealthScore(values)
      setResult(prediction)
    } catch (err) {
      setError('Could not get a prediction right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setFormValues(null)
    setError(null)
  }

  return (
    <div className="predict-page">
      <div className="predict-intro">
        <p className="section-heading">Mental health score prediction</p>
        <h1>See what your habits say about your well-being</h1>
        <p className="muted predict-lede">
          Fill in a snapshot of your daily habits below. The model — trained on survey data from
          5,000 respondents — estimates a continuous well-being score and points to the factors
          behind it.
        </p>
      </div>

      <div className="predict-layout">
        <div className="predict-form-col">
          <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
          {error && <p className="predict-error">{error}</p>}
        </div>

        <div className="predict-result-col">
          {result && formValues ? (
            <ResultPanel result={result} formValues={formValues} onReset={handleReset} />
          ) : (
            <div className="predict-placeholder card">
              <p className="section-heading">Your result</p>
              <p className="muted">
                Fill in the form and submit it to see your estimated score, the factors behind it,
                and a few tailored suggestions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
