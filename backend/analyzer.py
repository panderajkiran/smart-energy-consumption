import pandas as pd
import numpy as np


def analyze(df: pd.DataFrame) -> dict:
    """
    Run full statistical analysis and wastage detection on the energy DataFrame.
    Returns a structured stats dict and human-readable predictions.
    """
    energy = df["energy"]

    total = round(float(energy.sum()), 2)
    average = round(float(energy.mean()), 2)
    maximum = round(float(energy.max()), 2)
    minimum = round(float(energy.min()), 2)

    # Wastage detection — values beyond mean + 1.5 * std are considered wastage
    mean = energy.mean()
    std = energy.std()
    threshold = mean + 1.5 * std
    wastage_mask = energy > threshold
    wastage_count = int(wastage_mask.sum())
    wastage_pct = round((wastage_count / len(energy)) * 100, 1)

    # Peak period
    peak_label = _get_peak_label(df)

    # Monthly breakdown (if timestamp available)
    monthly = _monthly_breakdown(df)

    stats = {
        "total_consumption": total,
        "average_usage": average,
        "max_usage": maximum,
        "min_usage": minimum,
        "peak_usage": peak_label,
        "wastage_percentage": wastage_pct,
        "wastage_threshold": round(float(threshold), 2),
        "monthly_breakdown": monthly,
    }

    predictions = _generate_predictions(stats, df)

    return {"stats": stats, "predictions": predictions}


def _get_peak_label(df: pd.DataFrame) -> str:
    if "timestamp" in df.columns and pd.api.types.is_datetime64_any_dtype(df["timestamp"]):
        df = df.dropna(subset=["timestamp"])
        if df.empty:
            return "N/A"
        peak_row = df.loc[df["energy"].idxmax()]
        ts = peak_row["timestamp"]
        return ts.strftime("%Y-%m-%d %H:%M") if pd.notna(ts) else "N/A"
    else:
        idx = df["energy"].idxmax()
        return f"Row {idx}"


def _monthly_breakdown(df: pd.DataFrame) -> list:
    if "timestamp" not in df.columns or not pd.api.types.is_datetime64_any_dtype(df["timestamp"]):
        return []
    df = df.dropna(subset=["timestamp"])
    df["month"] = df["timestamp"].dt.to_period("M").astype(str)
    monthly = df.groupby("month")["energy"].sum().reset_index()
    monthly.columns = ["month", "total"]
    monthly["total"] = monthly["total"].round(2)
    return monthly.to_dict(orient="records")


def _generate_predictions(stats: dict, df: pd.DataFrame) -> dict:
    avg = stats["average_usage"]
    wastage = stats["wastage_percentage"]
    peak = stats["peak_usage"]
    total = stats["total_consumption"]

    summary_parts = [
        f"Your total energy consumption is {total} kWh with an average of {avg} kWh per reading.",
        f"Peak usage was recorded at: {peak}.",
    ]

    recommendations = []

    if wastage > 20:
        summary_parts.append(
            f"⚠️ {wastage}% of your readings show abnormally high consumption — significant wastage detected."
        )
        recommendations.append(
            f"Reduce heavy appliance usage during peak hours. This could save up to {round(wastage * 0.6, 1)}% energy."
        )
        recommendations.append("Consider scheduling high-load tasks (washing, heating) during off-peak hours.")
    elif wastage > 10:
        summary_parts.append(
            f"Your energy usage has {wastage}% readings above normal threshold — moderate wastage detected."
        )
        recommendations.append("Monitor appliances during high-usage periods to identify energy hogs.")
        recommendations.append("Switching to energy-efficient appliances could reduce consumption by 10–15%.")
    else:
        summary_parts.append("Your energy consumption pattern looks relatively stable with minimal wastage.")
        recommendations.append("Maintain your current usage habits — they are within healthy limits.")
        recommendations.append("Consider solar energy options to further reduce your grid dependency.")

    recommendations.append(
        "Turning off standby devices and using smart plugs can save 5–10% on your energy bill."
    )

    return {
        "summary": " ".join(summary_parts),
        "recommendations": recommendations,
    }
