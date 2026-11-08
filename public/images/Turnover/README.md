# Turnover Analytics

Turnover Analytics is an HR analytics application for exploring employee attrition, estimating turnover risk, and organizing retention follow-up. It combines a React dashboard, a Spring Boot REST API, and a separate Python/FastAPI prediction service.

Risk scores and model predictions are decision-support signals only. They should be reviewed by HR and should not be used as the sole basis for employment decisions.

## What is in this project

### Employee and access management

- Browse, search, filter, paginate, create, update, and delete employee records.
- Manage application users and roles (admin-only interface and API).
- JWT-based, stateless authentication with role-based access for `ADMIN`, `HR`, `MANAGER`, and `EMPLOYEE`.
- Seed standard roles and development accounts on startup when they are not already present.
- Import the IBM HR attrition sample into an empty database from `src/main/resources/data/ibm_hr_attrition.csv`.

### Dashboards

- An embedded Power BI HR dashboard, including employee, attrition, salary, satisfaction, risk, and alert views.
- A Power BI report is loaded from an embed URL currently defined in the frontend; report availability and access depend on Power BI.
- Employee list filters include department, attrition, salary, age, and calculated score.

### Turnover scoring and alerts

The configurable business scoring engine is independent of the ML models. It computes a 0-100 risk score from eight explainable factors:

1. Short company tenure
2. Number of previous companies
3. Overtime
4. Low monthly income
5. Low job satisfaction
6. Low environment satisfaction
7. Time since last promotion
8. Low stock-option level

Default risk bands are **LOW** below 30, **MEDIUM** from 30 to 54, and **HIGH** from 55. Each result includes the detected reasons. Scores can be viewed for one or many employees, compared against simulated employee details, and retained as score history.

Alerts can be generated during periodic risk evaluation or created manually. The alert screens support status/severity filtering, counts, marking alerts as read or resolved, runtime threshold and interval configuration, and PDF email reports. Trend changes can also contribute to alert creation. The scheduler interval is configurable; `0` disables periodic evaluation.

### HR recommendations and follow-up

- Generate prioritized, employee-specific retention recommendations using employee details and scoring reasons.
- The recommendation service can use OpenRouter; it also has a deterministic business-rule fallback if an AI response cannot be used.
- Track HR actions per employee, list them, and mark them complete.
- Chat with the HR assistant about prioritized employees, an individual employee, and department risk summaries. It uses OpenRouter when configured and includes a business-rule fallback.
- AI output is decision support and should be checked by HR.

### Attrition prediction: shipped models

The FastAPI prediction service loads two scikit-learn models from `ml/artifacts`:

- **Logistic Regression**
- **SVM with an RBF kernel**

Both use saved preprocessing/scaling artifacts, categorical encoding, defaults for omitted fields, and model-specific decision thresholds. The prediction response includes a probability, `Leave`/`Stay` prediction, risk level, threshold, and explanatory message. The API also supports model comparison for a single employee profile.

The checked-in metadata records the following holdout-set results from the saved training run. These figures are dataset-specific reference results, not a guarantee of future performance:

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | Decision threshold |
|---|---:|---:|---:|---:|---:|---:|
| Logistic Regression | 0.8503 | 0.5306 | 0.5532 | 0.5417 | 0.8110 | 0.638 |
| SVM (RBF) | 0.8571 | 0.5556 | 0.5319 | 0.5435 | 0.8111 | 0.321 |

Training uses a stratified 80/20 train/test split, five-fold stratified grid search with F1 scoring, feature scaling, and a threshold selected from the precision-recall curve.

#### Notebook experiments and deep learning

The notebooks contain experiments beyond the two models used by the live prediction API:

- `ml/notebooks/NotebookComplet.ipynb`: Logistic Regression, SVM, Decision Tree, K-Nearest Neighbors, Random Forest, and XGBoost experiments.
- `ml/notebooks/IntegLstm.ipynb`: Logistic Regression and SVM comparisons, plus PyTorch dense/MLP, LSTM, and TabNet deep-learning experiments.

These are research/training notebooks. The current FastAPI service loads only Logistic Regression and SVM artifacts; it does **not** serve the MLP, LSTM, or TabNet models.

## Architecture

```text
React + Vite frontend (5173)
  ├── Spring Boot REST API (8083) ── MySQL
  │     ├── Authentication, employees, users, roles
  │     ├── Business scoring, score history, alerts, HR actions
  │     ├── Recommendations and HR assistant (OpenRouter, optional)
  │     └── Prediction proxy ───────────────┐
  └── Direct model selection UI             │
        └── FastAPI + scikit-learn (8001) ◀──┘
```

### Main technologies

- **Frontend:** React 19, Vite, Axios, Lucide icons
- **Business API:** Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA, JWT
- **Database:** MySQL (configured by default); H2 is included for tests/alternative local configuration
- **Prediction API:** Python, FastAPI, pandas, scikit-learn, joblib
- **Research notebooks:** Jupyter, scikit-learn, PyTorch and TabNet experiments

