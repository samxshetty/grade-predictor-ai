import pandas as pd
from sklearn.preprocessing import LabelEncoder
import joblib
import os

df = pd.read_csv('../data/indian_engineering_students.csv')

print("Before encoding:")
print(df[['school', 'sex', 'coaching', 'higher', 'romantic']].head())

binary_cols = ['coaching', 'activities', 'higher', 'romantic']
for col in binary_cols:
    df[col] = df[col].map({'yes': 1, 'no': 0})

multi_cols = ['school', 'sex', 'city', 'fam_size', 'mjob', 'fjob', 'reason']
label_encoders = {}
for col in multi_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

print("\nAfter encoding:")
print(df[['school', 'sex', 'coaching', 'higher', 'romantic']].head())

print("\nData types after encoding:")
print(df.dtypes)

os.makedirs('../backend', exist_ok=True)
joblib.dump(label_encoders, '../backend/label_encoders.pkl')
print("\nLabel encoders saved to backend/label_encoders.pkl")

df.to_csv('../data/encoded_students.csv', index=False)
print("Encoded dataset saved to data/encoded_students.csv")
