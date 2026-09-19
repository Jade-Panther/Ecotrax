'''
API calls related to map
'''

from flask import Blueprint, request, jsonify
from app.backend.database.models import Crossings
from app.backend.database.db import db
from app.data.pipelines.extract.crossings_fetch import *
import requests

crossings_bp = Blueprint('crossings', __name__)

@crossings_bp.route('/api/crossings')
def getLocData():
    query = Crossings.query.all()
    data = [c.to_dict() for c in query]

    return jsonify(data)
   
    