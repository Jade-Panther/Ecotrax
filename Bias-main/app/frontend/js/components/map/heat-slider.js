
import { state } from '../../app/state.js'


let heatBar, thresholds;
let stops = []

export const initHeatSlider = () => {
    heatBar = document.querySelector('#heat-gradient');
    thresholds = document.querySelectorAll('.threshold');

    stops = [
        { pos: 0.2, color: 'rgb(37, 99, 235)' },
        { pos: 0.4, color: 'rgb(16, 185, 129)' },
        { pos: 0.6, color: 'rgb(234, 179, 8)' },
        { pos: 0.9, color: 'rgb(239, 68, 68)' }
    ]

    thresholds.forEach(handle => {
        handle.addEventListener('pointerdown', startDrag);
    });
}


const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    state.map.dragging.disable();

    const handle = e.currentTarget;

    function onMove(event) {
        const rect = heatBar.getBoundingClientRect();

        let y = event.clientY - rect.top + 20;
        y = Math.max(15, Math.min(rect.height, y - 5))
        
        handle.style.top = `${y}px`;

        const stop = 1 - y / rect.height;
        const ind = handle.dataset.index;

        stops[ind].pos = stop;

        handle.style.top = `${y}px`;

        updateDisplay()
    }

    function stopDrag() {
        state.map.dragging.enable();
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', stopDrag);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', stopDrag);
}

const updateDisplay = () => {
    stops = Object.values(stops).sort((a, b) => a.pos - b.pos);
    const gradient = {};
    let cssGradient = [];

    for(const key in stops) {
        const s = stops[key];

        gradient[s.pos] = s.color;
        cssGradient.push(`${s.color} ${s.pos * 100}%`);
    }

    state.heatLayer.setOptions({gradient});

    heatBar.style.background = `linear-gradient(to top, ${cssGradient.join(', ')})`;
}
