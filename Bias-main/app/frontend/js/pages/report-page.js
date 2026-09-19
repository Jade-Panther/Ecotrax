import { initMap } from '../components/map/map.js';
import { initForm } from '../components/form/form.js';
import { initAutocomplete } from '../components/generation/autocomplete.js'

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initForm();
    initAutocomplete();
});