import pandas as pd
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend — required for server use
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from utils import fig_to_base64


CHART_STYLE = {
    "bg": "#0f172a",
    "axes_bg": "#1e293b",
    "line": "#38bdf8",
    "bar": "#818cf8",
    "bar2": "#f472b6",
    "text": "#e2e8f0",
    "grid": "#334155",
    "spike": "#f87171",
}


def _apply_dark_style(fig, ax):
    fig.patch.set_facecolor(CHART_STYLE["bg"])
    ax.set_facecolor(CHART_STYLE["axes_bg"])
    ax.tick_params(colors=CHART_STYLE["text"])
    ax.xaxis.label.set_color(CHART_STYLE["text"])
    ax.yaxis.label.set_color(CHART_STYLE["text"])
    ax.title.set_color(CHART_STYLE["text"])
    for spine in ax.spines.values():
        spine.set_edgecolor(CHART_STYLE["grid"])
    ax.grid(color=CHART_STYLE["grid"], linestyle="--", linewidth=0.5, alpha=0.7)


def generate_charts(df: pd.DataFrame, threshold: float) -> list:
    charts = []

    charts.append(_line_chart(df, threshold))
    monthly = _monthly_bar_chart(df)
    if monthly:
        charts.append(monthly)
    charts.append(_distribution_chart(df, threshold))

    return charts


def _line_chart(df: pd.DataFrame, threshold: float) -> dict:
    fig, ax = plt.subplots(figsize=(10, 4))
    _apply_dark_style(fig, ax)

    x = df["timestamp"] if "timestamp" in df.columns and pd.api.types.is_datetime64_any_dtype(df["timestamp"]) else range(len(df))
    y = df["energy"].values

    ax.plot(x, y, color=CHART_STYLE["line"], linewidth=1.5, label="Energy Usage")
    ax.axhline(y=threshold, color=CHART_STYLE["spike"], linestyle="--", linewidth=1.2, label=f"Wastage Threshold ({round(threshold, 1)})")

    # Highlight spikes
    spike_mask = y > threshold
    if isinstance(x, pd.Series):
        ax.scatter(x[spike_mask], y[spike_mask], color=CHART_STYLE["spike"], s=20, zorder=5, label="Spikes")
    else:
        spike_x = [i for i, m in enumerate(spike_mask) if m]
        spike_y = [y[i] for i in spike_x]
        ax.scatter(spike_x, spike_y, color=CHART_STYLE["spike"], s=20, zorder=5, label="Spikes")

    if isinstance(x, pd.Series):
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
        fig.autofmt_xdate()

    ax.set_title("Energy Consumption Over Time", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Time")
    ax.set_ylabel("Energy (kWh)")
    legend = ax.legend(facecolor=CHART_STYLE["axes_bg"], edgecolor=CHART_STYLE["grid"], labelcolor=CHART_STYLE["text"])

    plt.tight_layout()
    b64 = fig_to_base64(fig)
    plt.close(fig)
    return {"title": "Energy Consumption Over Time", "image": b64}


def _monthly_bar_chart(df: pd.DataFrame):
    if "timestamp" not in df.columns or not pd.api.types.is_datetime64_any_dtype(df["timestamp"]):
        return None
    df = df.dropna(subset=["timestamp"])
    df["month"] = df["timestamp"].dt.to_period("M").astype(str)
    monthly = df.groupby("month")["energy"].sum()

    if len(monthly) < 2:
        return None

    fig, ax = plt.subplots(figsize=(10, 4))
    _apply_dark_style(fig, ax)

    bars = ax.bar(monthly.index, monthly.values, color=CHART_STYLE["bar"], edgecolor=CHART_STYLE["bg"], width=0.6)

    # Color-code highest bar
    max_idx = monthly.values.argmax()
    bars[max_idx].set_color(CHART_STYLE["bar2"])

    ax.set_title("Monthly Energy Usage", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Month")
    ax.set_ylabel("Total Energy (kWh)")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()

    b64 = fig_to_base64(fig)
    plt.close(fig)
    return {"title": "Monthly Energy Usage", "image": b64}


def _distribution_chart(df: pd.DataFrame, threshold: float) -> dict:
    fig, ax = plt.subplots(figsize=(10, 4))
    _apply_dark_style(fig, ax)

    y = df["energy"].values
    ax.hist(y, bins=30, color=CHART_STYLE["bar"], edgecolor=CHART_STYLE["bg"], alpha=0.85)
    ax.axvline(x=threshold, color=CHART_STYLE["spike"], linestyle="--", linewidth=1.5, label=f"Wastage Threshold ({round(threshold, 1)})")
    ax.axvline(x=np.mean(y), color=CHART_STYLE["line"], linestyle="-", linewidth=1.2, label=f"Mean ({round(float(np.mean(y)), 1)})")

    ax.set_title("Energy Consumption Distribution", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Energy (kWh)")
    ax.set_ylabel("Frequency")
    legend = ax.legend(facecolor=CHART_STYLE["axes_bg"], edgecolor=CHART_STYLE["grid"], labelcolor=CHART_STYLE["text"])

    plt.tight_layout()
    b64 = fig_to_base64(fig)
    plt.close(fig)
    return {"title": "Consumption Distribution & Spike Analysis", "image": b64}
