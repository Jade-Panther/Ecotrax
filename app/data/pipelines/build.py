
import pandas as pd
from app.backend.database.db import db
from app.backend.database.models import Observations, Species
from app.data.pipelines.normalize import *
from app.backend.utils.inat_utils import get_taxon
from app.data.pipelines.enrich import enrich_batch


def save_observation_to_db(data: dict):
    common = data["common_name"]
    
    db_species = Species.query.filter(Species.common_name.ilike(common)).first()
    
    if db_species is None:
        if '(unspecified)' in common:
            db_species = Species(
                common_name=common,
                scientific_name=None,
                broad_taxon=None,
                inat_taxon_id=None,
                count=0,
            )
            db.session.add(db_species)
            db.session.flush()   

        else:
            possible = get_taxon(common)
            if possible is None:
                print(f"Warning: Species '{common}' not found in database. Skipping observation.")
                return
            else:
                ans = input(f"Found species: {common}. Add to species database? ")
                if ans == 'y':
                    db_species = Species(
                        common_name=possible['common_name'],
                        scientific_name=possible['scientific_name'],
                        broad_taxon=possible['broad_taxon'],
                        inat_taxon_id=possible['inat_taxon_id'],
                        count=0,
                    )
                    db.session.add(db_species)
                    db.session.flush() 
                else:
                    return  
            
    observation = Observations(
        latitude=data["latitude"], 
        longitude=data["longitude"],

        state=data['state'],
        species_id=db_species.id,

        condition=data.get('condition'),
        corpse=data.get('corpse'),

        life_stage=data.get('life_stage'),

        road_name=data.get("road_name"), 

        source=data["source"],

        time_observed=data.get("time_observed"),
        timezone=data.get('timezone')

    )
    db.session.add(observation)


def build_db():
    
    print("Loading datasets...")

    # for record in extract_vdot('/workspaces/Bias/app/data/raw/VDOT_Carcass_Removal.csv'):
    #     print(record)
    #     # save_observation_to_db(record)
        
       
    #for index, record in enumerate(extract_idfg('/workspaces/Bias/app/data/raw/Idaho_DFG.csv'), start=1):
    #    #print(f"Processing row #{index}")
    #     #print(record)
    #  save_observation_to_db(record)

    
    records = []
    print(extract_inat)
    for record in extract_inat('/workspaces/Bias/app/data/raw/INaturalist.csv'):
        records.append(record)

    
    print("Enriching via iNaturalist API...")
    records = list(enrich_batch(records))

    for record in records[:50]:
        print(record)
        
   

   # db.session.commit()
    print('Datasets loaded')