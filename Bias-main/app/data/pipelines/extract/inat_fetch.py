'''
Fetches data from inaturalist and stores it

https://api.inaturalist.org/v1/taxa?taxon_id=40151&place_id=1&rank=species&per_page=200
'''

from pyinaturalist import get_observation_species_counts, pprint, iNatClient
# from app.backend.database.models import Species
# from app.backend.database.db import db

# Vertebrate id: 355675
# Bird id: 3

client = iNatClient()

BROAD = {
    26036: 'reptile',
    20978: 'amphibian',
    3: 'bird',
    40151: 'mammal'
}

def fetch_us_species():
    page = 1

    species = {}

    while True:
        resp = get_observation_species_counts(
            place_id=1,
            taxon_id=list(BROAD.keys()),
            per_page=200,
            page=page,
            locale='en-US'
        )

        results = resp['results']
        if not results:
            break

        for r in results:
            taxon = r['taxon']
            if r.get('count') > 20:
                species[taxon['id']] = {
                    'id': taxon['id'],
                    'name': taxon['name'],
                    'common': taxon.get('preferred_common_name'),
                    'broad_taxon': BROAD[taxon.get('iconic_taxon_id')]
                }

        page += 1

    print('Number of species grabbed', len(list(species.values())))
    return list(species.values())


def load_species():
    species = fetch_us_species()
    
    for spec in species:
        new = Species(
            common_name=spec['common'],
            scientific_name=spec['name'],
            broad_taxon=spec['broad_taxon'],
            inat_taxon_id=spec['id'],
            count=0
        )
        db.session.add(new)
        db.session.commit()


def fetch_roadkill_obs():
    observations = client.observations.search(
        project_id='global-roadkill-observations',
        place_id=1,
        d1=f"2026-01-01",
    ).all()

    for obs in observations[:5]:
        pprint(obs)
        taxon_name = obs.taxon.name if obs.taxon else "Unknown Taxon"
        common_name = obs.taxon.preferred_common_name if obs.taxon and obs.taxon.preferred_common_name else ""
        print(f"[{obs.id}] {taxon_name} ({common_name}) - Observed on: {obs.observed_on} at {obs.location}")

#fetch_roadkill_obs()