// Everything about you lives here. The pages read from this file.

export const site = {
  name: 'Bilel Brini',
  role: 'Data scientist working on machine learning, LLMs and applied AI',
  location: 'Tunis',
  timezone: 'Africa/Tunis',
  email: 'bilel.brini@esprit.tn',
  available: true,
  intro: 'I build AI systems on top of real data: machine learning models, LLM and RAG pipelines, and the interfaces that make their output usable by whoever has to act on it.',
  socials: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/bilel-brini' },
    { label: 'Email', href: 'mailto:bilel.brini@esprit.tn' },
  ],
  marquee: [
    'Machine learning',
    'LLMs and RAG',
    'Deep learning',
    'NLP',
    'Computer vision',
    'Predictive modelling',
    'Reinforcement learning',
    'Multi-agent systems',
  ],
}

// The readout under the hero name. Four short facts, kept in mono type.
export const heroStats = [
  { label: 'Focus', value: 'Machine learning, LLMs and applied AI' },
  { label: 'Studying', value: 'Engineering, data science and AI at ESPRIT' },
  { label: 'Stack', value: 'Python, TensorFlow, FastAPI, React' },
  { label: 'Status', value: 'Open to a 6-month internship from January 2027' },
]

export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  cover?: string
  coverAspectRatio?: string
  gallery?: { src: string; alt: string; aspectRatio?: string }[]
  tint: string
  summary: string
  role: string[]
  deliverables: string[]
  link?: string
  body: string[]
  size: 'large' | 'small'
}

