import { initMap } from '../components/map/map.js';
import { initFilters } from '../components/filters/filters.js';
import { initSightings } from '../components/sightings/sightings.js';
import { initTimeSlider } from '../components/map/time-slider.js';
import { initHeatSlider } from '../components/map/heat-slider.js'
import { initAutocomplete } from '../components/generation/autocomplete.js'
import { initCharts } from '../components/analytics.js'

import { refreshSightings } from '../app/controller.js';

document.addEventListener('DOMContentLoaded', async () => {
    initMap();
    initFilters();
    initSightings();
    initTimeSlider();
    initHeatSlider();
    initAutocomplete();
    

    await refreshSightings();

    initCharts();

    // Filter hide button
    document.querySelectorAll('.hide-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const sidebar = this.parentElement;
            sidebar.classList.toggle('hidden');
        })
    })

    // Open/close accordian logic
    document.querySelectorAll('.accordian').forEach(acc => {
        const header = acc.querySelector('.accordian-header');

        header.addEventListener('click', () => {
            acc.classList.toggle('open');
        });
    });

    // Toggle buttons
    const toggles = document.querySelectorAll('.toggle-btn')
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            if(!btn.classList.contains('activated')) {
                toggles.forEach(btn => btn.classList.remove('activated'))
                btn.classList.add('activated')
            }
        });
    })
});