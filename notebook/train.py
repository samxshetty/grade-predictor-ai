import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

df = pd.read_csv('../data/encoded_students.csv')

X = df.drop('final_cgpa', axis=1)
y = df['final_cgpa']

print("Features shape:", X.shape)
print("Target shape:", y.shape)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nTraining samples:", X_train.shape[0])
print("Testing samples:", X_test.shape[0])

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

joblib.dump(scaler, '../backend/scaler.pkl')
print("\nScaler saved to backend/scaler.pkl")

print("\n--- Linear Regression ---")
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)
lr_preds = lr.predict(X_test_scaled)
lr_mae = mean_absolute_error(y_test, lr_preds)
lr_r2 = r2_score(y_test, lr_preds)
print("MAE:", round(lr_mae, 4))
print("R2 Score:", round(lr_r2, 4))

print("\n--- Random Forest ---")
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train_scaled, y_train)
rf_preds = rf.predict(X_test_scaled)
rf_mae = mean_absolute_error(y_test, rf_preds)
rf_r2 = r2_score(y_test, rf_preds)
print("MAE:", round(rf_mae, 4))
print("R2 Score:", round(rf_r2, 4))

cv_scores = cross_val_score(rf, X_train_scaled, y_train, cv=5, scoring='r2')
print("Cross Val R2 (5-fold):", round(cv_scores.mean(), 4))

print("\n--- Feature Importances ---")
importances = pd.Series(rf.feature_importances_, index=X.columns)
importances = importances.sort_values(ascending=False)
for feature, importance in importances.items():
    bar = "█" * int(importance * 200)
    print(f"  {feature:<28} {bar:<30} {importance*100:.2f}%")

print("\n--- Sample Predictions vs Actual ---")
sample = pd.DataFrame({
    'Actual': y_test.values[:8],
    'Predicted': rf_preds[:8].round(2),
    'Error': abs(y_test.values[:8] - rf_preds[:8]).round(2)
})
print(sample.to_string(index=False))

joblib.dump(rf, '../backend/model.pkl')
print("\nModel saved to backend/model.pkl")
