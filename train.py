import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix, classification_report
import joblib

# 1. Fetch the german credit dataset from OpenML repository
print("Downloading financial data...")
credit_data = fetch_openml(name='credit-g', version=1, as_frame=True, parser='auto')

#2. Extract the features (the applicant's details) and the target (good/bad risk)
df = credit_data.frame

# 3. Print out the first 5 applicants to see what we are working with
print("\nFirst 5 Bank Applicants:")
print(df.head())

# 4. Check the size of our dataset
print(f"\nTotal applications in the dataset: {df.shape[0]}")

# 5. Convert the target 'class' from text to binary numbers
df['class'] = df['class'].map({'good': 1, 'bad': 0})

# 6. Separate the applicant details (X) from the target answer (y)
X = df.drop('class', axis=1)
y = df['class']

# 7. Use One-Hot Encoding to convert all remaining text into binary numbers
X_encoded = pd.get_dummies(X, drop_first=True)

print("\n--- After Encoding ---")
print(f"Old number of columns: {X.shape[1]}")
print(f"New number of columns: {X_encoded.shape[1]}")
print("\nHere is what the math-ready data looks like:")
print(X_encoded.head())

# 8. Split the data: 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# 9. Initialize the Random Forest model
print("\nTraining the Random Forest model...")
model = RandomForestClassifier(random_state=42, class_weight='balanced', n_estimators=100)

# 10. Train the model on the 80% pile
model.fit(X_train, y_train)

# 11. Test the model on the unseen 20% pile
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nFinal Test Accuracy: {accuracy * 100:.2f}%")

# 12. Evaluate the specific types of mistakes the model is making
print("\n--- Confusion Matrix ---")
print(confusion_matrix(y_test, y_pred))

print("\n--- Detailed Report ---")
print(classification_report(y_test, y_pred, target_names=['Bad Risk (0)', 'Good Risk (1)']))

# 13. Save the trained model to a file
joblib.dump(model, 'credit_model.pkl')
print("\nModel saved as credit_model.pkl")

# 14. Save the exact column names so our API knows how to format new data
joblib.dump(list(X_encoded.columns), 'model_columns.pkl')
print("Model columns saved as model_columns.pkl")