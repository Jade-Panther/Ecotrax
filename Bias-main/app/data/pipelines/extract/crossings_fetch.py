import requests
import geopandas as gpd
from app.backend.database.models import Crossings
from app.backend.database.db import db

def load_california():
    url = (
        'https://services9.arcgis.com/uy5rwsTwiZplgZQG/arcgis/rest/services/'
        'CA_Wildlife_Crossings_10292024/FeatureServer/0/query'
        '?where=1%3D1'
        '&outFields=*'
        '&returnGeometry=true'
        '&f=pgeojson'
    )

    response = requests.get(url)
    response.raise_for_status()

    data = response.json()['features']

    for c in data:
        prop = c.get('properties', {})

        route_val = prop.get('Route')
        road_name = None
        
        if route_val:
            route_str = str(route_val).strip()
        
            if route_str.isdigit():
                road_name = f"SR-{route_str}"
            else:
                road_name = route_str
        
        new_crossing = Crossings(
            id=c.get('id'),
            latitude=prop.get('Latitude'),  
            longitude=prop.get('Longitude'),
            status=prop.get('Status'),
            name=prop.get('Project_Name'),
            road_name=road_name,
            year=prop.get('Year'),
            underpass_or_overpass=prop.get('Underpass_or_Overpass'),
            structure_type=prop.get('CrossingType'),
            target_species=prop.get('TargetSpecies'),
            species_of_concern=prop.get('Species_of_Concern'),
            notes=prop.get('Comments'),
            state='CA' 
        )

        db.session.add(new_crossing)

    db.session.commit()

