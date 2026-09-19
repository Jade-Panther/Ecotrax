import { formatDateTime, formatStr } from '../../utils/utils.js';
import { goto } from '../map/map.js';

let sightingsList;
let state = {
    sightings: [],
    limit: 10,
}

export const initSightings = () => {
    sightingsList = document.querySelector('#sightings-list');
}

export const displaySightings = (sightings, limit = state.limit) => {
    state.sightings = sightings;
    state.limit = limit;

    sightingsList.innerHTML = '';

    sightings.slice(0, limit).forEach(sighting => {
        const li = document.createElement('li');
        li.className = 'sighting';
        li.id = `sighting-${sighting.id}`;
        li.innerHTML = `
            <div class="sighting-layout">

                <div class="sighting-actions">
                    <button class="goto-loc-btn">
                        <span class="material-symbols-outlined">my_location</span>
                    </button>

                    <button class="size-toggle-btn">
                        <span class="material-symbols-outlined">expand_more</span>
                    </button>
                </div>

                <div class="sighting-main">
                    <div class="compact-container open">
                        <div class="sighting-species-name">
                            ${sighting.species.common_name}
                        </div>

                        <div class="sighting-species-scientific-name">
                            ${sighting.species.scientific_name}
                        </div>
                    </div>

                    <div class="extra-info-container closed">

                        <div class="photo-container">
                            <img src="../public/empty-picture.png" alt="Sighting Image">
                        </div>

                        <div class="sighting-info">
                            <div class="sighting-species-name">
                                ${formatStr(sighting.species.common_name)}
                            </div>

                            <div class="sighting-species-scientific-name">
                                ${formatStr(sighting.species.scientific_name)}
                            </div>
                            <div class="sighting-date">
                                Observed: <span>${formatDateTime(sighting.time_observed)}</span>
                            </div>
                            <div class="sighting-flex">
                                <span class="sighting-condition">${formatStr(sighting.condition)}</span>-
                                <span class="sighting-position">${formatStr(sighting.position)}</span>
                            </div>
                            <div class="sighting-flex">
                                <span class="sighting-road-name">${formatStr(sighting.road)}</span>-
                                <span class="sighting-state">${formatStr(sighting.state)}</span>
                            </div>
                            

                            <div class="sighting-location">
                                <span>${sighting.lat.toFixed(3)}</span>
                                <span>${sighting.lon.toFixed(3)}</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        `;

        const gotoBtn = li.querySelector('.goto-loc-btn');
        gotoBtn.addEventListener('click', () => {
            goto(sighting.lat, sighting.lon);
        });

        const sizeBtn = li.querySelector('.size-toggle-btn');
        sizeBtn.addEventListener('click', () => {
            const compactContainer = li.querySelector('.compact-container');
            const extraInfoContainer = li.querySelector('.extra-info-container');

            compactContainer.classList.toggle('open');
            compactContainer.classList.toggle('closed');
            extraInfoContainer.classList.toggle('open');
            extraInfoContainer.classList.toggle('closed');
            sizeBtn.classList.toggle('open');
        });

        sightingsList.appendChild(li);
    });

    const sightingCount = document.querySelector('#sightings-count span');
    sightingCount.textContent = limit + ' / ' + sightings.length;
    
}

export const openSighting = (sightingInd, isId=false) => {
    if (!sightingsList) return;
    
    if(isId) {
        sightingsList.querySelector(`#sighting-${sightingInd}`).querySelector('.size-toggle-btn').click(); return;
    }
    if(sightingInd < 0 || sightingInd >= sightingsList.children.length) {
        return;
    }
    sightingsList.children[sightingInd].querySelector('.size-toggle-btn').click();
}

export const promoteSighting = (id) => {
    const ind = state.sightings.findIndex(s => s.id === id);
    if(ind === -1) return;

    const [item] = state.sightings.splice(ind, 1);
    state.sightings.unshift(item);
    const el = document.querySelector(`#sighting-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}