## Run locally

Prerequisites: Java 17, Node.js/npm, Python with the dependencies in `ml/notebooks/requirements.txt`, and a reachable MySQL server for the default configuration.

### 1. Configure the backend

The active database configuration in `src/main/resources/application.properties` points to `localhost:3306` and the `turnover_db` database. Update the connection details for your environment. The optional `src/main/resources/application-local.properties` can hold local overrides and is not required to be committed.

Set a private, sufficiently strong JWT secret and configure OpenRouter only if you want AI-generated recommendations/chat responses. Keep credentials out of source control. OpenRouter is configured through `OPENROUTER_API_KEY`; the model name defaults to `gpt-4o-mini`.

### 2. Start the Python prediction API

From the repository root in PowerShell:

```powershell
python -m venv ml\notebooks\.venv
.\ml\notebooks\.venv\Scripts\Activate.ps1
python -m pip install -r ml\notebooks\requirements.txt
Set-Location ml\api
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

The service expects the saved models and preprocessing metadata under `ml/artifacts`. The repository includes the LR and SVM model/scaler artifacts. Check service readiness at `http://127.0.0.1:8001/health`; interactive API documentation is at `http://127.0.0.1:8001/docs`.

### 3. Start the Spring Boot API

In a second terminal at the repository root:

```powershell
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8083`. On the first run, it creates the schema and initializes roles, development accounts, and sample employees if the corresponding tables are empty.

### 4. Start the frontend

In another terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). The frontend API client targets `http://localhost:8083/api`; the prediction form calls the Python API on port `8001` directly.

`start.bat` is also present as a convenience launcher, but it contains machine-specific paths and assumes an existing Python virtual environment. The commands above are the portable development setup.

## Train the shipped prediction models

The training script reads `ml/notebooks/dataIBM.csv` and writes models, scalers, thresholds, metrics, and shared preprocessing metadata under `ml/artifacts`.

```powershell
Set-Location ml\api
python train_models.py
```

The API loads artifacts at startup, so restart it after retraining. The notebooks can be opened from Jupyter for the broader classical and deep-learning experiments.

## REST API overview

Business API endpoints use the `http://localhost:8083/api` base URL. Except for login and the explicitly permitted prediction proxy, requests require a JWT bearer token. Access to individual operations is further restricted by role.

| Area | Routes |
|---|---|
| Authentication | `POST /auth/login`, `GET /auth/me` |
| Employees | `GET /employees`, `GET /employees/{id}`, `GET /employees/paginated`, `GET /employees/count`, `POST /employees`, `PUT /employees/{id}`, `DELETE /employees/{id}` |
| Users and roles | `/users` and `/roles` management routes (admin-only) |
| Business scoring | `GET /turnover-scoring/employees/{id}/score`, `GET /turnover-scoring/employees/{id}/history`, `POST /turnover-scoring/employees/{id}/simulate`, `POST /turnover-scoring/employees/bulk` |
| Alerts | `/alerts`, `/alerts/summary`, `/alerts/config`, `/alerts/report`; create, mark-read, and resolve operations |
| HR actions | `POST /hr-actions/employees/{id}`, `GET /hr-actions/employees/{id}`, `PATCH /hr-actions/{actionId}/complete` |
| Recommendations | `POST /recommendations/employees/{id}` |
| HR assistant | `POST /hr-assistant/chat` |
| Prediction proxy | `POST /predict` |

The Python API runs independently on port `8001`:

| Method and route | Purpose |
|---|---|
| `GET /health` | Service and loaded-model status |
| `GET /models` | Model names, thresholds, and saved metrics |
| `POST /predict` | Default SVM prediction for the backend's simplified profile |
| `POST /predict/logistic-regression` | Logistic Regression prediction |
| `POST /predict/svm` | SVM prediction |
| `POST /predict/compare` | Side-by-side LR and SVM predictions |

FastAPI Swagger UI: `http://127.0.0.1:8001/docs`; ReDoc: `http://127.0.0.1:8001/redoc`.

## Tests

Run the backend test suite from the repository root:

```powershell
.\mvnw.cmd test
```

Frontend production build:

```powershell
Set-Location frontend
npm run build
```

The Java tests include application, security integration, scoring, prediction, recommendation, and alert-scheduler coverage. See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for the UI scoring checklist.

## Project layout

```text
src/main/java/                 Spring Boot API, services, persistence, security
src/main/resources/            Application configuration and sample HR data
src/test/java/                 Backend tests
frontend/src/                  React application, pages, and API client
ml/api/                        FastAPI service, preprocessing, model training
ml/artifacts/                  Saved LR/SVM models, scalers, and metadata
ml/notebooks/                  IBM HR dataset, dependency list, and experiments
```

Additional module notes are available in [scoring.md](./scoring.md), [Alerte.md](./Alerte.md), and [Recommendation.md](./Recommendation.md).
