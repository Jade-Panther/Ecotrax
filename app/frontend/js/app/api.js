/*
Handles all the api calls
*/



export async function getObservations(params) {
    const url = new URL(`/api/observations`, window.location.origin);
    url.search = new URLSearchParams(params);
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

export async function getSpecies(query) {
    const res = await fetch(`/api/autocomplete_species?q=${query}`);

    if(!res.ok) {
        throw new Error(`Failed to fetch autocomplete data ${await res.text()}`)
    }
    return await res.json()
}

export async function validateObs(data) {
    const res = await fetch(`/api/validate?name=${data.species_name}&lat=${data.lat}&lon=${data.lon}&date=${data.time_observed}`);

    if(!res.ok) {
        throw new Error(`Failed to validate observation ${await res.text()}`)
    }
    return await res.json()
}

export async function getLocData(lat, lon) {
    console.log(lat + ', ' + lon)
    const res = await fetch(`/api/loc?lat=${lat}&lon=${lon}`);
    if(!res.ok) {
        throw new Error(`Failed to validate observation ${await res.text()}`)
    }
    return await res.json()
}
/*
import { getObservations } from "./api.js";

const data = await getObservations();

*/