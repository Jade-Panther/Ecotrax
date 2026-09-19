import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';

const DEFAULT_CENTER = [39.8283, -98.5795];
const DEFAULT_ZOOM = 5;
const MARKER_ZOOM_THRES = 15;

let mapInst = null;
let heatLayer = null;

const markerLayer = L.layerGroup();
const crossingsLayer = L.layerGroup();

const ICONS = {
    sightingMarker: L.icon({
        iconUrl: '../../public/map-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    crossingMarkerRed: L.icon({
        iconUrl: '../../public/red_circle.png',
        iconSize: [8, 8],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    }),
    crossingMarkerOrange: L.icon({
        iconUrl: '../../public/orange_circle.png',
        iconSize: [8, 8],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    }),
    crossingMarkerGreen: L.icon({
        iconUrl: '../../public/green_circle.png',
        iconSize: [8, 8],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
    }),
}



const Map = ({ children }) => {
    const { sightings, crossings, viewMode } = useApp();
    const mapElementRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if(!mapElementRef.current || mapInst) return;

        mapInst = L.map(mapElementRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            zoomControl: false,
        });

        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
                attribution: '© OpenStreetMap contributors © CARTO',
            }
        ).addTo(mapInst);

        mapElementRef.current
            .querySelectorAll('.over-map')
            .forEach((el) => {
                L.DomEvent.disableClickPropagation(el);
                L.DomEvent.disableScrollPropagation(el);
                L.DomEvent.on(
                    el,
                    'mousedown touchstart pointerdown',
                    L.DomEvent.stopPropagation
                );
            });

        ['heatPane', 'geoPane', 'markerPane'].forEach((pane, i) => {
            mapInst.createPane(pane)
            mapInst.getPane(pane).style.zIndex = 400 + i * 100;
        });

        mapInst.getPane('geoPane').style.zIndex = 400;
        mapInst.getPane('heatPane').style.zIndex = 500;
        mapInst.getPane('markerPane').style.zIndex = 650;

        // Load the stte data
        fetch('/public/geojson/states.json')
            .then((r) => r.json())
            .then((geojson) => {
                if(!mapInst) return;

                L.geoJSON(geojson, {
                    pane: 'geoPane',
                    style: {
                        color: 'rgb(178, 182, 181)',
                        weight: 1,
                        fillColor: 'rgb(255, 255, 255)',
                        fillOpacity: 0,
                    },
                    onEachFeature: (feature, layer) => {
                        if(location.pathname.includes('report')) return;

                        layer.on({
                            mouseover: () =>
                                layer.setStyle({ fillOpacity: 0.3 }),
                            mouseout: () =>
                                layer.setStyle({ fillOpacity: 0 }),
                        });
                    },
                }).addTo(mapInst);
            });

        // Add the event listeners for the buttons
        const controls = [
            {
                selector: '#zoom-in',
                handler: () => mapInst.zoomIn(),
            },
            {
                selector: '#zoom-out',
                handler: () => mapInst.zoomOut(),
            },
            {
                selector: '#reset-zoom',
                handler: () => mapInst.setView(DEFAULT_CENTER, DEFAULT_ZOOM),
            },
        ];

        controls.forEach(({ selector, handler }) => {
            document.querySelector(selector)?.addEventListener('click', handler);
        });

        // Show markers when you get to a certain zoom level
        mapInst.on('zoomend', () => {
            const zoom = mapInst.getZoom();

            const zoomLabel = document.querySelector('#zoom-level');
            if(zoomLabel) {
                zoomLabel.textContent = `${Math.round((zoom / 5) * 100)}%`;
            }

            const showMarkers = zoom >= MARKER_ZOOM_THRES;

            if(showMarkers) {
                markerLayer.addTo(mapInst);
            }
            else {
                mapInst.removeLayer(markerLayer);
            }
        });

        let selectedMarker = null;

        mapInst.on('click', (e) => {
            if(location.pathname !== '/report') return;

            const { lat, lng: lon } = e.latlng;

            selectedMarker && mapInst.removeLayer(selectedMarker);

            selectedMarker = L.marker([lat, lon], {
                pane: 'markerPane',
                icon: ICONS.sightingMarker,
            }).addTo(mapInst);

            document.dispatchEvent(
                new CustomEvent('mapLocationSelected', {
                    detail: { lat, lon },
                })
            );
        });

        mapInst.on('moveend', () => {
            const bounds = mapInst.getBounds();
            const southWest = bounds.getSouthWest();
            const northEast = bounds.getNorthEast();

            const boundsData = {
                min_lat: southWest.lat,
                max_lat: northEast.lat,
                min_lon: southWest.lng,
                max_lon: northEast.lng
            };

            document.dispatchEvent(
                new CustomEvent('mapBoundsChanged', {
                    detail: boundsData,
                })
            );
        });

        return () => {
            controls.forEach(({ selector, handler }) => {
                document
                    .querySelector(selector)
                    ?.removeEventListener('click', handler);
            });

            mapInst?.remove();
            mapInst = null;
        };
    }, [location.pathname]);


    useEffect(() => {
        if(mapInst && sightings.length) {
            updateMap(sightings, crossings, viewMode);
        }
    }, [sightings, crossings, viewMode]);

    return (
        <div id='map' ref={mapElementRef}>
            {children}
        </div>
    );
};

export default Map;

export function updateMap(points, crossings, viewMode) {
    if(!mapInst) return;

    heatLayer && mapInst.removeLayer(heatLayer);
    mapInst.removeLayer(markerLayer);
    mapInst.removeLayer(crossingsLayer);
    markerLayer.clearLayers();
    crossingsLayer.clearLayers();

    if(viewMode === 'density') {
        const heatData = points.map((p) => [p.lat, p.lon, 50]);

        points.forEach((p) => {
            L.marker([p.lat, p.lon], {
                pane: 'markerPane',
                icon: ICONS.sightingMarker,
            }).on('click', () => {
                    document.dispatchEvent(
                        new CustomEvent('mapMarkerSelected', {
                            detail: { id: p.id },
                        })
                    );
                })
                .addTo(markerLayer);
        });

        heatLayer = L.heatLayer(heatData, {
            radius: 30,
            blur: 15,
            pane: 'heatPane',
            gradient: {
                0.2: 'blue',
                0.3: 'lime',
                0.5: 'orange',
                1.0: 'red',
            },
        }).addTo(mapInst);

        mapInst.getPane('heatPane').style.pointerEvents = 'none';

        mapInst.getZoom() >= MARKER_ZOOM_THRES ? markerLayer.addTo(mapInst) : mapInst.removeLayer(markerLayer);
    }
    else if(viewMode === 'crossings') {
        console.log('crossings', crossings)
        crossings.forEach((c) => {
            L.marker([c.latitude, c.longitude], { 
                pane: 'markerPane', 
                icon: c.status == 'In Planning' ? ICONS.crossingMarkerRed : c.status == 'Under Construction' ? ICONS.crossingMarkerOrange : ICONS.crossingMarkerGreen
            })
            .on('click', () => {
                document.dispatchEvent(
                    new CustomEvent('mapMarkerSelected', {
                        detail: { id: c.id },
                    })
                );
            })
            .bindPopup(`<b>${c.name || 'Unnamed Crossing'}</b><br>Type: ${c.structure_type || 'N/A'}`)
            .addTo(crossingsLayer);
        });

        crossingsLayer.addTo(mapInst);
    }
}

export function goto(lat, lon) {
    if(!mapInst) return;

    mapInst.flyTo([lat, lon], 20, {
        animate: true,
        duration: 2,
    });
}