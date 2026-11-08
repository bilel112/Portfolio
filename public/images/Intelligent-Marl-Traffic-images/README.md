# Intelligent Multi-Agent Urban Traffic Management

> **Course:** Advanced Data Science Project - Esprit School of Engineering (5DS8)  
> **Supervisor:** Islem Maiti  
> **Team:** Hazem Mrad, Bilel Brini, Lina Haddad, Amen Allah Ben Aissa, Rami Ben Slimen

---

## 🎯 Project Overview

This project explores how **traffic simulation, reinforcement learning, conventional control and large language models (LLMs)** can be combined to prototype a more adaptive urban traffic management system.

[Eclipse SUMO](https://sumo.dlr.de) is the microscopic traffic simulator. The Python domain layer exposes the network as a PettingZoo parallel environment; PPO policies use a parameter-shared model across intersection slots, while rule-based and LLM controllers provide comparable alternatives. The research goal is to evaluate congestion, person-weighted delay, emissions, pedestrian service and emergency response under reproducible simulated conditions.

The repository also contains **KEMETRA**, a dashboard/control-room demonstration for configuring controllers, viewing live simulations and exploring experiment results. This is a research prototype, not a certified or production-ready traffic signal system.

**Challenge Question:**  
> *"How might we use data and intelligent agents to make urban traffic more efficient, adaptive, and sustainable?"*

---

## 🗺️ Roadmap

| Phase | Scenario | Status |
|-------|----------|--------|
| Phase 1 | 2x2 Grid - toy validation | 🟡 In Progress |
| Phase 2 | 3x3 Grid - main benchmark | 🟠 In Progress |
| Phase 3 | Monaco - real-world use case | 🔴 Planned |

---

## 📁 Repository Structure

```
intelligent-marl-traffic/
├── src/cotraffic/       # Backend domain: env, controllers, training, evaluation, CLI
├── api/                 # FastAPI layer: data, runs, assistant, policy, live simulation
├── configs/             # protocol, networks, agents, scenarios, experiments (all parameters)
├── tests/               # pytest: API contract + domain checks
├── scripts/             # export/replay/reproduce entry points, explore/ research helpers
├── frontend/            # Single frontend (Vite)
│   ├── index.html       #   entry -> src/shell/app.js (control-room shell)
│   ├── styles.css       #   KEMETRA green/white tokens and layout
│   └── src/
│       ├── app/         #   React shell: router, nav, providers, theme
│       ├── features/    #   one folder per page (overview, live-map, agents, ...)
│       ├── shared/      #   api client, schemas, ui, charts, i18n, theme tokens
│       └── shell/       #   vanilla shell, Mapbox/3D env, benchmark island mount
├── docs/                # ARCHITECTURE, DESIGN_TOKENS, FRONTEND_ROADMAP, plans/
├── sumo_files/          # generated SUMO networks (gitignored)
└── results/             # generated runs, summary, checkpoints (gitignored)
```

One backend (`src/cotraffic` + `api/`), one frontend (`frontend/`). The retired stacks
(`environment/`, `baselines/`, `evaluation/`, `agents/`, the Streamlit dashboard, the grid
scenario runners) are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §8.

---

## 🧩 Technical Architecture

The project is organized around one authoritative simulation and controller layer:

```text
Dashboard (Vite / React and shell UI)
           │ HTTP, WebSocket, exported JSON
FastAPI (api/) ── jobs, runs, live simulation, model and LLM configuration
           │
Python domain (src/cotraffic/)
  ├─ SUMO / TraCI environment and PettingZoo interface
  ├─ traffic controllers and safety shield
  ├─ PPO/DQN training, evaluation runner and statistics
  └─ LLM providers, structured responses and traces
           │
Configuration (configs/) ── protocol, networks, demands, scenarios, agents, experiments
           │
Eclipse SUMO ── microscopic traffic simulation
```

`src/cotraffic/` owns the simulation, controller decisions, training and evaluation. The
FastAPI layer adapts those capabilities for the dashboard and does not define a separate
traffic simulator. YAML files under `configs/` hold most protocol and experiment settings.
The CLI (`python -m cotraffic`) supports network generation, training, checkpoint
selection, evaluation, aggregation and report tables. The dashboard can use exported
static JSON for offline exploration or the API for live jobs and simulations.

### Main technologies

| Area | Technologies |
|---|---|
| Traffic simulator | Eclipse SUMO, TraCI / libsumo |
| Multi-agent environment | PettingZoo, Gymnasium, SuperSuit |
| Reinforcement learning | Stable-Baselines3, PPO and DQN, PyTorch |
| Backend and contracts | Python 3.10+, FastAPI, Uvicorn, Pydantic |
| Analysis | NumPy, pandas, SciPy, scikit-learn |
| Dashboard | Vite, React/TypeScript, charts and map/3D visualization libraries |
| LLM integration | Groq, Gemini and OpenCode-compatible providers; JSON over HTTP |

### Traffic simulation and control

SUMO models individual vehicles, traffic lights, routes, pedestrians and traffic events.
The shared protocol sets decision timing, minimum/maximum green, yellow time,
anti-starvation limits and evaluation windows. Network, demand and scenario configuration
is kept separately so that the same controller can be tested across different conditions.

Available comparison controllers include fixed-time Webster, actuated control,
Max-Pressure, emergency/pedestrian rules, learned PPO/DQN policies, a direct LLM
controller and the hybrid `llm_team`. `generalist` is a parameter-shared PPO policy
trained across demand levels and event scenarios. The training code uses Stable-Baselines3
PPO with a vectorized intersection environment; it is **not** an explicit implementation
of MAPPO with a centralized critic or independent PPO policies per intersection. Although
the dashboard has MAPPO/IPPO choices, those choices are currently not passed through the
training launch request. The launched recipe and backend implementation determine the
algorithm actually used.

The reward is computed per intersection and decision interval. Its configurable base is
waiting time, queue or pressure; optional CO₂, emergency-vehicle and pedestrian penalties
are normalized, weighted and clipped. The `generalist` recipe enables person-weighted
delay and configures CO₂, emergency and pedestrian terms. Reward is the training signal,
not a substitute for reporting independent evaluation metrics.

The principal inherited PPO defaults in `configs/agents/base.yaml` are:

| Hyperparameter | Default | Purpose |
|---|---:|---|
| Learning rate | `3e-4` | Optimizer update scale |
| `n_steps` | `256` | Rollout length per vectorized environment |
| Batch size | `64` | Samples per optimization mini-batch |
| Epochs | `10` | PPO optimization passes per rollout |
| `gamma` | `0.99` | Future reward discount |
| GAE lambda | `0.95` | Advantage-estimation bias/variance trade-off |
| Clip range | `0.2` | Bounds policy updates |
| Value coefficient | `0.5` | Value-loss contribution |
| Entropy coefficient | `0.0` | Entropy/exploration contribution |
| Policy network | `[64, 64]` | Hidden-layer widths |

The recipe and training request can override training budgets and selected environment or
reward settings; use the effective job configuration when reproducing a run.

### LLMs: how they decide and interact

LLMs are optional decision-support controllers, not the simulator and not trained PPO
policies. Provider credentials stay on the backend; the frontend should never contain
provider API keys. Provider, model, timeouts, retries, token limits, call cadence and
per-episode call budgets are configured through the agent YAML files and environment
variables.

#### Direct `llm` controller

At its configured interval, the controller sends a compact traffic snapshot and a
role-specific system instruction to one LLM call. The model returns a structured JSON
proposal containing a valid signal phase for each controlled intersection. The controller
validates the response, maps phases to the network's allowed actions and applies them
through the environment. If the provider is unavailable or the answer is invalid, the
controller records the failure and uses Max-Pressure as its fallback. It does not fine-tune
the provider model.

#### Hybrid `llm_team` controller

`llm_team` keeps Max-Pressure as its normal, fast baseline and uses three specialized
LLM roles to propose **typed directives**, rather than directly commanding signal phases:

| Role | Responsibility |
|---|---|
| Operator | Network-wide operating priorities, such as a bounded bias or hold directive |
| Emergency | Emergency-vehicle pre-emption and corridor-related proposals |
| Pedestrian | Pedestrian-service proposals for waiting crossings |

The three roles are software agents with different prompts and token budgets; by default
they use the same configured provider/model and shared client. They are not three
independently trained models. Prompt files are in
[`src/cotraffic/controllers/llm_team/prompts/`](src/cotraffic/controllers/llm_team/prompts/).

The interaction cycle is:

1. The Python **Supervisor** classifies the current situation and decides which roles are
   due, based on cadence, congestion, emergency events, pedestrian waits and call budget.
   The Supervisor is deterministic orchestration code, **not an LLM**.
2. The controller builds a bounded snapshot of the network state and relevant recent
   feedback. Each role can receive a role-specific view of this snapshot.
3. Due roles can call the shared provider concurrently. They produce their own responses
   from the shared state; they do not have an unconstrained free-form conversation and
   do not see other roles' same-tick responses before generating their own.
4. The response schema and role-specific rules validate the directives. The arbiter
   resolves competing proposals; accepted results and alerts are posted to a short-lived
   blackboard for subsequent calls.
5. A directive layer translates accepted proposals into bounded control adjustments.
   Max-Pressure remains the base policy, and the environment's safety shield is the final
   layer before a traffic-light action is applied.

This layered design constrains LLM output and makes fallback behavior explicit; it does
not by itself certify traffic safety. Prompt/schema definitions, provider adapters and
controller logic live respectively under `controllers/llm_team/prompts/`,
`controllers/llm_team/`, and `src/cotraffic/llm/`.

The response schema is **structured output**, not general-purpose tool/function calling:
the model proposes a limited data object, and ordinary application code validates and
executes permitted changes. LoRA, Prompt Tuning and fine-tuning of external LLM weights
are not implemented. PPO training adjusts the project's RL policy, not the LLM.

Prompt-engineering techniques in the implementation include role-specific system
instructions, explicit allowed actions and constraints, compact role-filtered JSON
context, a strict response envelope/schema, and a bounded retry instruction when a
response is malformed. Dashboard persona/operator instructions can condition the team
prompts without replacing the schema contract. Prompt and response traces may include
operational details, so configure their retention and access deliberately.

### Training, evaluation and benchmark methodology

The main PPO settings are in `configs/agents/base.yaml`; the `generalist` recipe in
`configs/recipes/generalist.yaml` sets a configured budget of 500,000 agent steps per
training seed, checkpoints every 50,000 steps, demand profiles and event scenarios. The
training page can submit its own step budget (100,000 by default in the UI), overriding
the recipe budget for that job. Multiple training seeds create separate training runs;
the requested step budget applies per seed. Checkpoint selection uses validation
conditions and should remain separate from final evaluation seeds.

An evaluation episode runs a controller in SUMO and records traffic outcomes and, for LLM
methods, call health such as errors, fallbacks, latency and token use when available.
Comparisons should use identical network, demand, scenario and test seeds across methods.
The full protocol has a 15-minute warm-up, a 60-minute measurement window and a
15-minute cooldown. `quick` uses shorter windows and is intended for smoke testing, not
for final performance claims.

The repository has distinct experiment paths:

- `python -m cotraffic evaluate --experiment <name>` runs a configured experiment matrix,
  writes raw run data, and can be followed by `aggregate` and `tables`.
- `POST /api/compare` runs a smaller interactive method comparison, quick by default and
  limited to at most five seeds.
- Model benchmark endpoints evaluate registered checkpoints over seeds/conditions.
- Dashboard charts may use exported result files; they are not automatically a live view
  of every experiment job.

Reports include traffic metrics such as waiting and travel time, throughput, speed,
emissions and stops, depending on the experiment. Statistical utilities provide bootstrap
confidence intervals, paired changes, effect sizes and multiple-comparison correction.
Interpret results with the number of seeds and the selected comparison path in mind;
quick runs and small seed counts are exploratory evidence, not proof of city-scale
effectiveness.

---

## 🚀 Quick Start

### Prerequisites
- [Eclipse SUMO](https://sumo.dlr.de/docs/Installing/index.html) ≥ 1.20
- Python ≥ 3.10
- Node.js and npm (frontend)
- WSL Ubuntu (optional, for Linux-native SUMO)

### Setup
```bash
git clone https://github.com/Esprit-School-of-Engineering-5DS8/intelligent-marl-traffic.git
cd intelligent-marl-traffic
pip install -r requirements.txt       # runtime
pip install -r requirements-dev.txt   # tests and linting (optional)
cd frontend && npm install
```

On Windows PowerShell, the equivalent frontend setup is:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

`npm install` is required on a fresh checkout before Vite is available.

### Run a scenario (cotraffic CLI)
```bash
python -m cotraffic networks --net grid2x2           # build the SUMO network
python -m cotraffic episode --net grid2x2 --demand medium --seconds 600
python -m cotraffic evaluate --experiment llm_ab_quick --jobs 1
python -m cotraffic evaluate --experiment llm_vs_rl --jobs 2   # LLM team vs trained RL arm
python -m cotraffic aggregate && python -m cotraffic tables
```

### Dashboard (live simulation + results)
```bash
uvicorn api.main:app --port 8000                     # backend
cd frontend && npm install && npm run dev            # Vite on :5173
python scripts/export_dashboard_data.py              # refresh served result files
```

### Screenshots

| Dashboard | Benchmark - Models & Runs |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Benchmark](docs/screenshots/benchmark.png) |

![Live map](docs/screenshots/live-map-events.png)

Captured from `npm run dev` with the API on `:8000`. The live map and the dashboard's
street panel are drawn with a public Mapbox `pk.` token read from the browser's
`localStorage`, so no token is committed with the screenshots. The live-map shot was taken during a running `grid-2x2` simulation
(`POST /api/simulation/start`, 4x speed) with vehicles and pedestrians on the network;
the dashboard shows the same basemap while its live panels are still waiting for the
run's feed. The registry row is a real `generalist`
checkpoint (`sf_mission_3x3`, PPO, seed 1); the 500k-step training run and its
validation-based checkpoint selection are separate, long-lived steps.

### Controller methods
| `method` | Description |
|------|-------------|
| `ft` | Fixed-time Webster plan (baseline) |
| `act` | Actuated gap-out / max-out |
| `mp` | Max-Pressure adaptive heuristic |
| `ev_rule`, `ev_rule_mp` | Emergency pre-emption |
| `ped_rule_mp` | Pedestrian-aware MP |
| `ind`, `coop`, `coop_full`, `coop_eco*` | PPO learned variants (checkpoint required) |
| `dqn` | DQN comparison agent |
| `llm` | Batched language-model controller, MP fallback |
| `llm_team` | Three-role LLM team (Operator, Emergency, Pedestrian) over Max-Pressure; typed directives are validated, arbitrated and then passed through the safety shield |

`generalist` is the flagship learned policy (all demand levels and event scenarios, one
checkpoint per training seed). `configs/experiments/llm_vs_rl.yaml` runs it head-to-head
against `llm_team` on the same seeds; set `COTRAFFIC_LLM_BACKEND=mock` to run the LLM arm
without spending tokens, and train + select a `generalist` checkpoint first.

Full architecture, controller catalog and A/B protocol: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 💼 Product and Commercial Perspective

### Value proposition

KEMETRA is a **simulation-first decision-support and experimentation platform** for
testing adaptive traffic-control strategies before considering field deployment. Its
potential value is to help a transport authority, engineering consultancy or smart-city
team:

- compare fixed-time, actuated, rule-based, RL and LLM-assisted control under repeatable
  simulated conditions;
- examine trade-offs among vehicle delay, throughput, emissions, pedestrian service and
  emergency response;
- inspect live simulations, experiment runs, controller status and supporting metrics in
  one dashboard;
- explore AI-assisted operator workflows while retaining bounded outputs, conventional
  fallback behavior and a software safety layer.

Potential use cases include corridor planning, traffic-signal strategy evaluation,
emergency-route scenario studies, pedestrian-priority analysis, training and
demonstrations, and controlled research pilots. These are intended use cases, not claims
of proven improvements in a live city.

### Potential stakeholders and business model

Possible stakeholders are municipalities and transport agencies, traffic-system
integrators, urban-planning consultancies, universities and smart-city research programs.
Potential commercial models to validate with customers include:

- a paid simulation and analytics platform subscription;
- project-based network modelling and benchmark studies;
- deployment/integration and support services for existing traffic-management systems;
- a private or on-premises edition for organizations with stricter data and infrastructure
  requirements.

These are **business hypotheses**, not current sales offerings or existing revenue
streams. Pricing, procurement requirements, willingness to pay, integration effort and
service-level expectations have not been established by the codebase.

Likely cost drivers to measure during a pilot include SUMO simulation and model-training
compute, storage for runs/checkpoints/traces, map/data services, integration and support
time, and (for live LLM providers) input/output tokens, retries and network/service
availability. The configured token-price fields can report an estimate when populated;
they are not a quote or a complete total-cost-of-ownership model.

### Readiness, requirements and risk

The present product is a research/demo prototype. Before operational deployment, it would
need validated city-specific networks and demand data, comparison against the incumbent
signal system, field and hardware-in-the-loop trials, independent safety assessment,
fail-safe operating procedures, security review, monitoring, maintenance and appropriate
regulatory/procurement approval. An LLM provider may introduce network latency, service
availability, token costs and model-version variability; the controller's deterministic
fallback and safety checks reduce some operational dependencies but do not replace
certification or human/operator governance.

The dashboard/API should be deployed behind organizational authentication and network
controls. Keep provider keys server-side, configure allowed frontend origins, limit job
and LLM-call budgets, and review trace retention before using sensitive operational data.
Do not expose an unauthenticated development API or treat generated LLM directives as
independently safety-certified commands.

### Commercial success measures to validate

An eventual pilot should set baselines and acceptance thresholds with the operator before
testing. Candidate measures include average and tail delay, throughput, person-weighted
delay, CO₂/fuel, pedestrian waiting, emergency corridor travel time, fallback rate,
controller availability, operating cost per simulated/controlled hour and integration
effort. No percentage improvement or financial saving is claimed by this repository
without a measured, documented experiment.

---

## 👥 Team & Responsibilities

| Member | Role | Objectives |
|--------|------|------------|
| Hazem Mrad | Simulation & Environment Lead | F1, F2 - SUMO scenarios, data pipeline, baselines |
| Bilel Brini | RL Agent Developer | F3, M1, M3 - DQN/PPO, multi-agent, emissions |
| Lina Haddad | Pedestrian & Safety Module | S1, S2, S3 - pedestrian-adaptive signals, safety |
| Amen Allah Ben Aissa | Emergency Priority | E1, E2 - green corridor, EV detection & ETA |
| Rami Ben Slimen | Evaluation & Forecasting | F4, F5, M2 - experiments, visualization, reporting |

---

## 📊 Key Metrics Tracked

- `avg_speed_m_s` - Network mean vehicle speed
- `total_waiting_time_s` - Total vehicle delay per step
- `arrived_vehicles` - Throughput (vehicles reaching destination)
- `co2_mg_s` - CO2 emissions
- `fuel_ml_s` - Fuel consumption

---

## 🎨 Design Thinking Process

This project follows the **Design Thinking** methodology:

| Phase | Status | Deliverable |
|-------|--------|-------------|
| Empathize | ✅ Done | Personas: Mehdi (driver), Sarra (pedestrian), Sonia (EV responder), Karim (operator) |
| Define | ✅ Done | Problem statement, POV statements, HMW questions, success criteria |
| Ideate | 🟡 In Progress | Approach shortlist, chosen direction |
| Prototype | 🟡 In Progress | Working SUMO + MARL prototype |
| Test | 🔴 Planned | Experiment results, data-driven evidence vs baseline |

---

## 📜 License

MIT License - see [LICENSE](LICENSE)
