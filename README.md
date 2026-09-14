# Google Cloud Certified Professional ML Engineer Flashcards

A minimalist, distraction-free study tool containing all **50 real-world practice questions** and deep architectural breakdowns for the **Google Cloud Professional Machine Learning Engineer** certification exam.

Deployed as a zero-dependency static web application ready for **GitHub Pages**.

---

## Features

- **All 50 Practice Questions**: Thorough scenarios covering modern GCP AI/ML production patterns.
- **Clean & Minimal UI**: Strict typographic hierarchy, neutral color palette, zero AI-slop (no gradients, glassmorphism, or irregular alignments).
- **Deep Explanations**: Every question includes:
  - The exact recommended GCP action.
  - **Key Rationale & Architecture**: Why the solution satisfies constraints (cost, latency, MLOps best practices).
  - **Distractor Analysis**: Detailed breakdown of why each incorrect option fails or is suboptimal.
- **Fast Keyboard Navigation**:
  - `←` / `→` or `K` / `J`: Previous / Next card
  - `Space` or `Enter`: Reveal / Hide answer
  - `M`: Mark card as Mastered / Needs Review
  - `G`: Open question navigator grid
- **Study Progress Tracking**: Tracks mastered cards locally in your browser (`localStorage`).
- **Topic & Keyword Search**: Filter by domain (e.g., *Monitoring & Drift*, *GenAI & LLMs*, *MLOps & CI/CD*, *Data & Feature Engineering*, *Serving & Infra*) or search for specific technologies (*AutoSxS*, *Slurm*, *DLP*, *ARIMA_PLUS*, *TensorBoard*).
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
git commit -m "Add 50 GCP MLE flashcards"
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