export const projects: Project[] = [
  {
    slug: 'turnover',
    title: 'Turnover Analytics',
    client: 'Ooredoo HR',
    category: 'HR analytics',
    year: '2026',
    cover: '/images/Turnover/DashboardPowerBi.png',
    coverAspectRatio: '1075 / 582',
    gallery: [
      { src: '/images/Turnover/GestionEmp.png', alt: 'Employee management dashboard with department, attrition and risk-score filters', aspectRatio: '1466 / 706' },
      { src: '/images/Turnover/DynamiqueScoring.png', alt: 'Explainable employee turnover score with configurable risk thresholds and factor contributions', aspectRatio: '1477 / 702' },
      { src: '/images/Turnover/PredictionML.png', alt: 'Machine-learning attrition prediction result with probability, risk level and selected model', aspectRatio: '1457 / 697' },
      { src: '/images/Turnover/Alertes.png', alt: 'Alert management dashboard with configurable thresholds and severity filters', aspectRatio: '1478 / 697' },
      { src: '/images/Turnover/RecommAI.png', alt: 'Employee-specific HR retention recommendations based on risk factors', aspectRatio: '1456 / 690' },
      { src: '/images/Turnover/Simulation.png', alt: 'What-if simulation for estimating how HR factors change an employee risk score', aspectRatio: '1466 / 739' },
      { src: '/images/Turnover/SuiviActionsRH.png', alt: 'HR action tracking with completion status and score history', aspectRatio: '1465 / 698' },
    ],
    tint: '#0a1422',
    summary: 'An HR analytics platform that combines explainable turnover risk scoring, separate machine-learning predictions and practical retention follow-up tools.',
    role: ['HR analytics', 'Machine learning', 'Full-stack'],
    deliverables: ['React + Spring Boot HR platform', 'Explainable 0–100 business risk scoring', 'FastAPI Logistic Regression and SVM prediction service', 'Alerts, recommendations and HR action tracking'],
    body: [
      'Turnover Analytics brings employee records, attrition dashboards and retention follow-up into one HR application. Its configurable business score is separate from the ML predictions: it adds interpretable points across eight factors such as tenure, overtime, satisfaction and promotion history, then shows the reasons behind each risk band.',
      'A separate FastAPI service serves Logistic Regression and RBF-kernel SVM models with saved preprocessing and model-specific thresholds. On the documented holdout set, Logistic Regression reached 85.0% accuracy and 0.811 ROC-AUC; SVM reached 85.7% accuracy and 0.811 ROC-AUC. These are dataset-specific reference results, not guarantees. MLP, LSTM and TabNet are notebook experiments, not models served by the current API.',
      'The React frontend and Spring Boot API support employee management, score simulation and history, configurable alerts, HR actions, and employee-specific recommendations. Optional AI recommendations and HR-assistant responses use OpenRouter when configured, with a business-rule fallback; risk scores and predictions are decision-support signals for HR, not standalone grounds for employment decisions.',
    ],
    size: 'large',
  },
  {
    slug: 'emotion',
    title: 'Face & Emotion Recognition',
    client: 'Capgemini',
    category: 'Computer vision',
    year: '2025',
    tint: '#0a1726',
    cover: '/images/EmotionDetection/cadrerlesvisagfesetcomparerladistance.png',
    coverAspectRatio: '784 / 572',
    gallery: [
      { src: '/images/EmotionDetection/heureux.jpg', alt: 'Example output labelled happy after an on-demand facial-expression analysis', aspectRatio: '1169 / 912' },
      { src: '/images/EmotionDetection/neutre.jpg', alt: 'Example output labelled neutral after an on-demand facial-expression analysis', aspectRatio: '1169 / 912' },
      { src: '/images/EmotionDetection/sad.jpg', alt: 'Example output labelled sad after an on-demand facial-expression analysis', aspectRatio: '1169 / 912' },
    ],
    summary: 'A JavaFX desktop app combining webcam face detection, profile-based face recognition and on-demand facial-expression analysis.',
    role: ['Java', 'OpenCV', 'DeepFace'],
    deliverables: ['JavaFX desktop application', 'Haar-cascade face detection and LBPH recognition', 'On-demand DeepFace emotion analysis', 'MariaDB/MySQL user profiles'],
    body: [
      'This desktop application brings webcam-based face detection, profile management and facial-expression analysis into one JavaFX workflow. OpenCV detects faces with a Haar cascade, while LBPH compares captured faces against profile data for recognition.',
      'Expression analysis is triggered by the user: the app captures the detected face and passes it to DeepFace with TensorFlow, then displays the predicted dominant label. It is not continuous video analysis, and the captured image is temporary rather than saved through this analysis flow.',
    ],
    size: 'small',
  },
  {
    slug: 'traffic',
    title: 'SUMO Traffic Control',
    client: 'Academic project · Esprit 5DS8',
    category: 'Traffic simulation & AI',
    year: '2026',
    cover: '/images/Intelligent-Marl-Traffic-images/dashboard.png',
    coverAspectRatio: '1883 / 871',
    gallery: [
      { src: '/images/Intelligent-Marl-Traffic-images/dashboard2.png', alt: 'SUMO traffic operations dashboard with live simulation, incidents and network metrics', aspectRatio: '1887 / 872' },
      { src: '/images/Intelligent-Marl-Traffic-images/dashboardcompar.png', alt: 'Side-by-side comparison of traffic controllers in a SUMO simulation', aspectRatio: '1861 / 847' },
      { src: '/images/Intelligent-Marl-Traffic-images/benchmark.png', alt: 'Benchmark chart comparing traffic and emergency-response metrics across controllers', aspectRatio: '1242 / 646' },
      { src: '/images/Intelligent-Marl-Traffic-images/mapbox.png', alt: 'Three-dimensional live traffic map with intersection status, vehicles and pedestrians', aspectRatio: '1886 / 857' },
      { src: '/images/Intelligent-Marl-Traffic-images/mapbox2.png', alt: 'SUMO city-scale map view with simulated traffic and operator controls', aspectRatio: '1891 / 867' },
      { src: '/images/Intelligent-Marl-Traffic-images/sumoInterfaceHavingAccident.png', alt: 'SUMO microscopic traffic simulation showing an accident scenario at an intersection', aspectRatio: '933 / 915' },
    ],
    tint: '#0b1224',
    summary: 'A SUMO-based urban traffic research prototype for comparing adaptive, reinforcement-learning and LLM-assisted controllers in reproducible simulations.',
    role: ['Multi-agent reinforcement learning', 'Traffic simulation', 'AI-assisted control'],
    deliverables: ['SUMO + PettingZoo simulation environment', 'PPO policies and rule-based baselines', 'LLM-assisted controller with validation and safety shield', 'SUMO operations and benchmark dashboard'],
    body: [
      'SUMO Traffic Control is an academic research project exploring urban traffic strategies in Eclipse SUMO. Its Python simulation exposes intersections through a PettingZoo environment, while the dashboard supports live runs, controller configuration and experiment comparisons. The 2×2 validation and 3×3 benchmark scenarios are in progress; the Monaco scenario is planned.',
      'The project compares conventional controllers such as fixed-time Webster and Max-Pressure with learned PPO policies and optional LLM-assisted controllers. PPO uses a parameter-shared policy; it is not an explicit MAPPO implementation. The LLM team proposes bounded operator, emergency and pedestrian directives over a Max-Pressure baseline; application code validates and arbitrates them, with a safety shield before signal actions.',
      'Evaluation tracks measures such as waiting and travel time, throughput, emissions, pedestrian service and emergency response. Results depend on the scenario, seeds and evaluation protocol; quick runs are exploratory. This is a simulation research prototype, not a certified traffic system, and the repository does not claim measured city-scale improvements.',
    ],
    size: 'large',
  },
  {
    slug: 'grant-panel',
    title: 'Yale Grant Panel',
    client: 'Academic project · Yale SFS demo',
    category: 'AI decision support',
    year: '2026',
    cover: '/images/Grant-Panel-automation-images/overview.png',
    coverAspectRatio: '1258 / 576',
    gallery: [
      { src: '/images/Grant-Panel-automation-images/n8nWorkflow.png', alt: 'n8n workflow orchestrating proposal review, independent criterion reviews, disagreement handling and human sign-off', aspectRatio: '1907 / 897' },
      { src: '/images/Grant-Panel-automation-images/Decision.png', alt: 'Committee workspace for reviewing evidence and recording a human chair decision', aspectRatio: '1600 / 900' },
      { src: '/images/Grant-Panel-automation-images/Rules.png', alt: 'Yale fellowship rules knowledge base and RAG retrieval interface', aspectRatio: '1254 / 582' },
      { src: '/images/Grant-Panel-automation-images/Cvdeposit.png', alt: 'Applicant portal CV upload step', aspectRatio: '1257 / 594' },
      { src: '/images/Grant-Panel-automation-images/VideoDeposit.png', alt: 'Applicant portal video motivation submission step', aspectRatio: '1206 / 562' },
      { src: '/images/Grant-Panel-automation-images/login.png', alt: 'Applicant sign-in screen for the demo portal', aspectRatio: '1238 / 578' },
    ],
    tint: '#0d1526',
    summary: 'An academic grant-review decision-support demo that combines applicant evidence, policy retrieval and advisory AI assessments in a human-led committee workflow.',
    role: ['AI automation', 'RAG', 'Full-stack'],
    deliverables: ['FastAPI review API', 'React + Vite applicant and committee portal', 'n8n review orchestration', 'Human-reviewed audit and sign-off'],
    body: [
      'Built as an academic demo for a Yale Student Financial Services fellowship-review scenario, the system organizes applications, CVs and motivation videos alongside a committee review portal. It is not an official Yale service, and its cohort benchmarks use synthetic applications.',
      'The n8n workflow coordinates three independent, criterion-focused LLM review calls for academic merit, impact and budget. A FastAPI backend handles evidence processing, TF-IDF retrieval over policy documents, disagreement checks and score aggregation; a chair synthesis is conditional on disagreement. The reviewer roles are separate calls, not separate deployed AI services.',
      'AI assessments are advisory: a committee member records the final decision. In a reported benchmark of 20 synthetic dossiers over three runs, the full system reached Kendall’s τ = 0.9575 against human-consensus ordering; the no-discussion ablation reached 0.9921, so the project does not claim that the full system always ranks better.',
    ],
    size: 'small',
  },
  {
    slug: 'alia',
    title: 'ALIA Interactive Avatar',
    client: 'Vital Laboratoire',
    category: 'Medical AI avatar',
    year: '2026',
    cover: '/images/Alia/ConversationAvatar.png',
    coverAspectRatio: '1273 / 638',
    gallery: [
      { src: '/images/Alia/FirstPage.png', alt: 'ALIA landing page for medical team training', aspectRatio: '1274 / 598' },
      { src: '/images/Alia/MedicalDelagate.png', alt: 'Medical delegate dashboard with competency and compliance metrics', aspectRatio: '1274 / 570' },
      { src: '/images/Alia/SimulationDashboard.png', alt: 'Dashboard for reviewing medical training simulations', aspectRatio: '1258 / 609' },
      { src: '/images/Alia/DelegateScore.png', alt: 'Detailed performance and communication scores from a simulation', aspectRatio: '1270 / 602' },
    ],
    tint: '#0a1822',
    summary: 'A voice-driven AI avatar for pharmaceutical teams, combining doctor role-play training with a grounded scientific co-pilot for live visits.',
    role: ['Data science', 'GraphRAG', 'Multimodal AI'],
    deliverables: ['Whisper speech recognition', 'LangGraph + Neo4j GraphRAG', 'Llama 3.7 via Groq', 'ANAM AI avatar'],
    body: [
      'Built by the HexaMind team with Vital Laboratoire, ALIA is an AI companion for pharmaceutical medical representatives. Training Mode simulates conversations with virtual doctors and pharmacists, while Commercial Mode supports live visits with structured, profile-aware scientific presentations.',
      'The voice pipeline transcribes speech with Whisper, retrieves product and clinical context through LangGraph-orchestrated GraphRAG on a Neo4j knowledge graph, and generates grounded replies with Llama 3.7 via Groq. ANAM AI renders the response as a real-time avatar with voice and lip-sync.',
      'The report records 93% speech-to-text accuracy, an 88/100 response-relevance score, 450 ms avatar latency and an 85% end-to-end success rate on the evaluation set.',
    ],
    size: 'small',
  },
  {
    slug: 'tb-detect',
    title: 'TB-Detect',
    client: 'Academic project',
    category: 'Medical imaging',
    year: '2025',
    tint: '#0c1420',
    summary: 'A CNN that reads chest X-rays for signs of tuberculosis, behind the preprocessing that makes the images comparable.',
    role: ['Deep learning', 'Medical imaging'],
    deliverables: ['CNN classifier', 'Image preprocessing', 'Data augmentation'],
    body: [
      'Chest X-rays vary by machine, exposure and patient before they vary by disease. Most of the work was making the images comparable enough for a classifier to learn something real.',
      'I handled the preprocessing and augmentation, then trained a CNN to classify the scans and measured it on held-out data rather than on the training set.',
    ],
    size: 'small',
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const services = [
  {
    title: 'Machine learning',
    body: 'Classification, regression and deep learning on real, messy data: MLPs, LSTMs, TabNet, CNNs. The model matters less than the validation, the split, the calibration, and the metric that matches the decision being made with it.',
  },
  {
    title: 'LLMs and applied AI',
    body: 'LLM assistants, retrieval over your own documents, multi-agent workflows and prompt pipelines, built around what the model is allowed to say and not only what it can do.',
  },
  {
    title: 'Computer vision',
    body: 'CNN pipelines for detection and recognition, from a live webcam feed to a scanned slide, with preprocessing in OpenCV and inference kept fast enough to be useful.',
  },
  {
    title: 'Delivery',
    body: 'FastAPI and Spring Boot services, React interfaces, dashboards and alerts. A score that nobody sees at the moment of the decision is not yet a system.',
  },
]

export const experience = [
  { period: 'Jun to Aug 2026', title: 'Ooredoo Tunisie', detail: 'Internship: turnover prediction and HR analytics' },
  { period: 'Jun to Aug 2025', title: 'Capgemini', detail: 'Internship: real-time facial emotion recognition' },
]

export const education = [
  { period: '2022 to now', title: 'ESPRIT, Tunis', detail: 'Engineering degree in computer science, data science and AI' },
  { period: '2022', title: 'Baccalaureate', detail: 'Scientific stream, honours, 13.35/20' },
]

export const certifications = [
  { issuer: 'NVIDIA', title: 'Transformer-based NLP applications' },
  { issuer: 'NVIDIA', title: 'Deep learning fundamentals' },
  { issuer: 'NVIDIA', title: 'AI for anomaly detection' },
  { issuer: 'Cisco', title: 'CCNA routing and switching' },
  { issuer: 'AWS Academy', title: 'Cloud foundations graduate' },
  { issuer: 'Hedera', title: 'Certified associate developer' },
]

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'B2' },
  { name: 'English', level: 'B2' },
  { name: 'Spanish', level: 'Beginner' },
]

export const skills = [
  { label: 'Languages', items: 'Python, C/C++, Java, PHP, R, SQL' },
  { label: 'Statistics', items: 'Statistics, probability, predictive modelling, model evaluation, scenario simulation' },
  { label: 'Data and AI', items: 'Machine learning, deep learning, NLP, LLMs, RAG, reinforcement learning, computer vision, TensorFlow, Power BI' },
  { label: 'Development', items: 'FastAPI, Spring Boot, React, Symfony, REST APIs' },
  { label: 'Data stores', items: 'MySQL, MongoDB' },
  { label: 'Tools', items: 'Git, Docker, Jupyter, SUMO, TraCI, n8n, Tableau, Excel' },
]
