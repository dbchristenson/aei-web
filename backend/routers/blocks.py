from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["blocks"])


@router.get("/blocks")
async def get_blocks():
    """Return all exploration blocks as a GeoJSON FeatureCollection."""
    # TODO: Query PostGIS database via SQLAlchemy
    return {
        "type": "FeatureCollection",
        "features": [],
    }


@router.get("/blocks/{block_id}")
async def get_block(block_id: str):
    """Return a single exploration block by ID."""
    # TODO: Query PostGIS database via SQLAlchemy
    raise HTTPException(status_code=404, detail=f"Block '{block_id}' not found")
