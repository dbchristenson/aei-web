"""
Process ETOPO1 elevation data into 3-band terrain contours for the exploration map.

Reads the global ETOPO1 GeoTIFF, clips to Indonesia, classifies land pixels
into low/medium/high elevation bands, vectorizes into polygons, simplifies
for web delivery, and exports as TopoJSON.

Elevation bands:
  - low:    0–100 m   (coastal plains, river basins)
  - medium: 100–500 m (hills, uplands)
  - high:   500+ m    (mountains, volcanic peaks)

Output: frontend/public/data/indonesia-terrain.json (TopoJSON)
"""

import json
import sys
from pathlib import Path

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.windows import from_bounds
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
import topojson as tp

# ─── Configuration ───

ETOPO1_PATH = Path("analysis/data/raw/ETOPO1_Ice_g_geotiff.tif")
OUTPUT_PATH = Path("frontend/public/data/indonesia-terrain.json")

# Indonesia bounding box (generous to include all islands)
BBOX_WEST = 95.0
BBOX_EAST = 141.0
BBOX_SOUTH = -11.0
BBOX_NORTH = 6.0

# Elevation band thresholds (meters)
BAND_LOW_MAX = 100
BAND_MED_MAX = 500

# Simplification tolerance in degrees (~0.01° ≈ 1.1 km at equator).
# Balances detail vs file size for SVG rendering on an orthographic globe.
SIMPLIFY_TOLERANCE = 0.025

# Minimum polygon area in square degrees to discard tiny fragments.
# 0.008 sq deg ≈ 100 km² at equator — keeps only visually significant
# landmasses for SVG globe rendering. Smaller islands merge with the
# base land layer underneath.
MIN_AREA = 0.008


def read_indonesia_elevation() -> tuple[np.ndarray, rasterio.Affine]:
    """Read ETOPO1 clipped to Indonesia bbox. Returns (elevation_array, transform)."""
    print("Reading ETOPO1 data...")
    with rasterio.open(ETOPO1_PATH) as src:
        window = from_bounds(BBOX_WEST, BBOX_SOUTH, BBOX_EAST, BBOX_NORTH, src.transform)
        data = src.read(1, window=window)
        transform = src.window_transform(window)
    print(f"  Clipped region: {data.shape[1]}x{data.shape[0]} pixels")
    print(f"  Elevation range: {data.min()}m to {data.max()}m")
    return data, transform


def classify_bands(data: np.ndarray) -> np.ndarray:
    """Classify elevation into bands: 0=ocean/nodata, 1=low, 2=medium, 3=high."""
    bands = np.zeros_like(data, dtype=np.uint8)
    land = data > 0

    low = land & (data <= BAND_LOW_MAX)
    med = land & (data > BAND_LOW_MAX) & (data <= BAND_MED_MAX)
    high = land & (data > BAND_MED_MAX)

    bands[low] = 1
    bands[med] = 2
    bands[high] = 3

    counts = {
        "low": int(np.sum(low)),
        "medium": int(np.sum(med)),
        "high": int(np.sum(high)),
    }
    total_land = sum(counts.values())
    print(f"  Band distribution:")
    for name, count in counts.items():
        pct = count / total_land * 100 if total_land > 0 else 0
        print(f"    {name}: {count:,} pixels ({pct:.1f}%)")

    return bands


def vectorize_band(
    bands: np.ndarray,
    transform: rasterio.Affine,
    band_value: int,
    band_name: str,
) -> list[dict]:
    """Vectorize a single band into simplified GeoJSON features."""
    print(f"  Vectorizing {band_name} band...")

    mask = bands == band_value
    raw_shapes = list(shapes(bands, mask=mask, transform=transform, connectivity=8))
    print(f"    Raw polygons: {len(raw_shapes)}")

    # Convert to shapely, filter tiny fragments, simplify
    geometries = []
    for geom, value in raw_shapes:
        if value != band_value:
            continue
        poly = shape(geom)
        if poly.area < MIN_AREA:
            continue
        simplified = poly.simplify(SIMPLIFY_TOLERANCE, preserve_topology=True)
        if not simplified.is_empty and simplified.area >= MIN_AREA:
            geometries.append(simplified)

    print(f"    After simplification: {len(geometries)} polygons")

    # Merge overlapping/adjacent polygons to reduce count
    if geometries:
        merged = unary_union(geometries)
        # unary_union may return a single Polygon or MultiPolygon
        if merged.geom_type == "Polygon":
            final_geoms = [merged]
        elif merged.geom_type == "MultiPolygon":
            final_geoms = list(merged.geoms)
        else:
            final_geoms = []
        # Filter again after merge
        final_geoms = [g for g in final_geoms if g.area >= MIN_AREA]
    else:
        final_geoms = []

    print(f"    After merge: {len(final_geoms)} polygons")

    features = []
    for geom in final_geoms:
        features.append({
            "type": "Feature",
            "properties": {"band": band_name},
            "geometry": mapping(geom),
        })

    return features


def build_topojson(all_features: list[dict]) -> dict:
    """Convert GeoJSON features into a compact TopoJSON topology."""
    print("Building TopoJSON...")
    geojson = {
        "type": "FeatureCollection",
        "features": all_features,
    }
    topology = tp.Topology(geojson, prequantize=True, presimplify=False)
    topo_dict = topology.to_dict()
    return topo_dict


def main():
    if not ETOPO1_PATH.exists():
        print(f"ERROR: ETOPO1 file not found at {ETOPO1_PATH}", file=sys.stderr)
        sys.exit(1)

    data, transform = read_indonesia_elevation()
    bands = classify_bands(data)

    print("\nVectorizing elevation bands...")
    all_features = []
    for band_value, band_name in [(1, "low"), (2, "medium"), (3, "high")]:
        features = vectorize_band(bands, transform, band_value, band_name)
        all_features.extend(features)

    print(f"\nTotal features: {len(all_features)}")

    topo = build_topojson(all_features)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(topo, f, separators=(",", ":"))

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    size_mb = size_kb / 1024
    print(f"\nOutput: {OUTPUT_PATH}")
    print(f"Size: {size_kb:.0f} KB ({size_mb:.1f} MB)")

    # Quick validation
    objects = topo.get("objects", {})
    for obj_name, obj in objects.items():
        geoms = obj.get("geometries", [])
        band_counts = {}
        for g in geoms:
            b = g.get("properties", {}).get("band", "unknown")
            band_counts[b] = band_counts.get(b, 0) + 1
        print(f"  Object '{obj_name}': {len(geoms)} geometries — {band_counts}")


if __name__ == "__main__":
    main()
