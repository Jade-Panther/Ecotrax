import random
from datetime import datetime
from app.backend.database.db import db
from app.backend.database.models import Observations, Species
from app.backend.utils.geo_utils import latlon_to_state, closest_road
from app.backend.utils.constants import Conditions, Positions, CorpseConditions, BroadTaxons

def randseed(n=10):
    spec1 = Species(
        common_name='white-tailed deer',
        scientific_name='Odocoileus virginianus',
        broad_taxon=BroadTaxons.MAMMAL.value,
        inat_taxon_id=1,
        count=0
    )
    spec2 = Species(
        common_name='bald eagle',
        scientific_name='Haliaeetus leucocephalus',
        broad_taxon=BroadTaxons.BIRD.value,
        inat_taxon_id=2,
        count=0
    )
    spec3 = Species(
        common_name='brown anole',
        scientific_name='Anolis carolinensis',
        broad_taxon=BroadTaxons.REPTILE.value,
        inat_taxon_id=3,
        count=0
    )
    spec4 = Species(
        common_name='Red Fox',
        scientific_name='Vulpes vulpes',
        broad_taxon=BroadTaxons.MAMMAL.value,
        inat_taxon_id=4,
        count=0,
    )
    db.session.add(spec1)
    db.session.add(spec2)
    db.session.add(spec3)
    db.session.add(spec4)

    db.session.flush()

    all_species = [spec1, spec2, spec3, spec4]
    print(n)
    for _ in range(n):
        lat = random.uniform(24.5, 49.5)
        lon = random.uniform(-124.8, -66.9)
        print(lat)
        print(_)
        chosen_species = random.choice(all_species)
        chosen_species.count+=1
        obs = Observations(
            latitude=lat,
            longitude=lon,
            species_id=chosen_species.id,
            state=latlon_to_state(lat, lon),
            position=random.choice(list(Positions)).value,
            road_name=closest_road(lat, lon),
            condition=random.choice(list(Conditions)).value,
            corpse=random.choice(list(CorpseConditions)).value,
            source='seeded',
            time_observed=datetime(random.randint(2010, 2025), random.randint(1, 12), random.randint(1, 20))
        )
        db.session.add(obs)

    db.session.commit()

