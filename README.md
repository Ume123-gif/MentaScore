# MindMetrics — Frontend

React (Vite) frontend for **MindMetrics: AI-Based Mental Health Score Prediction System**.
Covers Module 4 (Web Interface) from the project plan: a form that collects lifestyle/digital
habit inputs, shows a predicted well-being score with wellness suggestions, and a dashboard of
insights computed from the training dataset (`mindmet.csv`, 5,000 rows).

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  components/
    layout/       Navbar, Footer
    form/         PredictionForm + reusable field controls
    result/       ScoreDial (SVG gauge), ResultPanel, SuggestionList
    dashboard/    StatCard, BarInsight, ScatterInsight, CorrelationStrip
  pages/
    PredictPage.jsx      "Check your score" tab
    DashboardPage.jsx    "Dataset insights" tab
  services/
    predictionService.js  <-- ONLY file the ML/backend integration touches
  utils/
    wellnessEngine.js     rule-based suggestion + verdict logic
  data/
    edaInsights.json      precomputed aggregates from mindmet.csv
  styles/
    global.css             design tokens (colors, type, spacing)
```

## Connecting the real backend model

Everything currently runs on a **client-side linear approximation** fitted offline on
`mindmet.csv` (see the comments in `predictionService.js`) so the UI is fully demoable without
waiting on the ML/backend team. Score ≈ intercept + weighted sum of the same numeric/ordinal
features described in the project's Module 3 (sleep, stress, usage, study hours, activity, age,
academic level). R² on the full dataset ≈ 0.71 — good enough for a realistic-feeling demo, **not**
a substitute for the trained model.

To switch to the real API once Module 4's backend is deployed:

1. In `src/services/predictionService.js`, set `USE_MOCK = false`.
2. Set `VITE_API_BASE_URL` in a `.env` file (copy `.env.example`) to point at the deployed
   Flask/FastAPI service.
3. Make sure the backend's `/api/predict` route accepts a POST body shaped like:

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academicLevel": "Undergraduate",
  "mostUsedPlatform": "Instagram",
  "purposeOfUse": "Entertainment",
  "avgDailyUsageHours": 4.5,
  "dailyUnlocks": 150,
  "studyHours": 3,
  "physicalActivityHours": 1.5,
  "sleepHoursPerNight": 7,
  "stressLevel": "Medium"
}
```

   and responds with:

```json
{
  "score": 6.8,
  "contributions": [
    { "label": "Sleep", "value": 0.31 },
    { "label": "Stress level", "value": -0.18 }
  ],
  "source": "backend-model"
}
```

`contributions` is optional (used to show "what moved this score most" — if the real model uses
SHAP per Module 3, this is a natural place to plug those values in). Nothing else in the app needs
to change; every screen already consumes `predictMentalHealthScore()`'s return value only.

## Dataset insights dashboard

`src/data/edaInsights.json` was generated once, offline, from `mindmet.csv` with pandas
(group-by averages, Pearson correlations, and two 150-point samples for the scatter plots). If the
dataset changes, regenerate this file — the dashboard components don't compute anything
themselves, they just render whatever is in `edaInsights.json`.

## Notes for the team

- No backend calls happen yet by default (`USE_MOCK = true`), so this can be developed and
  demoed independently of Modules 1–3.
- The form's dropdown options (countries, platforms, etc.) are pulled from the actual dataset's
  unique values, so they'll always match what the model was trained on.
- This is positioned as an **awareness / self-reflection tool**, not a diagnostic — see the
  footer disclaimer and keep that framing in any copy changes.
