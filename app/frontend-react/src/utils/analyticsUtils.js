import { RAINBOW } from './constants';

export const shiftColor = (hslStr, speciesName) => {
    const matches = hslStr.match(/\d+/g);
    if (!matches || matches.length < 3) return hslStr;

    const l = parseInt(matches[2]);

    // Simple string hashing
    let hash = 0;
    for (let i = 0; i < speciesName.length; i++) {
        hash = speciesName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const newLight = Math.max(25, Math.min(75, l + ((hash >> 2) % 15)));

    return `hsl(${matches[0]}, ${matches[1]}%, ${newLight}%)`;
}

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
            const colors = [
                shiftColor(RAINBOW.blue, name),   
                shiftColor(RAINBOW.green, name),  
                shiftColor(RAINBOW.yellow, name)  
            ];
            return {
                label: name,
                data: taxons.map(t => speciesCounts[name][t]),
                backgroundColor: colors,            
                borderColor: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.5)'],
                borderWidth: 1.5,
                borderSkipped: false
            };
        })
    };
}

export const processYearData = (sightings) => {
    const yearCounts = {};
    for(let i = 2010; i<=2026; i++) {
        yearCounts[i] = 0;
    }

    sightings.forEach(s => {
        const year = s.time_observed.split('-')[0];
        if(!yearCounts[year]) {
            yearCounts[year] = 0;
        }
        yearCounts[year]++;
    });

    const sorted = Object.keys(yearCounts).sort();
    return {
        labels: sorted,
        data: sorted.map(y => yearCounts[y])
    };
};

export const processTimeData = (sightings) => {
    const hourCounts = {};
    for(let i = 1; i<24; i++) {
        hourCounts[i] = 0;
    }
    
    sightings.forEach(s => {
        const date = new Date(s.time_observed);
        const hour = date.getHours();

        if(hour != 0) {
            hourCounts[hour]++;
        }
    })

    return {
        labels: Object.keys(hourCounts).map(hour => `${hour}:00`),
        data: Object.values(hourCounts)
    };
    
}