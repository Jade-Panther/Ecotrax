'''
Handles addition of observations via POST and returns via GET
Retrieves observations
'''
import random
from datetime import datetime, time, date
from warnings import filters
from flask import Blueprint, request, jsonify
from flask_sqlalchemy import query
from sqlalchemy import func, cast, Time, Date, or_
from app.backend.database.models import Observations, Species
from app.backend.database.db import db
from app.backend.utils.geo_utils import latlon_to_state
from app.backend.utils.time_utils import check_date, minutes_to_time, get_timezone
from zoneinfo import ZoneInfo
from datetime import UTC
from app.backend.utils.observation_filters import apply_observation_filters

observations_bp = Blueprint('observations', __name__)
print('INSIDE OBSERVATIONS')

@observations_bp.route('/api/observations', methods=['GET', 'POST'])
def api_observations():
    '''
    Retreives observations via GET and adds new observations via POST
    '''
    print('INSIDE OBS')
    if request.method == 'GET':
        print('GETTING')
        query = apply_observation_filters(Observations.query, include_bounds=True)

        # Filter based on date
        # if date_start != '' or date_end != '':
        #     start_d = datetime.strptime(date_start, "%Y-%m-%d").date() if date_start != '' else None
        #     end_d = datetime.strptime(date_end, "%Y-%m-%d").date() if date_end else None

        #     if start_d and end_d:
        #         query = query.filter(db.func.date(Observations.time_observed).between(start_d, end_d))
        #     elif start_d:
        #         query = query.filter(db.func.date(Observations.time_observed) >= start_d)
        #     elif end_d:
        #         query = query.filter(db.func.date(Observations.time_observed) <= end_d)


        obs = query.order_by(func.random()).limit(2000).all()

        data = []
        for o in obs:
            o_dict = o.to_dict()
            o_dict['species'] = o.species.to_dict()
            data.append(o_dict)
        return data
        
    if request.method == 'POST':
        data = request.json

        # Look up species
        species = Species.query.filter_by(common_name=data['species_name']).first()
        if not species:
            return {'error': 'Unknown species'}, 400
        
        lat = data['lat']
        lon = data['lon']
        tz_name = get_timezone(lat, lon)
        
        obs = Observations(
            latitude=data['lat'],
            longitude=data['lon'],
            state=data['state'],
            species_id=species.id,
            position=data['position'],
            condition=data['condition'],
            corpse=data['corpse'],
            source='reported',
            road_name=data['road_name'],
            photo=data['photo'],
            time_observed=datetime.strptime(data['time_observed'], "%Y-%m-%d %I:%M %p").replace(tzinfo=ZoneInfo(tz_name)),
            time_created=datetime.now(UTC),
            timezone=tz_name
        )
        print(obs.time_observed)
        print(obs.time_observed.tzinfo)

        db.session.add(obs)
        db.session.commit()

        o = obs.to_dict()
        o['species'] = species.to_dict()
        return o, 201

@observations_bp.route('/api/autocomplete_species')
def api_species():
    query = request.args.get('q', '')
    if query:
        species = db.session.query(Species).filter(Species.common_name.ilike(f"%{query}%")).limit(10).all()
        data = [s.to_dict() for s in species]
        return jsonify(data)
    return jsonify([])

@observations_bp.route('/api/validate')
def api_validate():
    name = request.args.get('name', '')
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')
    date = request.args.get('date', '')

    errors = {}

    species = db.session.query(Species).filter(Species.common_name.ilike(f"%{name}%")).limit(10).all()
    if not species:
        errors['species'] = f"Species '{name}' not found."

    if len(date.split(' ')) != 3: 
        errors['time-date'] = f"Date format not valid. Expected YYYY-MM-DD HH:MM AM/PM, got {date}"
    elif not check_date(date, lat, lon):  
        errors['time-date'] = f"Date values not valid. Got {date}"
    
    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        errors['location'] = 'Latitude and longitude should be numeric.'

    if latlon_to_state(lat, lon) is None:
        errors['location'] = 'Latitude and longitude do not correspond to a valid location. Must be within the United States.'

    if errors:
        return jsonify({
            'valid': False,
            'message': 'Validation failed.',
            'errors': errors
        })
    
    return jsonify({'valid': True})

@observations_bp.route('/api/totals')
def api_total_entries(): 
    return jsonify({
        'total_observations': Observations.query.count(),
        'total_species': Species.query.count()
    })