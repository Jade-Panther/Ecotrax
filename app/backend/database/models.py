'''
Sets up the sqldatabase as models
'''

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, DateTime
from app.backend.database.db import db
from datetime import datetime

class Observations(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    latitude: Mapped[float] = mapped_column(index=True)
    longitude: Mapped[float] = mapped_column(index=True)

    state: Mapped[str | None]
    species_id: Mapped[int] = mapped_column(ForeignKey('species.id'))

    position: Mapped[str | None] # on_road, road_side, near_road
    condition: Mapped[str | None] # dead, alive
    corpse: Mapped[str | None] # fresh, moderate, advanced

    life_stage: Mapped[str] = mapped_column(default='Unknown', server_default="Unknown") # juvenile, adult

    source: Mapped[str | None]

    photo: Mapped[str | None]
    attribution: Mapped[str | None]

    road_name: Mapped[str | None]
    
    time_observed: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    time_created: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=db.func.now())
    timezone: Mapped[str | None]

    species = relationship("Species")

    def to_dict(self):
        return {
            'id': self.id,
            'lat': self.latitude,
            'lon': self.longitude,
            'state': self.state,
            'species_id': self.species_id,
            'position': self.position,
            'condition': self.condition,
            'corpse': self.corpse,
            'life_stage': self.life_stage,
            'source': self.source,
            'photo': self.photo,
            'attribution': self.attribution,
            'road_name': self.road_name,
            'time_observed': self.time_observed.isoformat(sep=' ') if self.time_observed else None,
            'time_created': self.time_created.isoformat(sep=' ') if self.time_observed else None,
            'timezone': self.timezone
        }


class Species(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    common_name: Mapped[str | None]
    scientific_name: Mapped[str | None]
    category: Mapped[str | None]
    broad_taxon: Mapped[str | None]
    inat_taxon_id: Mapped[int | None]
    count: Mapped[int | None]

    def to_dict(self):
        return {
            'common_name': self.common_name,
            'scientific_name': self.scientific_name,
            'category': self.category,
            'broad_taxon': self.broad_taxon,
            'inat_taxon_id': self.inat_taxon_id,
            'count': self.count
        }

class Crossings(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True) 
    name: Mapped[str | None]
    road_name: Mapped[str | None]
    year: Mapped[int | None]
    
    latitude: Mapped[float] = mapped_column(index=True)
    longitude: Mapped[float] = mapped_column(index=True)
    state: Mapped[str | None]
    
    status: Mapped[str | None]
    underpass_or_overpass: Mapped[str | None]
    structure_type: Mapped[str | None]
    target_species: Mapped[str | None]
    species_of_concern: Mapped[str | None]
    notes: Mapped[str | None]

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'road_name': self.road_name,
            'year': self.year,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'state': self.state,
            'status': self.status,
            'underpass_or_overpass': self.underpass_or_overpass,
            'structure_type': self.structure_type,
            'target_species': self.target_species,
            'species_of_concern': self.species_of_concern,
            'notes': self.notes
        }
    

class RiskGrid(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    grid_x: Mapped[int]
    grid_y: Mapped[int]

    center_latitude: Mapped[float]
    center_longitude: Mapped[float]

    score: Mapped[float] # Out of 100
