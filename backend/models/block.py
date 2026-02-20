"""SQLAlchemy + GeoAlchemy2 model for exploration blocks.

TODO: Implement once PostGIS database is configured.
"""

# from sqlalchemy import Column, String, Float, ARRAY
# from sqlalchemy.orm import DeclarativeBase
# from geoalchemy2 import Geometry
#
# class Base(DeclarativeBase):
#     pass
#
# class ExplorationBlock(Base):
#     __tablename__ = "exploration_blocks"
#
#     id = Column(String, primary_key=True)
#     name = Column(String, nullable=False)
#     basin = Column(String)
#     status = Column(String)  # Active Exploration | Under Development | Divested | Pending
#     description = Column(String)
#     aei_stake_pct = Column(Float, nullable=True)
#     partners = Column(ARRAY(String))
#     geometry = Column(Geometry("MULTIPOLYGON", srid=4326))
