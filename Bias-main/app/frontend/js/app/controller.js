import { state } from './state.js';
import { getObservations, createObservation } from './api.js';
import { updateMap } from '../components/map/map.js';
import { displaySightings } from '../components/sightings/sightings.js';

export async function refreshSightings() {
    const sightings = await getObservations(state.filters);
    console.log('sightings', sightings)
    state.sightings = sightings;

    render();
}

export async function submitObservation(obs) {
    const newObs = await createObservation(obs);

    state.sightings.push(newObs);

}

export function updateFilters(filters) {
    state.filters = filters;

    refreshSightings();
}

export function render() {
    console.log('rendering', state.sightings)
    updateMap(state.sightings);
    displaySightings(state.sightings);
}