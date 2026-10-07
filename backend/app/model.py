from pathlib import Path

import joblib
import pandas as pd
import shap


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "Mental_Health_Model.pkl"
)

model = joblib.load(MODEL_PATH)

# Explain predictions in the transformed feature space used by the forest.
preprocessor = model.named_steps["preprocessor"]
rf_model = model.named_steps["random forest"]

explainer = shap.TreeExplainer(rf_model)


def prepare_model_input(data):
    return {
        "Study_Hours": data.studyHours,
        "Age": data.age,
        "Avg_Daily_Usage_Hours": data.avgDailyUsageHours,
        "Daily_Unlocks": data.dailyUnlocks,
        "Physical_Activity_Hours": data.physicalActivityHours,
        "Sleep_Hours_Per_Night": data.sleepHoursPerNight,
        "Stress_Level": data.stressLevel,
        "Gender": data.gender,
        "Academic_Level": data.academicLevel,
        "Most_Used_Platform": data.mostUsedPlatform,
        "Purpose_Of_Use": data.purposeOfUse,
        "Grouped_country": data.country,
    }


def get_contributions(df):
    transformed_data = preprocessor.transform(df)

    shap_values = explainer.shap_values(transformed_data)

    if hasattr(shap_values, "values"):
        shap_values = shap_values.values

    shap_values = shap_values[0]

    # Keep names aligned with the transformed columns SHAP returns.
    feature_names = []

    for name, transformer, columns in preprocessor.transformers_:
        if name == "remainder":
            continue

        if name == "Skewed_Pipeline":
            feature_names.append("Study_Hours")

        elif name == "Plain_Numeric":
            feature_names.extend(columns)

        elif name == "Ordinal":
            feature_names.extend(columns)

        elif name == "Normal":
            encoder = transformer.named_steps["encode"]
            encoded_names = encoder.get_feature_names_out(columns)
            feature_names.extend(encoded_names)

    # Combine encoded columns into the user-facing lifestyle categories.
    grouped_contributions = {
        "Sleep": 0.0,
        "Stress level": 0.0,
        "Screen time": 0.0,
        "Study hours": 0.0,
        "Physical activity": 0.0,
    }

    for feature_name, value in zip(feature_names, shap_values):

        if "Sleep_Hours_Per_Night" in feature_name:
            grouped_contributions["Sleep"] += float(value)

        elif "Stress_Level" in feature_name:
            grouped_contributions["Stress level"] += float(value)

        elif "Avg_Daily_Usage_Hours" in feature_name:
            grouped_contributions["Screen time"] += float(value)

        elif "Study_Hours" in feature_name:
            grouped_contributions["Study hours"] += float(value)

        elif "Physical_Activity_Hours" in feature_name:
            grouped_contributions["Physical activity"] += float(value)

    contributions = [
        {
            "label": label,
            "value": round(value, 3),
        }
        for label, value in grouped_contributions.items()
    ]

    contributions.sort(
        key=lambda item: abs(item["value"]),
        reverse=True,
    )

    return contributions[:3]


def predict_score(data):
    model_input = prepare_model_input(data)

    df = pd.DataFrame([model_input])

    prediction = model.predict(df)[0]

    contributions = get_contributions(df)

    return {
        "score": round(float(prediction), 1),
        "contributions": contributions,
    }