from pyinaturalist import get_taxa, pprint

taxon_map = {
    3: 'bird',
    26036: 'reptile',
    20978: 'amphibian',
    40151: 'mammals'
}

def get_taxon(name):
    try:
        response = get_taxa(q=name)
        pprint(response)
        spec = response['results'][0]
    
        return {
            'common_name': spec.get('preferred_common_name'),
            'scientific_name': spec.get('name'),
            'broad_taxon': taxon_map.get(spec.get('iconic_taxon'), None),
            'inat_taxon_id': spec.get('id'),
            'count': 0,
        }
    except:
        return None

