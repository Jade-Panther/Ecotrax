/*
Creates and initalizes map
Adds markers
Handles clicks
*/


import { state } from '../../app/state.js';
import { openSighting, displaySightings, promoteSighting } from '../sightings/sightings.js';

let markerLayer = L.layerGroup();
const markerIcon = L.icon({
    iconUrl: '/assets/map-marker.png',

    iconSize: [32, 32],       
    iconAnchor: [16, 32],     
    popupAnchor: [0, -32]     
});

const API_KEY = 'YYjljdFervjvDHB0idr1';

export const initMap = () => {
    state.map = L.map('map', {
        center: [39.8283, -98.5795],
        zoom: 5,
        zoomControl: false
    });
    // L.maptiler.maptilerLayer({
    //     apiKey: API_KEY,
    //     style: '019e1293-64cf-779e-b764-cfd1ccbc5120'
    //     }).addTo(state.map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(state.map);
    

    const mapOverlays = document.querySelectorAll('.over-map');
    mapOverlays.forEach(el => {
        L.DomEvent.disableClickPropagation(el);
        L.DomEvent.disableScrollPropagation(el);

        L.DomEvent.on(el, 'mousedown touchstart pointerdown', (e) => {
            L.DomEvent.stopPropagation(e);
        });

    });


    state.map.createPane('heatPane');
    state.map.createPane('geoPane');
    state.map.createPane('markerPane');
    state.map.createPane('maskPane');
    state.map.createPane('labelPane');

    state.map.getPane('geoPane').style.zIndex = 400;
    state.map.getPane('maskPane').style.zIndex = 450;
    state.map.getPane('heatPane').style.zIndex = 500;
    state.map.getPane('markerPane').style.zIndex = 650;
    state.map.getPane('labelPane').style.zIndex = 700;

    fetch('/assets/states.json').then(r => r.json()).then(geojson => {
        L.geoJSON(geojson, {
            pane: 'geoPane',
            style: {
                color: 'rgb(223, 241, 239)',
                weight: 1,
                fillColor: '#d0e6ff',
                fillOpacity: 0
            },
            onEachFeature: (feature, layer) => {
                if(window.location.pathname.includes('report')) {
                    return;
                }
                layer.on('mouseover', () => {
                    
                    layer.setStyle({
                        fillOpacity: 0.3
                    });
                    
                });

                layer.on('mouseout', () => {
                    layer.setStyle({
                        fillOpacity: 0
                    });
                });

                layer.on('click', () => {
                    console.log('Clicked:', feature.properties.NAME);
                });
                
            },
                    
        }
    ).addTo(state.map);
});

    document.querySelector('#zoom-in').addEventListener('click', () => {
        state.map.zoomIn();
    });

    document.querySelector('#zoom-out').addEventListener('click', () => {
        state.map.zoomOut();
    });

    document.querySelector('#reset-zoom').addEventListener('click', () => {
        state.map.setView([39.8283, -98.5795], 3);
    });

    state.map.on('zoomend', () => {
        const zoom = state.map.getZoom();

        if(zoom >= 8) {
            if(!state.map.hasLayer(markerLayer)) {
                markerLayer.addTo(state.map);
            }
        }
        else {
            if(state.map.hasLayer(markerLayer)) {
                state.map.removeLayer(markerLayer);
            }
        }

    });

    // Adding markers in report page
    let selectedMarker = null;
    state.map.on('click', (e) => {
        if (window.location.pathname !== '/report.html') return;
        
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        if(selectedMarker) {
            state.map.removeLayer(selectedMarker);
        }

        selectedMarker = L.marker([lat, lon], {
            pane: 'markerPane',
            icon: markerIcon
        }).addTo(state.map);

        document.dispatchEvent(
            new CustomEvent('mapLocationSelected', {
                detail: { lat, lon }
            })
        );
    });

}

export function updateMap(points) {
    if(state.heatLayer) {
        state.map.removeLayer(state.heatLayer);
        state.heatLayer = null
    }
    markerLayer.clearLayers();

    const heatData = [];
    points.forEach(p => {
        heatData.push([p.lat, p.lon, 50]);

        const marker = L.marker([p.lat, p.lon], {
            pane: 'markerPane',
            icon: markerIcon
        });
        marker.addEventListener('click', () => {
            promoteSighting(p.id);
            displaySightings(state.sightings, state.limit);
            openSighting(p.id, true);
        });

        marker.addTo(markerLayer);
    });

    state.heatLayer = L.heatLayer(heatData, {
        radius: 30,
        blur: 15,
        pane: 'heatPane',
        gradient: {
            0.2: 'blue',
            0.3: 'lime',
            0.5: 'orange',
            1.0: 'red'
        },
    }).addTo(state.map);
    
    state.map.getPane('heatPane').style.pointerEvents = 'none';
}

export function goto(lat, lon) {
    state.map.flyTo([lat, lon], 10, {
        animate: true,
        duration: 2 
    });
}

