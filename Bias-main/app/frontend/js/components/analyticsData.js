

export const processSpeciesData = (sightings) => {
    const taxons = ['mammal', 'bird', 'reptile'];
    const speciesCounts = {};
    
    sightings.forEach(s => {
        const taxon = s.species?.broad_taxon;
        const name = s.species?.common_name;

        // if(!taxons.includes(taxon)) {
        //     console.log(`Broad taxon ${taxon} not found.`)
        // }

        if(!speciesCounts[name]) {
            speciesCounts[name] = {mammal: 0, bird: 0, reptile: 0}
        }
        speciesCounts[name][taxon]++;
    })

    return {
        labels: taxons.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        datasets: Object.keys(speciesCounts).map(name => {
            return {
                label: name,
                data: taxons.map(t => speciesCounts[name][t]),
                borderWidth: 1,
            }
        })
    }
}

export const processYearData = (sightings) => {

}