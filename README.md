# 🎓 GradePredictorAI — Student Grade Predictor

This is my first machine learning project. A full stack Machine Learning web application that predicts a student's final semester CGPA based on 27 factors including subject scores, study habits, attendance, and family background.


---

## 🔗 Live Demo

| | Link | |
https://samxshetty.github.io/grade-predictor-ai
---

## Features

- **4-Step Form** — Clean multi-step form with validation collecting 27 student attributes
- **AI Prediction** — Random Forest model predicts final CGPA out of 10
- **Animated Result** — CGPA counter animation, grade badge, and risk level indicator
- **Feature Importance Chart** — Visual breakdown of what's affecting the student's CGPA
- **What-If Simulator** — Live sliders to see how changing study hours, absences, and lecture attendance affects predicted CGPA
- **Comparison Bar** — Student's predicted CGPA vs dataset average
- **Personalised Tips** — Actionable recommendations based on weakest factors

---

## Machine Learning

### Dataset
- **1000 Indian engineering students** (synthetic, realistically generated)
- **28 columns** — 27 features + 1 target (final_cgpa)
- Colleges: NMAMIT, NITK, MSRIT, VIT, SRM, PESIT, RV College, BIT Mesra
- Cities: Mangalore, Bangalore, Mumbai, Pune, Hyderabad, Chennai, Delhi, Udupi, Mysore, Navi Mumbai

### Features Used

| Category | Features |
|---|---|
| Personal | school, sex, age, city, fam_size |
| Family | medu, fedu, mjob, fjob, famrel |
| Academic Habits | reason, traveltime, studytime_daily_hrs, coaching, activities, higher, romantic, freetime, health, absences, lecture_hrs_attended |
| Academic History | prev_cgpa |
| Subject Scores | math_score, physics_score, programming_score, electronics_score, english_score |

### Target Variable
`final_cgpa` — Final semester CGPA out of 10

### Model
- **Algorithm:** Random Forest Regressor
- **Trees:** 100
- **R² Score:** 0.87 (87% variance explained)
- **MAE:** 0.29 CGPA points
- **Cross-Val R² (5-fold):** 0.84

### Feature Importances (Top)
```
english_score          24.39%
electronics_score      12.58%
programming_score      12.10%
studytime_daily_hrs    10.11%
prev_cgpa               8.98%
absences                8.19%
math_score              7.82%
physics_score           7.34%
lecture_hrs_attended    3.05%
```

### Grade System (Indian Engineering)
| CGPA | Grade | Meaning |
|---|---|---|
| 9.0 – 10.0 | O | Outstanding |
| 8.0 – 8.9 | A+ | Excellent |
| 7.0 – 7.9 | A | Very Good |
| 6.0 – 6.9 | B+ | Good |
| 5.0 – 5.9 | B | Above Average |
| 4.0 – 4.9 | C | Average / Pass |

---

## Project Structure

```
grade-predictor-ai/
│
├── index.html                  ← Landing page
├── form.html                   ← 4-step input form
├── result.html                 ← Result page with charts
│
├── frontend/
│   ├── css/
│   │   ├── style.css           ← Global styles (dark theme)
│   │   ├── form.css            ← Form specific styles
│   │   └── result.css          ← Result page styles
│   └── js/
│       ├── form.js             ← Multi-step form logic + API call
│       └── result.js           ← Charts, animations, what-if simulator
│
├── backend/
│   ├── app.py                  ← Flask REST API (3 routes)
│   ├── predict.py              ← Encoding + prediction logic
│   ├── model.pkl               ← Trained Random Forest model
│   ├── scaler.pkl              ← Fitted StandardScaler
│   ├── label_encoders.pkl      ← Fitted LabelEncoders for categorical columns
│   └── requirements.txt        ← Python dependencies
│
├── data/
│   ├── indian_engineering_students.csv   ← Original dataset
│   └── encoded_students.csv             ← Encoded dataset (model ready)
│
└── notebook/
    ├── explore.py              ← Data exploration and correlation analysis
    ├── encode.py               ← Encoding categorical columns
    └── train.py                ← Model training and evaluation
```

---

