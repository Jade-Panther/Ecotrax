'''
A variety of helper functions for geography
'''
import reverse_geocoder as rg
import requests

valid_us_states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

def latlon_to_state(lat, lon):
    result = rg.search((lat, lon))
    
    if result and 'admin1' in result[0]:
        state = result[0]['admin1']
        if state in valid_us_states:
            return state
    
    return None

def closest_road(lat, lon):
    url = 'https://nominatim.openstreetmap.org/reverse'
    params = {
        'format': 'jsonv2',
        'lat': lat,
        'lon': lon
    }
    headers = {
        'User-Agent': 'Ecotrax/1.0'
    }
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code != 200:
            return None

        data = response.json()
        address = data.get('address', {})
        return address.get('road', '')
    except Exception as e:
        print(f"API Error: {e}")
        return None

def search_roads(search):
    params = {
        "q": f"{search}",
        "format": "jsonv2",
        "addressdetails": 1,
        "limit": 5,
        "featuretype": "road"
    }

    headers = {
        "User-Agent": "Ecotrax"
    }

    response = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params=params,
        headers=headers
    )

    results = response.json()
    
    return results



# def closest_road_type(lat, lon):
#     query = f"""
#     [out:json];
#     way(around:50,{lat},{lon})["highway"];
#     out tags;
#     """

#     response = requests.get(
#         "https://overpass-api.de/api/interpreter",
#         params={"data": query},
#         headers={"User-Agent": "Ecotrax/1.0"}
#     )

#     if response.status_code != 200:
#         return None
#     print(response.text)
#     elements = response.json().get("elements", [])

#     if not elements:
#         return None


#     return elements[0]["tags"].get("highway")

#print(closest_road_type(39.211074961364154, -76.67296571285678))