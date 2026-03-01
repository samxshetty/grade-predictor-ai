import numpy as np
import joblib

model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')

def predict_cgpa(data):
    binary_cols = ['coaching', 'activities', 'higher', 'romantic']
    for col in binary_cols:
        data[col] = 1 if data[col] == 'yes' else 0

    multi_cols = ['school', 'sex', 'city', 'fam_size', 'mjob', 'fjob', 'reason']
    for col in multi_cols:
        data[col] = label_encoders[col].transform([data[col]])[0]

    feature_order = [
        'school', 'sex', 'age', 'city', 'fam_size', 'medu', 'fedu',
        'mjob', 'fjob', 'famrel', 'reason', 'traveltime',
        'studytime_daily_hrs', 'coaching', 'activities', 'higher',
        'romantic', 'freetime', 'health', 'absences',
        'lecture_hrs_attended', 'prev_cgpa', 'math_score',
        'physics_score', 'programming_score', 'electronics_score',
        'english_score'
    ]

    input_array = np.array([[data[feature] for feature in feature_order]])

    input_scaled = scaler.transform(input_array)

    predicted_cgpa = model.predict(input_scaled)[0]
    predicted_cgpa = round(float(predicted_cgpa), 2)

    predicted_cgpa = max(4.0, min(10.0, predicted_cgpa))

    if predicted_cgpa >= 9:
        grade = 'O'
    elif predicted_cgpa >= 8:
        grade = 'A+'
    elif predicted_cgpa >= 7:
        grade = 'A'
    elif predicted_cgpa >= 6:
        grade = 'B+'
    elif predicted_cgpa >= 5:
        grade = 'B'
    else:
        grade = 'C'

    if predicted_cgpa >= 7:
        risk_level = 'On Track'
        risk_color = 'green'
    elif predicted_cgpa >= 5.5:
        risk_level = 'Average'
        risk_color = 'orange'
    else:
        risk_level = 'At Risk'
        risk_color = 'red'

    feature_importances = dict(zip(
        feature_order,
        [round(float(x) * 100, 2) for x in model.feature_importances_]
    ))

    return {
        'predicted_cgpa': predicted_cgpa,
        'grade': grade,
        'risk_level': risk_level,
        'risk_color': risk_color,
        'feature_importances': feature_importances
    }