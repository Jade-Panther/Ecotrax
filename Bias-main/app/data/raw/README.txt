Exported at 2026-07-01T13:31:15Z

Query: quality_grade=research&identifications=any&geoprivacy=open&iconic_taxa%5B%5D=Aves&iconic_taxa%5B%5D=Reptilia&iconic_taxa%5B%5D=Amphibia&iconic_taxa%5B%5D=Mammalia&place_id=1&projects%5B%5D=global-roadkill-observations

Columns:
id: Unique, sequential identifier for the observation
observed_on_string: Date/time as entered by the observer
observed_on: Normalized date of observation
time_observed_at: Normalized datetime of observation
time_zone: Time zone of observation
created_at: Datetime observation was created
license: Identifier for the license or waiver the observer has chosen for this observation. All rights reserved if blank
image_url: URL for the first photo associated with the observation
place_guess: Locality description as entered by the observer
latitude: Publicly visible latitude from the observation location
longitude: Publicly visible longitude from the observation location
positional_accuracy: Coordinate precision (yeah, yeah, accuracy != precision, poor choice of names)
public_positional_accuracy: Maximum horizontal positional uncertainty in meters; includes uncertainty added by coordinate obscuration
taxon_geoprivacy: Most conservative geoprivacy applied due to the conservation statuses of taxa in current identification.
coordinates_obscured: Whether or not the coordinates have been obscured, either because of geoprivacy or because of a threatened taxon
positioning_method: How the coordinates were determined
species_guess: Plain text name of the observed taxon; can be set by the observer during observation creation, but can get replaced with canonical, localized names when the taxon changes
scientific_name: Scientific name of the observed taxon according to iNaturalist
common_name: Common or vernacular name of the observed taxon according to iNaturalist
iconic_taxon_name: Higher-level taxonomic category for the observed taxon
taxon_id: Unique, sequential identifier for the observed taxon

For more information about column headers, see https://www.inaturalist.org/terminology

