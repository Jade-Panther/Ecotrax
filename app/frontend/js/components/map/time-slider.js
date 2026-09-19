

import { applyFilters } from '../filters/filters.js'

let minSlider;
let maxSlider;
let range;
let ticks;

export function initTimeSlider() {
    minSlider = document.querySelector('#min-slider');
    maxSlider = document.querySelector('#max-slider');
    range = document.querySelector('#range');
    ticks = document.querySelector('#ticks');

    if(!minSlider || !maxSlider || !range || !ticks) {
        return;
    }

    initTicks();
    initEvents();
    updateRange();
}

const initEvents = () => {
    document.addEventListener('DOMContentLoaded', updateRange)

    minSlider.addEventListener('input', () => {
        console.log('Minslider value', minSlider.value)
        if(+minSlider.value > +maxSlider.value) {
            minSlider.value = maxSlider.value;
        }
        updateRange();
    })
    maxSlider.addEventListener('input', () => {
        console.log('Maxslider value', maxSlider.value)
        if(+maxSlider.value < +minSlider.value) {
            maxSlider.value = minSlider.value;
        }
        updateRange();
    })

    const toggle = document.querySelector('#time-mode-toggle');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('night');
        invertRange();
    });

}

const initTicks = () => {
    const step = 30;
    for(let i = 0; i<minSlider.max; i+=step) {
        const x = i / minSlider.max * 100;

        const tick = document.createElement('div');
        tick.classList.add('tick');
        tick.style.left = `${x}%`;

        const time = i / 60 + 1
        if(time % 2 == 0) {
            tick.style.height = '10px'

            const label = document.createElement('div');
            
            label.classList.add('tick-label');
            label.textContent = `${time <= 12 ? time : (time - 12)}`;

            tick.appendChild(label);

        }
        ticks.appendChild(tick);
    }


}

const THUMB = 20;
const updateRange = () => {
    const minVal = +minSlider.value;
    const maxVal = +maxSlider.value;

    const rect = minSlider.getBoundingClientRect();
    const minX = minVal / (+minSlider.max) * (rect.width - THUMB) + THUMB / 2;
    const maxX = maxVal / (+maxSlider.max) * (rect.width - THUMB) + THUMB / 2;

    range.style.left = `${minX}px`;
    range.style.width = `${maxX - minX}px`;
};


const invertRange = () => {
    console.log(range.classList);
    if(!range.classList.contains('inverted')) {
        range.style.background = 'rgba(255, 255, 255)';
        document.querySelector('#track').style.background = 'rgb(26, 241, 219)';
        range.classList.add('inverted')
    }
    else {
        range.style.background = 'rgb(26, 241, 219)';
        document.querySelector('#track').style.background = 'rgba(255, 255, 255)';
        range.classList.remove('inverted')
    }
    
}

