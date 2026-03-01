import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('../data/indian_engineering_students.csv')

print("Shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nColumn names:")
print(df.columns.tolist())
print("\nData types:")
print(df.dtypes)
print("\nBasic statistics:")
print(df.describe())
print("\nMissing values:")
print(df.isnull().sum())
print("\nFinal CGPA distribution:")
print(df['final_cgpa'].describe())

print("\nCorrelation with final_cgpa:")
print(df.corr(numeric_only=True)['final_cgpa'].sort_values(ascending=False))
