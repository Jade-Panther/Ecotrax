'''
Handles addition of observations via POST and returns via GET
Retrieves observations
'''
import random
from datetime import datetime, time, date
from warnings import filters
from flask import Blueprint, request, jsonify
from sqlalchemy import cast, Time, Date, or_
from app.backend.database.models import Observations, Species
from app.backend.database.db import db

species_bp = Blueprint('species', __name__)

@species_bp.route('/api/species')
def api_species():
    spec = Species.query.all()

    data = []
    for s in spec:
        s_dict = s.to_dict()
        data.append(s_dict)
    return data