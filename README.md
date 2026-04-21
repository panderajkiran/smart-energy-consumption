# ⚡ Smart Energy Consumption Analyzer

Analyze your home energy CSV data, detect wastage spikes, and get AI-powered recommendations — all in a beautiful dark-mode dashboard.

---

## 🏗️ Project Structure

```
SmartEnergyConsumption/
├── backend/          # FastAPI Python API
│   ├── main.py
│   ├── data_parser.py
│   ├── analyzer.py
│   ├── visualizer.py
│   ├── utils.py
│   ├── requirements.txt
│   ├── Procfile        ← for Render deployment
│   └── runtime.txt     ← Python 3.11
│
├── frontend/         # Next.js 16 app
│   ├── app/
│   ├── components/
│   ├── .env.example  ← copy to .env.local
│   └── package.json
│
├── sample_data/
│   └── energy_sample.csv
│
└── vercel.json       ← Vercel config
```

---

## 🚀 Local Development

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

API runs at → `http://127.0.0.1:8000`

### 2. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local   # copy env template
npm install
npm run dev
```

App runs at → `http://localhost:3000`

---

## 🌐 Deployment

### Backend → [Render](https://render.com) (Free tier)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** → `backend`
5. Set **Build Command** → `pip install -r requirements.txt`
6. Set **Start Command** → `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variable:
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app` ← (set AFTER Vercel deploy)
8. Click **Deploy**

### Frontend → [Vercel](https://vercel.com) (Free tier)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** → `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com` ← from Render dashboard
5. Click **Deploy**

> **Important:** After both are deployed, update `ALLOWED_ORIGINS` on Render with your actual Vercel URL, then redeploy the backend.

---

## 📊 Features

- Upload CSV / Excel energy datasets
- Auto-detects date & energy columns
- Stats: total, average, max, min, peak usage
- Wastage detection (mean + 1.5σ threshold)
- Monthly breakdown
- 3 dark-mode charts (line, bar, distribution)
- AI-generated recommendations

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Vanilla CSS |
| Backend | FastAPI, Python 3.11 |
| Charts | Matplotlib (server-side → base64) |
| Data | Pandas, NumPy |
| Deploy | Vercel (frontend) + Render (backend) |
