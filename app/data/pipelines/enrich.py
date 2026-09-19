from pyinaturalist import get_observations



def fetch_inat_enrichment(observation_id):
    resp = get_observations(
        id=observation_id,
        fields='annotations'
    )

    results = resp.get("results", [])
    if not results:
        return None

    obs = results[0]

    life_stage = None
    sex = None
    alive = None

    for ann in obs.get("annotations", []):
        attr = ann.get("controlled_attribute", {}).get("label")
        val = ann.get("controlled_value", {}).get("label")

        if attr == "Life stage":
            life_stage = val
        elif attr == "Sex":
            sex = val
        elif attr == 'Alive or Dead':
            alive = val
    

    return {
        "life_stage": life_stage,
        "sex": sex,
        "condition": alive
    }


import time

def enrich_batch(observations):
    for obs in observations:
        obs_id = obs.get("observation_id")

        if not obs_id:
            yield obs
            continue
        
        enrichment = fetch_inat_enrichment(obs_id)

        if enrichment:
            obs.update(enrichment)

        time.sleep(0.3) 

        yield obs