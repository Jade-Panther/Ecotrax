import pandas as pd
from datetime import datetime
from app.backend.database.db import db
from app.backend.database.models import Observations, Species
from app.backend.utils.geo_utils import closest_road, latlon_to_state
from app.backend.utils.time_utils import get_timezone

from zoneinfo import ZoneInfo

import time

import re

SPECIES_MAP = {
    "Deer": "White-tailed Deer",
    "Bear": "American Black Bear",
    "Opossum": "Virginia Opossum",
    "Raccoon": "Common Raccoon",
    "Cat": "Domestic Cat",
    "Dog": "Domestic Dog",
    "Skunk": "Striped Skunk", 
    "Fox": "Fox (unspecified)", 
    "Squirrel": "Squirrel (unspecified)",
    "Bird": "Bird (unspecified)",
    "Mammal": "Mammal (unspecified)",
    "Owl": "Owl (unspecified)",
    "Mountain Lion, Cougar, or Puma": "Mountain Lion",
    "Barn Owl": "American Barn Owl",
    "Northern River Otter": "North American River Otter",
    "Skunks and Stink Badgers": "Skunks (unspecified)",
    "Gophersnake": "Gopher Snake",
    "White-tailed Jack Rabbit": "White-tailed Jackrabbit",
    "Rabbit and Hares": "Rabbits and Hares (unspecified)",
    "Black Bear": "American Black Bear",
    "Horse": "Domestic Horse",
    "Western Jumping Mouse": "Southwestern Jumping Mouse",

    "Reptile": "Reptile (unspecified)",
    "Rodents": "Rodents (unspecified)",
    "Animal": "Unknown",
    "Rock Dove": "Rock Pigeon",
    "Deer Mouse": "Eastern Deermouse",
    "Water Vole": "North American Water Vole","Gray Jay": "Canada Jay", "Western Groundsnake": "Ground snake",

    "Grizzly Bear": "Brown Bear",
    "Red Squirrel": "American Red Squirrel",
    "Unclassified Squirrel": "Squirrel (unspecified)",
    "Southern Idaho Ground Squirrel": "Southern Idaho Ground Squirrel",
    "Golden-mantled Ground Squirrel": "Common Golden-mantled Ground Squirrel",
    "Jackrabbit": "Jackrabbit (unspecified)",
    "Black-tailed Jack Rabbit": "Black-tailed Jackrabbit",
    "Cottontail rabbit": "Cottontail Rabbit (unspecified)",
    "Ermine": "Eurasian Stoat",
    "Martes sp.": "Marten (unspecified)",
    "Mustela sp.": "Weasel (unspecified)",
    "Meadow Vole": "Eastern Meadow Vole",
    "Chipmunk": "Chipmunk (unspecified)",
    "Woodchuck": "Groundhog",
    "True Foxes": "Fox (unspecified)",
    "Bats": "Bat (unspecified)",
    "Hoary Bat": "Northern Hoary Bat",
    "Little Brown Myotis": "Little Brown Bat",

    "Accipitridae Family": "Hawks, Eagles, and Kites (unspecified)",
    "Bird Hawks": "Hawk (unspecified)",
    "Hawk": "Hawk (unspecified)",
    "Unclassified Flycatcher": "Flycatcher (unspecified)",
    "Sparrows": "Sparrow (unspecified)",
    "Gulls": "Gull (unspecified)",
    "Goose": "Goose (unspecified)",
    "Swan": "Swan (unspecified)",
    "House Wren": "Northern House Wren",
    "Yellow Warbler": "Northern Yellow Warbler",
    "Columbian Sharp-tailed Grouse": "Columbian Sharp-tailed Grouse",
    "Snow Goose or Blue Goose": "Snow Goose",
    "Unclassified Duck": "Duck (unspecified)",
    "Dabbling Ducks": "Dabbling Duck (unspecified)",
    "Merganser": "Merganser (unspecified)",
    "Grey Jay": "Canada Jay",

    "Common Gartersnake": "Common Garter Snake",
    "Terrestrial Gartersnake": "Western Terrestrial Garter Snake",
    "Thamnophis sp.": "Garter Snake (unspecified)",
    "Racer": "North American Racer",
    "Rubber Boa": "Northern Rubber Boa",

    "California Bighorn Sheep": "Sierra Nevada Bighorn Sheep"
}

def standardize_road_name(road_name):
    if not road_name or pd.isna(road_name):
        return None
    
    if ';' in road_name:
        road_name = road_name.split(';')[0].strip()

    road_name = re.sub(r'\bI\s+(\d+)', r'I-\1', road_name, flags=re.IGNORECASE)

    road_name = re.sub(r'(?<=\d)\s*[NSEW]\b', '', road_name, flags=re.IGNORECASE)
    road_name = re.sub(r'\s+(North|South|East|West)\b', '', road_name, flags=re.IGNORECASE)

    return road_name.strip()

