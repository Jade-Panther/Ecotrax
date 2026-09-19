
import { submitObservation } from '../../app/controller.js';
import { state } from '../../app/state.js'
import { getLocData, validateObs } from '../../app/api.js'


let form;

export const initForm = () => {
    form = {
        species: document.querySelector('#report-species'),
        condition: document.querySelector('#report-condition'),
        corpse: document.querySelector('#report-corpse'),
        position: document.querySelector('#report-position'),
        time: document.querySelector('#report-time'),
        date: document.querySelector('#report-date'),
        lat: document.querySelector('#report-lat'),
        lon: document.querySelector('#report-lon'),
        button: document.querySelector('#submit-report')
    };
    if (!form.button) return;

    form.button.addEventListener('click', handleSubmit);

    document.querySelector('#submitted-page').classList.add('closed')
    document.querySelector('#form-page').classList.remove('closed')

    form.lat?.addEventListener('input', () => {
        updateLocData(form.lat.value, form.lon.value);
    });

    form.lon?.addEventListener('input', () => {
        updateLocData(form.lat.value, form.lon.value);
    });

    form.condition.addEventListener('input', () => {
        if(form.condition.value == 'dead') {
            form.corpse.style.display = 'block';
            form.corpse.value = 'N/A'
        }
        else {
            form.corpse.style.display = 'none'
            form.corpse.value = ''
        }
    })

    document.querySelector('#submit-again-btn').addEventListener('click', () => {
        window.location.href = 'report.html'
    });
    document.querySelector('#to-map-btn').addEventListener('click', () => {
        window.location.href = 'index.html'
    })

    setCurrTime();
}

const setCurrTime = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}).format(currentDate);

    const dateEl = document.querySelector('#report-date');
    const timeEl = document.querySelector('#report-time');

    if (dateEl) dateEl.value = formattedDate;
    if (timeEl) timeEl.value = formattedTime;
}

function validateForm() {
    const errors = {};
    let valid = true;

    const species = form.species.value.trim();
    const condition = form.condition.value.trim();
    const corpse = form.corpse.value.trim();
    const position = form.position.value.trim();
    const lat = form.lat.value.trim();
    const lon = form.lon.value.trim();
    const date = form.date.value.trim();
    const time = form.time.value.trim();

    if(!species) {
        errors.species = "Species is required.";
        valid = false;
    }

    if(!condition) {
        errors.condition = "Condition is required.";
        valid = false;
    }

    if(condition === 'dead' && !corpse) {
        errors.corpse = "Corpse condition is required when dead.";
        valid = false;
    }

    if(!position) {
        errors.position = "Position is required.";
        valid = false;
    }

    if(!lat || !lon) {
        errors.lat = "Location is required.";
        errors.lon = "Location is required.";
        valid = false;
    }

    if(!date || !time) {
        errors.date = "Time and/or date is required.";
        errors.time = "Time and/or date is required.";
        valid = false;
    }

    return { valid, errors };
}

function displayErrors(errors) {
    console.log(errors)
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible')

        let input = form[el.id.split('-')[0]];
        if(input) {
            input.classList.remove('input-error')
        }
    });
    for(const field in errors) {
        const errorEl = document.querySelector(`#${field}-error`);

        
        if(form[field]) {
            form[field].classList.add('input-error')
        }
        if(errorEl) {
            errorEl.textContent = errors[field];
            errorEl.classList.add('visible')
        }
        
    }
}

async function handleSubmit() {
    console.log('VALIDATING FORM')
    let emptyForm = validateForm()
    console.log(emptyForm)
    if(emptyForm.valid) {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('visible')
        });
        
        let lat = 39.8283
        let lon = -98.5795
      /*
latitude=data['lat'],
            longitude=data['lon'],
            state=data['state'],
            species_id=species.id,
            position=data['position'],
            condition=data['condition'],
            corpse=data['corpse'],
            source='reported',
            road_name=data['road_name'],
            photo=data['photo'],
            road_name=data['road_name'],
            time_observed=datetime.strptime(data['time_observed'], "%Y-%m-%d %I:%M %p"),
            time_created=datetime.now()

      */
        const obs = {
            lat: Number(form.lat.value),
            lon: Number(form.lon.value),
            state: document.querySelector('#state-info').textContent,
            species_name: form.species.value || 'Unknown',
            position: form.position.value,
            condition: form.condition.value,
            corpse: form.corpse.value || 'N/A',
            road_name: document.querySelector('#road-info').textContent,
            photo: 'None',
            time_observed: `${form.date.value} ${form.time.value}`
        };
        
        const validResult = await validateObs(obs);

        if(validResult.valid) {
            await submitObservation(obs);

            document.querySelector('#submitted-page').classList.remove('closed')
            document.querySelector('#form-page').classList.add('closed')
        }
        else {
            displayErrors(validResult.errors);
        }
    }
    else {
        displayErrors(emptyForm.errors);
    }
}

document.addEventListener('mapLocationSelected', async (e) => {
    const { lat, lon } = e.detail;

    form.lat.value = lat;
    form.lon.value = lon;

    const data = await getLocData(lat, lon);

    const state = document.querySelector('#state-info')
    const road = document.querySelector('#road-info')
    const warn = document.querySelector('#road-warn')

    state.textContent = data.state;
    road.textContent = data.road;

    warn.style.display = 'none'
    if(road.textContent == '') {
        warn.style.display = 'inline-block'
        warn.querySelector('span').textContent = 'Must be near a valid road'
    }
    else if(state.textContent == '') {
        warn.style.display = 'inline-block'
        warn.querySelector('span').textContent = 'Must be inside the US'
    }
});