## API Reference

### Base URL
```
https://grade-predictor-ai.onrender.com
```

### Endpoints

#### GET /
Health check — confirms API is running.

**Response:**
```json
{
  "message": "Student Grade Predictor API is running"
}
```

---

#### POST /predict
Main prediction endpoint. Accepts student data and returns full prediction with feature importances.

**Request Body:**
```json
{
  "school": "NMAMIT",
  "sex": "M",
  "age": 19,
  "city": "Mangalore",
  "fam_size": "<=3",
  "medu": 3,
  "fedu": 2,
  "mjob": "Engineer",
  "fjob": "Business",
  "famrel": 4,
  "reason": "Reputation",
  "traveltime": 2,
  "studytime_daily_hrs": 3.5,
  "coaching": "yes",
  "activities": "no",
  "higher": "yes",
  "romantic": "no",
  "freetime": 3,
  "health": 4,
  "absences": 8,
  "lecture_hrs_attended": 4.5,
  "prev_cgpa": 7.2,
  "math_score": 72,
  "physics_score": 65,
  "programming_score": 80,
  "electronics_score": 70,
  "english_score": 75
}
```

**Response:**
```json
{
  "predicted_cgpa": 6.26,
  "grade": "B+",
  "risk_level": "Average",
  "risk_color": "orange",
  "feature_importances": {
    "english_score": 24.39,
    "studytime_daily_hrs": 10.11,
    "absences": 8.19,
    "prev_cgpa": 8.98,
    "...": "..."
  }
}
```

---

#### POST /whatif
What-if simulator endpoint. Same input as /predict but returns only CGPA, grade and risk — used for live slider updates.

**Response:**
```json
{
  "predicted_cgpa": 7.10,
  "grade": "A",
  "risk_level": "On Track",
  "risk_color": "green"
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| ML Model | scikit-learn (Random Forest) |
| Data Processing | pandas, numpy |
| Backend | Python, Flask, flask-cors |
| Model Serialization | joblib |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Backend Deployment | Render (free tier) |
| Frontend Deployment | GitHub Pages |

---

## Running Locally

### Prerequisites
- Python 3.x
- Git

### Step 1 — Clone the repo
```bash
git clone https://github.com/samxshetty/grade-predictor-ai.git
cd grade-predictor-ai
```

### Step 2 — Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3 — Start the Flask server
```bash
python app.py
```
Server runs at `http://127.0.0.1:5000`

### Step 4 — Open the frontend
Open `index.html` in your browser directly or use VS Code Live Server.

> **Note:** When running locally, make sure `form.js` and `result.js` use `http://127.0.0.1:5000` instead of the Render URL.

---

## How the ML Pipeline Works

```
Raw CSV (1000 students, 28 columns)
          ↓
explore.py — correlation analysis, understand data
          ↓
encode.py  — LabelEncoder for categorical columns
           — yes/no → 1/0 mapping
           — save label_encoders.pkl
          ↓
train.py   — train/test split (80/20)
           — StandardScaler (fit on train only)
           — train Random Forest (100 trees)
           — evaluate MAE + R² + cross validation
           — save model.pkl + scaler.pkl
          ↓
predict.py — encode new user input
           — scale using saved scaler
           — model.predict() → CGPA
          ↓
app.py     — Flask API exposes /predict and /whatif
          ↓
form.js    — collects form data, calls /predict
          ↓
result.js  — renders animated result, chart, simulator
```

---

## ML Artifacts

| File | Description |
|---|---|
| `model.pkl` | Trained Random Forest with 100 decision trees |
| `scaler.pkl` | StandardScaler fitted on training data (means + stds of 27 columns) |
| `label_encoders.pkl` | Dictionary of 7 LabelEncoders for school, sex, city, fam_size, mjob, fjob, reason |

---

## Disclaimer

This tool is built for educational purposes only. Predictions are based on a synthetic dataset of 1000 students and should not be used as a definitive academic assessment. Actual performance depends on many factors not captured in this model.

---

## Authors
Samridh S Shetty
Samarth R Shenoy
---

## 📄 License
MIT License — free to use, modify, and distribute.
