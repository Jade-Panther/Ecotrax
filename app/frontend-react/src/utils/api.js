/*
Handles all the api calls


*/



export async function getObservations(params) {
    const newParams = {}
    Object.keys(params).forEach(key => {
        if(key === 'dayRange') {
            newParams['day_start'] = params[key][0] == null ? '' : params[key][0];
            newParams['day_end'] = params[key][1] == null ? '' : params[key][1];
        }   
        else if(key === 'dateRange') {
            newParams['date_start'] = params[key][0] == null ? '' : params[key][0];
            newParams['date_end'] = params[key][1] == null ? '' : params[key][1];
        }
        else {
            newParams[key] = params[key] == null ? '' : params[key];
        }
    });
    
    if(params.bounds) {
        newParams['min_lat'] = params.bounds.min_lat;
        newParams['max_lat'] = params.bounds.max_lat;
        newParams['min_lon'] = params.bounds.min_lon;
        newParams['max_lon'] = params.bounds.max_lon;
        delete newParams.bounds; 
    }

    const url = new URL(`/api/observations`, window.location.origin);
    url.search = new URLSearchParams(newParams);
    console.log(newParams)
    console.log(url)
    const res = await fetch(url);

    console.log(res)
    
    if(!res.ok) {
        throw new Error('Failed to load observations');
    }

    return await res.json();
}

export async function createObservation(data) {
    const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if(!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create observation: ${text}`);
    }

    return await res.json();
}

async function apiFetch(url, options = {}) {
    const res = await fetch(url, options);

    if(!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed: ${res.status}`);
    }

    return await res.json();
}

export function getCrossings() {
    return apiFetch('/api/crossings');
}

export async function getSpecies(query) {
    const params = new URLSearchParams({
        q: query
    });
    return apiFetch(`/api/autocomplete_species?${params}`);
}

export async function getRoad(query) {
    const params = new URLSearchParams({
        q: query
    });

    return apiFetch(`/api/roads?${params}`);
}

export async function validateObs(data) {
    const params = new URLSearchParams({
        name: data.species_name,
        lat: data.lat,
        lon: data.lon,
        date: data.time_observed
    });

    return apiFetch(`/api/validate?${params}`);
}

export async function getLocData(lat, lon) {
    const params = new URLSearchParams({
        lat: lat,
        lon: lon,
    });

    return apiFetch(`/api/loc?${params}`);
}

export async function getTotals() {
    return apiFetch('/api/totals')
}

export async function getAnalytics(params) {
    const newParams = {};

    Object.keys(params).forEach(key => {
        if (key === 'dayRange') {
            newParams['day_start'] = params[key][0] == null ? '' : params[key][0];
            newParams['day_end'] = params[key][1] == null ? '' : params[key][1];
        }
        else if (key === 'dateRange') {
            newParams['date_start'] = params[key][0] == null ? '' : params[key][0];
            newParams['date_end'] = params[key][1] == null ? '' : params[key][1];
        }
        else if (key !== 'bounds') {
            newParams[key] = params[key] == null ? '' : params[key];
        }
    });

    const url = new URL('/api/analytics', window.location.origin);
    url.search = new URLSearchParams(newParams);

    return apiFetch(url);
}
