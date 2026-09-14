# Google Cloud Certified Professional ML Engineer Flashcards

A tactile, distraction-free study tool containing all **65 original practice questions** and deep architectural breakdowns for the **Google Cloud Professional Machine Learning Engineer** certification exam.

Deployed as a zero-dependency static web application ready for **GitHub Pages** on mobile and desktop.

---

## Features

- **All 65 Original Practice Questions**: 100% original, fabricated scenarios covering modern GCP AI/ML production patterns (Gemini 1.5, Vector Search, Feature Store, vLLM, TPU v5e, Pipelines, and MLOps) while adhering to exam confidentiality policies.
- **Clean Architectural Explanations**: Direct, comprehensive explanations focusing on the recommended architecture and key engineering concepts (no multiple-choice distractors cluttering the study flow).
- **Solid Color Tactile Design**: Distinctive solid category colors (Amber, Royal Violet, Indigo, Teal, Rose, Sapphire Blue) paired with high-contrast typography and a clean, non-AI-slop layout.
- **Mobile Touch Gestures**: Full mobile touch support with swipe-left (next), swipe-right (previous), and tap-to-flip, with isolated touch boundaries.
- **Deep Explanations**: Every question includes:
  - The exact recommended GCP action.
  - **Architectural Explanation & Key Concepts**: Why the solution satisfies constraints (cost, latency, MLOps best practices).
- **Fast Keyboard Navigation**:
  - `←` / `→` or `K` / `J`: Previous / Next card
  - `Space` or `Enter`: Reveal / Hide answer
  - `M`: Mark card as Mastered / Needs Review
  - `G`: Open question navigator grid (65 cards)
- **Study Progress Tracking**: Tracks mastered cards locally in your browser (`localStorage`).
- **Topic & Keyword Search**: Filter by domain or search for specific technologies (*AutoSxS*, *Slurm*, *DLP*, *ARIMA_PLUS*, *vLLM*, *TPU v5e*, *GCSFUSE*).
- **Dark Mode**: Neutral, eye-friendly dark theme.
- **Zero Dependencies**: Pure HTML, Vanilla CSS, and JavaScript. Runs offline and requires no build tools or servers.

---

## Exam Topics Covered

1. **Monitoring & Drift**: Vertex AI Model Monitoring, concept & data drift, training-serving skew, sampling rates.
2. **GenAI & LLMs**: Fine-tuning Gemini Flash vs. Pro, Model Garden, AutoSxS (LLM-as-a-judge), Agent Search, RAG with Vector Search.
3. **MLOps & CI/CD**: Vertex AI Pipelines (Kubeflow KFP SDK), Artifact Registry, Cloud Build triggers, VPC Service Controls perimeters.
4. **Data & Feature Engineering**: Vertex AI Feature Store (point-in-time lookups, low-latency online serving), Dataflow streaming, BigQuery ML (`ARIMA_PLUS`).
5. **Serving & Distributed Infrastructure**: Slurm clusters with Lustre on B200 GPUs, TPU v5e pod parallelism (data vs. model parallelism), GPU duty cycle autoscaling, custom container inference routines.
6. **Security & Sensitive Data**: DLP API (Sensitive Data Protection) for de-identification vs. Cloud Natural Language API.

---

## Deploying to GitHub Pages

Follow these simple steps to deploy your flashcards for free on GitHub Pages:

### Step 1: Initialize Git and Commit
In your terminal (inside this folder):

```bash
git init
git add .
git commit -m "Add 65 GCP MLE flashcards"
```

### Step 2: Push to GitHub
Create a new repository on [GitHub](https://github.com/new) named `gcpmle-flashcards`, then run:

```bash
git remote add origin https://github.com/<YOUR_USERNAME>/gcpmle-flashcards.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click on **Settings**.
2. In the left sidebar, click on **Pages**.
3. Under **Build and deployment** -> **Branch**:
   - Select `main` branch.
   - Select `/ (root)` folder.
   - Click **Save**.
4. Within 1-2 minutes, your flashcards will be live at:
   `https://<YOUR_USERNAME>.github.io/gcpmle-flashcards/`

---

## Local Development

Simply open `index.html` in any web browser:

- Double-click `index.html` in File Explorer, or
- Run a lightweight local server:
  ```bash
  python -m http.server 8000
  ```
  and visit `http://localhost:8000`.

---

## License

Personal study and education reference material.
