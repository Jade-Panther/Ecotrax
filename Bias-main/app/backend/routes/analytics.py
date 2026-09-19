from flask import Blueprint, jsonify
from sqlalchemy import func

from app.backend.database.models import Observations, Species
from app.backend.database.db import db
from app.backend.utils.observation_filters import apply_observation_filters

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/api/analytics')
def api_analytics():
    query = apply_observation_filters(
        Observations.query,
        include_bounds=False
    )
    print(len(query.all()))

    # Species and taxon counts
    species_rows = (
        query
        .with_entities(
            Species.common_name,
            Species.broad_taxon,
            func.count(Observations.id).label('count')
        )
        .join(Observations.species)
        .group_by(
            Species.common_name,
            Species.broad_taxon
        )
        .all()
    )

    species = {}

    for name, taxon, count in species_rows:
        if name not in species:
            species[name] = {
                'mammal': 0,
                'bird': 0,
                'reptile': 0
            }

        if taxon in species[name]:
            species[name][taxon] = count

    # Year counts
    year_rows = (
        query
        .with_entities(
            db.func.strftime('%Y', Observations.time_observed).label('year'),
            func.count(Observations.id).label('count')
        ).group_by('year').order_by('year')
        .all()
    )

    years = {str(year): count for year, count in year_rows}

    # Time-of-day counts
    time_rows = (
        query
        .with_entities(
            db.func.strftime(
                '%H',
                Observations.time_observed
            ).label('hour'),
            func.count(Observations.id).label('count')
        )
        .group_by('hour')
        .order_by('hour')
        .all()
    )

    times = {
        int(hour): count
        for hour, count in time_rows
        if int(hour) != 0
    }

    return jsonify({
        'species': species,
        'years': years,
        'times': times
    })
