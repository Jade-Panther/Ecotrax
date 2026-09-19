/*
UI filtering logic
*/
import { state } from '../../app/state.js'
import { updateFilters } from '../../app/controller.js'

let filters;

export const initFilters = () => {
    filters = {
        species: document.querySelector('#filter-species'),
        state: document.querySelector('#filter-state'),
        condition: document.querySelector('#filter-condition'),
        position: document.querySelector('#filter-position'),
        dateRange: {
            start: document.querySelector('#filter-date-start'),
            end: document.querySelector('#filter-date-end')
        },
        time: document.querySelector('#filter-time'),
        road: document.querySelector('#filter-road-type')
    }

    for(const filter in filters) {
        const current = filters[filter];

        if(current && current instanceof Element) {
            filters[filter].addEventListener('change',  () => {
                applyFilters();
            });
        }
        else if (current && typeof current === 'object') {
            for(const subFilter in filters[filter]) {
                const el = filters[filter][subFilter];

                if(el instanceof Element) {
                    el.addEventListener('change', () => {
                        applyFilters();
                    });
                }
            }
            
        }
    }

    document.querySelector('#clear-filters-btn').addEventListener('click', () => {
        for(const filter in filters) {
            if(filters[filter] instanceof Element) {
                filters[filter].value = '';
            }
            else {
                for(const subFilter in filters[filter]) {
                    const el = filters[filter][subFilter];

                    if(el instanceof Element) {
                        el.value = '';
                    }
                }
            }
        }
        applyFilters();
    })

    applyFilters();
}

export function applyFilters() {
    let newFilters = {
        species: filters.species?.value || '',
        state: filters.state?.value || '',
        condition: filters.condition?.value || '',
        position: filters.position?.value || '',
        road: filters.road?.value || '',
        dateStart: filters.dateRange.start?.value || '',
        dateEnd: filters.dateRange.end?.value || ''
    };
    updateFilters(newFilters);
}

