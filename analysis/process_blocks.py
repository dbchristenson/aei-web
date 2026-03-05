"""
Process raw block shapefiles into a unified GeoJSON FeatureCollection.

Reads from: analysis/data/block_data/<BlockName>/<BlockName>.shp
Writes to:  analysis/data/blocks.geojson

Normalizes schema, dissolves multi-row blocks, fixes winding order (CCW),
and rounds coordinates to 6 decimal places (~0.11m precision).
"""

import geopandas as gpd
import json
from pathlib import Path
from shapely.geometry import mapping, shape, MultiPolygon, Polygon
from shapely.ops import orient

DATA_DIR = Path(__file__).parent / "data" / "block_data"
OUTPUT_PATH = Path(__file__).parent / "data" / "blocks.geojson"

# Block metadata — extend with real descriptions/status when available
BLOCK_META: dict[str, dict[str, str]] = {
    "Gaea": {
        "id": "gaea",
        "name": "Gaea",
        "basin": "Bintuni Basin",
        "status": "Active Exploration",
        "description": "Located in western Papua, the Gaea block covers a prospective area in the Bintuni Basin with significant hydrocarbon potential.",
    },
    "Gaea II": {
        "id": "gaea-ii",
        "name": "Gaea II",
        "basin": "Bintuni Basin",
        "status": "Active Exploration",
        "description": "Adjacent to the original Gaea block, Gaea II extends AEI's exploration footprint deeper into the Bintuni Basin.",
    },
    "Jago": {
        "id": "jago",
        "name": "Jago",
        "basin": "North Sumatra Basin",
        "status": "Active Exploration",
        "description": "Situated off the northern coast of Sumatra, the Jago block targets proven petroleum systems in the North Sumatra Basin.",
    },
    "Palu": {
        "id": "palu",
        "name": "Palu",
        "basin": "Bintuni Basin",
        "status": "Active Exploration",
        "description": "The Palu block lies south of the Gaea blocks in the Bintuni Basin, offering additional exploration upside in the region.",
    },
    "Talu": {
        "id": "talu",
        "name": "Talu",
        "basin": "Kutei Basin",
        "status": "Active Exploration",
        "description": "Spanning the Makassar Strait off eastern Kalimantan, the Talu block targets the prolific Kutei Basin.",
    },
}


def fix_winding(geom: Polygon | MultiPolygon) -> Polygon | MultiPolygon:
    """Ensure CCW exterior, CW interior (GeoJSON/RFC 7946 convention)."""
    if isinstance(geom, MultiPolygon):
        return MultiPolygon([orient(p, sign=1.0) for p in geom.geoms])
    return orient(geom, sign=1.0)


def round_coords(geom: Polygon | MultiPolygon, precision: int = 6) -> Polygon | MultiPolygon:
    """Round all coordinates to the given decimal precision."""
    geojson = mapping(geom)
    rounded = json.loads(json.dumps(geojson), parse_float=lambda x: round(float(x), precision))
    return shape(rounded)


def process_block(name: str) -> dict:
    """Read a shapefile, dissolve to a single geometry, normalize, and return a GeoJSON Feature."""
    shp_path = DATA_DIR / name / f"{name}.shp"
    gdf = gpd.read_file(shp_path)

    # Dissolve multi-row blocks into a single geometry
    dissolved = gdf.dissolve()
    geom = dissolved.geometry.iloc[0]

    # Normalize geometry to MultiPolygon for consistency
    if isinstance(geom, Polygon):
        geom = MultiPolygon([geom])

    # Fix winding order and round coordinates
    geom = fix_winding(geom)
    geom = round_coords(geom)

    # Validate
    if not geom.is_valid:
        raise ValueError(f"Invalid geometry after processing: {name}")

    meta = BLOCK_META[name]
    return {
        "type": "Feature",
        "id": meta["id"],
        "properties": {
            "id": meta["id"],
            "name": meta["name"],
            "basin": meta["basin"],
            "status": meta["status"],
            "description": meta["description"],
        },
        "geometry": mapping(geom),
    }


def main() -> None:
    features = [process_block(name) for name in BLOCK_META]

    collection = {
        "type": "FeatureCollection",
        "features": features,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(collection, f, indent=2)

    print(f"Wrote {len(features)} features to {OUTPUT_PATH}")

    # Summary
    for feat in features:
        geom = shape(feat["geometry"])
        n = sum(len(p.exterior.coords) for p in geom.geoms)
        print(f"  {feat['properties']['name']}: {len(geom.geoms)} polygon(s), {n} vertices, bounds={geom.bounds}")


if __name__ == "__main__":
    main()
