'''
API calls related to map
'''

from flask import Blueprint, request, jsonify
from app.backend.database.models import Observations, Species
from app.backend.database.db import db
from app.backend.utils.geo_utils import latlon_to_state, closest_road, search_roads

map_bp = Blueprint('map', __name__)

@map_bp.route('/api/loc')
def getLocData():
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))

    except:
        return jsonify([])
    
    return jsonify({
        'state': latlon_to_state(lat, lon),
        'road': closest_road(lat, lon)
    })

@map_bp.route('/api/autocomplete_roads')
def searchRoads():
    search = request.args.get('q')

    if not search:
        return jsonify([])

    results = search_roads(search)

    roads = []

    for r in results:
        roads.append({
            "name": r.get("name"),
            "lat": float(r["lat"]),
            "lon": float(r["lon"]),
            'bounds': r.get('bounds')
        })

    return jsonify(roads)

@map_bp.route('/api/roads')
def getRoads():
    search = request.args.get('q')

    if not search:
        return jsonify([])

    observations = Observations.query.filter(Observations.road_name.ilike(f"%{search}%")).distinct().limit(20).all()

    return jsonify([
        {
            "road": obs.road_name,
            "lat": obs.latitude,
            "lon": obs.longitude
        }
        for obs in observations
    ])
    