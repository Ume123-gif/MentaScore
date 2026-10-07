# MentaScore

**MentaScore: AI-Based Mental Health Score Prediction System** contains a React/Vite frontend and
a Python model-training workflow. The frontend collects lifestyle and digital habit inputs,
shows an estimated well-being score, and displays insights from the 5,000-row training dataset.

## Frontend

Run these commands from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

The app opens at `http://localhost:5173`.

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

## Run the backend API

After creating the repository-root `venv` and installing `backend\requirements.txt` as described
below, start the API from the `backend/` directory:

```powershell
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Run the frontend in a separate terminal using the commands above. The prediction form sends
requests to `http://localhost:8000/api/predict`; the API documentation is at
`http://localhost:8000/docs`.

## Project structure

```
frontend/
  src/                    React application, prediction service, and dashboard data
  package.json
backend/
  app/
    main.py
    model.py
    schemas.py
  data/
    Student Social Media And Mental Health Impact.csv
  models/
    Mental_Health_Model.pkl
  notebooks/
    Mental_Health_Score_model.ipynb
  requirements.txt
venv/                     Python environment (not committed)
```

## Connecting the real backend model

Everything currently runs on a **client-side linear approximation** fitted offline on
the training dataset (see the comments in `predictionService.js`) so the UI is fully demoable without
waiting on the ML/backend team. Score ≈ intercept + weighted sum of the same numeric/ordinal
features described in the project's Module 3 (sleep, stress, usage, study hours, activity, age,
academic level). R² on the full dataset ≈ 0.71 — good enough for a realistic-feeling demo, **not**
a substitute for the trained model.

To switch to the real API once Module 4's backend is deployed:

1. In `frontend/src/services/predictionService.js`, set `USE_MOCK = false`.
2. Set `VITE_API_BASE_URL` in `frontend/.env` (copy `frontend/.env.example`) to point at the deployed
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
SHAP per Module 3, this is a natural place to plug those values in). The UI shows a fallback when
the field is omitted.

The saved scikit-learn pipeline expects these dataframe columns: `Study_Hours`, `Age`,
`Avg_Daily_Usage_Hours`, `Daily_Unlocks`, `Physical_Activity_Hours`, `Sleep_Hours_Per_Night`,
`Stress_Level`, `Gender`, `Academic_Level`, `Most_Used_Platform`, `Purpose_Of_Use`, and
`Grouped_country`. The API can accept the camelCase fields shown above, but the backend must map
them to those names and convert `country` to one of the top 10 training countries or `Other`
before calling `predict`. The training CSV is available under `backend/data/` for this mapping.

## Dataset insights dashboard

`frontend/src/data/edaInsights.json` was generated once, offline, from the training CSV with pandas
(group-by averages, Pearson correlations, and two 150-point samples for the scatter plots). If the
dataset changes, regenerate this file — the dashboard components don't compute anything
themselves, they just render whatever is in `edaInsights.json`.

## Train the Python model

The notebook reads `backend/data/Student Social Media And Mental Health Impact.csv` and saves the
trained model to `backend/models/Mental_Health_Model.pkl`. It supports running with the working
directory set to the repository root, `backend/`, or `backend/notebooks/`.

In PowerShell, from the repository root, create and prepare the Python environment:

```powershell
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

If PowerShell blocks activation, run `..\venv\Scripts\python.exe -m pip install -r requirements.txt`
from `backend/`, or `venv\Scripts\python.exe -m pip install -r backend\requirements.txt` from the
repository root.

In VS Code, open `backend/notebooks/Mental_Health_Score_model.ipynb`, select the repository `venv`
Python 3.11 kernel, and choose **Run All**. The randomized search can take a few minutes. Re-run
the notebook whenever the training data or model code changes.

## Notes for the team

- No backend calls happen yet by default (`USE_MOCK = true`), so the frontend can be developed and
  demoed independently of Modules 1–3.
- The form's dropdown options (countries, platforms, etc.) are pulled from the actual dataset's
  unique values, so they'll always match what the model was trained on.
- This is positioned as an **awareness / self-reflection tool**, not a diagnostic — see the
  footer disclaimer and keep that framing in any copy changes.
