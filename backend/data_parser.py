import pandas as pd
import io
from fastapi import HTTPException


POSSIBLE_DATE_COLS = ["date", "timestamp", "time", "datetime", "day", "month", "year"]
POSSIBLE_VALUE_COLS = [
    "energy", "consumption", "usage", "kwh", "power", "load",
    "value", "reading", "electricity", "watt", "units"
]


def parse_file(file_bytes: bytes, filename: str) -> pd.DataFrame:
    """
    Auto-detect CSV or Excel format and return a clean DataFrame.
    Attempts to identify timestamp and energy value columns automatically.
    """
    df = None
    
    # Try multiple reading strategies (regardless of extension)
    try:
        # Strategy 1: Standard CSV / Comma
        df = pd.read_csv(io.BytesIO(file_bytes), low_memory=False)
        if len(df.columns) < 2: # Very likely wrong delimiter
            raise ValueError("Too few columns, trying next delimiter")
    except Exception:
        try:
            # Strategy 2: Semicolon (extremely common in energy datasets)
            df = pd.read_csv(io.BytesIO(file_bytes), sep=';', low_memory=False)
            if len(df.columns) < 2:
                raise ValueError("Too few columns, trying next delimiter")
        except Exception:
            try:
                # Strategy 3: Dynamic separator (slowest, but most flexible)
                df = pd.read_csv(io.BytesIO(file_bytes), sep=None, engine='python')
            except Exception:
                try:
                    # Strategy 4: Excel
                    df = pd.read_excel(io.BytesIO(file_bytes))
                except Exception as e:
                    raise HTTPException(status_code=400, detail="Could not parse file. Please ensure it's a valid data table (CSV, Excel, or structured TXT).")

    if df is None or df.empty:
        raise HTTPException(status_code=400, detail="The file appears to be empty or unreadable.")

    df.columns = [c.strip().lower() for c in df.columns]

    # Auto-detect date column
    date_col = _find_column(df, POSSIBLE_DATE_COLS)
    if date_col:
        try:
            df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
            df = df.rename(columns={date_col: "timestamp"})
        except Exception:
            pass

    # Auto-detect energy value column
    value_col = _find_column(df, POSSIBLE_VALUE_COLS)
    if not value_col:
        # Fallback: pick first numeric column
        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        if not numeric_cols:
            raise HTTPException(status_code=400, detail="No numeric energy column found in the dataset.")
        value_col = numeric_cols[0]

    df = df.rename(columns={value_col: "energy"})
    df["energy"] = pd.to_numeric(df["energy"], errors="coerce")
    df = df.dropna(subset=["energy"])

    if df.empty:
        raise HTTPException(status_code=400, detail="Dataset is empty after cleaning.")

    return df


def _find_column(df: pd.DataFrame, candidates: list) -> str | None:
    for col in df.columns:
        for candidate in candidates:
            if candidate in col:
                return col
    return None
