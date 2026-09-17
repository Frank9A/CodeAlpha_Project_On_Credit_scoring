from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

# 1. Initialize the server and CORS
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the trained model and the exact column names
print("Loading AI Bank Manager...")
model = joblib.load('credit_model.pkl')
model_columns = joblib.load('model_columns.pkl')
print("Bank Manager is ready!")

# 3. Create the rulebook: React will send a flexible dictionary of applicant details
class ApplicantData(BaseModel):
    details: dict

# 4. Create the Prediction Endpoint
# 4. Create the Prediction Endpoint
@app.post("/predict")
async def predict_risk(applicant: ApplicantData):
    # Step A: Convert to DataFrame
    df = pd.DataFrame([applicant.details])
    
    # Step B: One-Hot Encoding
    df_encoded = pd.get_dummies(df)
    
    # Step C: Align with the model's exact expected columns
    df_ready = df_encoded.reindex(columns=model_columns, fill_value=0)
    
    # Step D: The Enterprise Fix - Get exact percentages instead of a simple 1 or 0
    probabilities = model.predict_proba(df_ready)[0]
    bad_risk_prob = probabilities[0] # The percentage chance they default
    
    # Step E: Strict Bank Threshold
    # If there is greater than a 30% chance they default, reject the loan!
    if bad_risk_prob > 0.30:
        result = f"Bad Risk (Reject) - {bad_risk_prob*100:.1f}% risk of default"
    else:
        result = f"Good Risk (Approve) - {(1-bad_risk_prob)*100:.1f}% probability of repayment"
    
    return {"prediction": result}