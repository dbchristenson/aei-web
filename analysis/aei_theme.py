"""AEI Plotly theme — reads shared theme.json design tokens.

Usage:
    import plotly.graph_objects as go
    from aei_theme import apply_theme, export

    fig = go.Figure(...)
    apply_theme(fig)
    export(fig, "../frontend/public/data/insights/my-chart.json")
"""

import json
from pathlib import Path

# Load shared token file from repo root
_root = Path(__file__).resolve().parents[1]
with open(_root / "theme.json") as f:
    _t = json.load(f)

c = _t["colors"]
f = _t["fonts"]
g = _t["glass"]["dark"]

AEI_THEME = {
    "font": {"family": f"{f['sansBody']}, sans-serif", "color": c["skyReflection"]},
    "paper_bgcolor": "rgba(0,0,0,0)",
    "plot_bgcolor": "rgba(0,0,0,0)",
    "colorway": [c["brightTealBlue"], c["skyReflection"], c["brightAmber"], c["coralGlow"]],
    "xaxis": {
        "gridcolor": "rgba(132, 188, 218, 0.15)",
        "linecolor": "rgba(132, 188, 218, 0.30)",
        "tickfont": {"family": f"{f['sansBody']}, sans-serif", "color": c["skyReflection"]},
        "title_font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"]},
    },
    "yaxis": {
        "gridcolor": "rgba(132, 188, 218, 0.15)",
        "linecolor": "rgba(132, 188, 218, 0.30)",
        "tickfont": {"family": f"{f['sansBody']}, sans-serif", "color": c["skyReflection"]},
        "title_font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"]},
    },
    "hoverlabel": {
        "bgcolor": g["background"],
        "bordercolor": g["border"],
        "font": {"family": f"{f['sansBody']}, sans-serif", "color": c["white"]},
    },
    "title": {
        "font": {"family": f"{f['sansHeader']}, sans-serif", "color": c["white"], "size": 18},
        "x": 0.0,
    },
    "margin": {"l": 48, "r": 24, "t": 48, "b": 48},
}


def apply_theme(fig):
    """Apply AEI design tokens to a Plotly figure."""
    fig.update_layout(**AEI_THEME)
    return fig


def export(fig, output_path: str):
    """Apply theme and export figure as JSON for the frontend."""
    apply_theme(fig)
    with open(output_path, "w") as out:
        out.write(fig.to_json())
