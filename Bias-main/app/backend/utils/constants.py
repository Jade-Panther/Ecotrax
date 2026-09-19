'''
Constants
'''

from enum import Enum

class Conditions(Enum):
    ALIVE = 'alive'
    DEAD = 'dead'

class Positions(Enum):
    ON_ROAD = 'on_road'
    ROADSIDE = 'roadside'
    NEAR_ROAD = 'near_road'

class CorpseConditions(Enum):
    FRESH = 'fresh'
    DECOMPOSED = 'decomposed'
    SKELETAL = 'skeletal'
    NA = 'N/A'

class BroadTaxons(Enum):
    MAMMAL = 'mammal'
    BIRD = 'bird'
    REPTILE = 'reptile'
    AMPHIBIAN = 'amphibian'

