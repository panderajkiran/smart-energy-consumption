from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback
import os

from data_parser import parse_file
from analyzer import analyze
from visualizer import generate_charts

app = FastAPI(title="Smart Energy Consumption Analyzer", version="1.0.0")

# CORS — set ALLOWED_ORIGINS env var on Render with your Vercel URL(s)
# e.g. ALLOWED_ORIGINS=https://smart-energy.vercel.app,https://localhost:3000
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Smart Energy Consumption Analyzer API is running ✅"}


@app.post("/analyze")
async def analyze_energy(file: UploadFile = File(...)):
    """
    Accepts a CSV or Excel energy dataset.
    Returns stats, base64 charts, and human-readable predictions.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    contents = await file.read()

    try:
        # Step 1: Parse the uploaded file into a DataFrame
        df = parse_file(contents, file.filename)

        # Step 2: Run statistical analysis + wastage detection
        result = analyze(df)
        stats = result["stats"]
        predictions = result["predictions"]

        # Step 3: Generate charts
        charts = generate_charts(df, threshold=stats["wastage_threshold"])

        return {
            "stats": {
                "total_consumption": stats["total_consumption"],
                "average_usage": stats["average_usage"],
                "max_usage": stats["max_usage"],
                "min_usage": stats["min_usage"],
                "peak_usage": stats["peak_usage"],
                "wastage_percentage": stats["wastage_percentage"],
                "monthly_breakdown": stats["monthly_breakdown"],
            },
            "charts": charts,
            "predictions": predictions,
        }
    except HTTPException:
        raise
    except Exception as e:
        detail = str(e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {detail}")
