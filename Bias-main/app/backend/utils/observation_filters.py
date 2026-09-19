from sqlalchemy import or_
from app.backend.database.models import Observations, Species
from app.backend.database.db import db
from app.backend.utils.time_utils import minutes_to_time
from flask import request



def apply_observation_filters(query, include_bounds=True):
    species = request.args.get('species')
    state = request.args.get('state')
    condition = request.args.get('condition')
    position = request.args.get('position')
    road_name = request.args.get('road')

    day_start = request.args.get('day_start')
    day_end = request.args.get('day_end')
    invert = request.args.get('invert')

    if include_bounds:
        print('INCLUDING BOUNDS')
        min_lat = request.args.get('min_lat', type=float)
        max_lat = request.args.get('max_lat', type=float)
        min_lon = request.args.get('min_lon', type=float)
        max_lon = request.args.get('max_lon', type=float)

        if min_lat is not None and max_lat is not None:
            query = query.filter(Observations.latitude.between(min_lat, max_lat))

        if min_lon is not None and max_lon is not None:
            query = query.filter(Observations.longitude.between(min_lon, max_lon))

    if species:
        if '(General)' in species:
            query = query.filter(Observations.species.has(Species.broad_taxon == species.replace('(General)', '').strip().lower()))
        else:
            query = query.filter(Observations.species.has(Species.common_name.ilike(f"%{species}%")))

    if condition:
        query = query.filter(Observations.condition == condition)

    if position:
        query = query.filter(Observations.position == position)

    if road_name:
        query = query.filter(Observations.road_name == road_name)

    if state:
        query = query.filter(Observations.state == state)

    if day_start not in (None, '') or day_end not in (None, ''):
        start_t = minutes_to_time(max(int(day_start), 0) if day_start is not None else 0)
        end_t = minutes_to_time(min(int(day_end), 1439) if day_end is not None else 1439)

        if not invert:
            query = query.filter(db.func.time(Observations.time_observed).between(start_t, end_t))
        else:
            query = query.filter(or_(db.func.time(Observations.time_observed) < start_t, db.func.time(Observations.time_observed) > end_t))

    return query