def standardize_life_stage(life_stage):
    if pd.isna(life_stage):
        return None
    
    ls = life_stage.lower()
    if 'mature' in ls or 'adult' in ls:
        return 'adult'
    if 'juvenile' in ls or 'immature' in ls:
        return 'juvenile'
    return None

def extract_vdot(file):
    df = pd.read_csv(file)
    
    df['parsed_date'] = pd.to_datetime(df['Date and Pickup Time'], errors='coerce')

    ny_tz = ZoneInfo("America/New_York")

    for _, row in df.iterrows():
        common_name = row['Deer and Bear Removal'] if not pd.isna(row['Deer and Bear Removal']) else row['Other wildlife types']
        if common_name == 'Other':
            common_name = row['Other wildlife types']

        if pd.isna(common_name) or not common_name or pd.isna(row['Latitude_d']):
            continue 

        # Get the road name since it's not always provided
        road = row['Route Name and Direction']
        if pd.isna(road):
            time.sleep(1) 
            fetched_road = closest_road(float(row['Latitude_d']), float(row['Longitude_d']))
            #print(f"Fetched missing road from API: {fetched_road}")
            road = fetched_road  

        # Format the timezone
        naive_time = row['parsed_date']
        if pd.isna(naive_time):
            dt = None
        else:
            py_dt = naive_time.to_pydatetime()
            dt = py_dt.replace(tzinfo=ny_tz)
            
            
        # Finally! We've cleaned it
        yield {
            'latitude': float(row['Latitude_d']),
            'longitude': float(row['Longitude_d']),
            'state': 'VA',
            'common_name': SPECIES_MAP.get(common_name) if common_name in SPECIES_MAP else common_name,
            'road_name': standardize_road_name(road), 
            'source': 'VDOT',
            'condition': 'dead', 
            'time_observed': dt, 
            'timezone': ny_tz.key,
        }


def extract_idfg(file):
    # This one is much better. Good job Idaho Fish and Game

    # Change some species since there's more than one deer out west
    SPECIES_MAP['Deer'] = 'Deer (unspecified)'

    df = pd.read_csv(file)

    df['parsed_observed'] = pd.to_datetime(df['observed'], errors='coerce')

    for _, row in df.iterrows():
        raw_common = row['species'].split('(')[0].strip()
        common_name = SPECIES_MAP.get(raw_common, raw_common)

        road = row['highway']
        csv_lat = float(row['latitude'])
        csv_lon = float(row['longitude'])

        if pd.isna(csv_lat) or pd.isna(csv_lon):
            continue

        # Unfortunately some coordinates got mixed up
        if csv_lat < -90 or csv_lat > 90 or (csv_lat < -100 and csv_lon > 0):
            lat = csv_lon
            lon = csv_lat
        else:
            lat = csv_lat
            lon = csv_lon

        # Why does it have to be split into two timezones?
        tz_name = get_timezone(lat, lon)
        tz = ZoneInfo(tz_name)

        naive_time = row['parsed_observed']
        if pd.isna(naive_time):
            dt = None
        else:
            dt = naive_time.to_pydatetime().replace(tzinfo=tz)

        decomp = row['decomposition']

        yield {
            'latitude': lat,
            'longitude': lon,
            'state': 'Idaho',
            'common_name': common_name,
            'road_name': road if not pd.isna(road) else None, 
            'source': 'Idaho Department of Fish and Game',
            'condition': 'dead', 
            'corpse': decomp.lower() if pd.isna(decomp) else 'Unknown',
            'life_stage': standardize_life_stage(row['lifeStage']),
            'time_observed': dt,
            'timezone': tz_name,
        }

def extract_inat(file):
    # Don't have to do too much to this one

    df = pd.read_csv(file)

    for _, row in df.iterrows():
        if _ > 10:
            break
        lat = float(row['latitude'])
        lon = float(row['longitude'])
        license = row['license']

        allowed = (
            "CC BY",
            "CC BY-SA",
            "CC BY-NC",
            "CC BY-NC-SA",
            "CC BY-NC-ND",
            "CC0"
        )
        if pd.isna(license) or not license.startswith(allowed):
            continue

        yield {
            'observation_id': row['id'],
            'latitude': lat,
            'longitude': lon,
            'state': latlon_to_state(lat, lon),
            'common_name': row['common_name'],
            'road_name': None, 
            'source': 'INaturalist Global Roadkill Observations Project',
            'condition': 'dead', 
            'photo': row['image_url'],
            'attribution': f"Photo by @{row['user_name']} via iNaturalist, licensed under {license}",
            'corpse': 'Unknown',
            'life_stage': 'Unknown',
            'time_observed': row['observed_on'],
            'timezone': get_timezone(lat, lon),
        }