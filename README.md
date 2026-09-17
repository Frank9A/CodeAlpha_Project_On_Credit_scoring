# AI Bank Manager: Credit Risk Scoring

A full-stack financial machine learning application that predicts loan default risk. Built as the final deliverable for the CodeAlpha Machine Learning Internship.

## Features
* **Interactive Banking Dashboard:** A React frontend that captures applicant financial data.
* **Enterprise Risk Thresholds:** Utilizes model probability (`predict_proba`) rather than standard binary classification to enforce strict bank risk tolerance (rejects >30% default probability).
* **Dynamic Data Alignment:** Backend automatically handles One-Hot Encoding and aligns raw JSON payloads with the model's exact training columns using Pandas reindexing.

## Tech Stack
* **Frontend:** React, Vite, JavaScript
* **Backend:** Python, FastAPI, Uvicorn, Joblib
* **Machine Learning:** Scikit-Learn, Pandas (Random Forest Classifier)

## Dataset & Tuning
* Trained on the German Credit Risk dataset.
* Model tuned with `class_weight='balanced'` to prioritize the recall of high-risk applicants, minimizing catastrophic false negatives for the bank.