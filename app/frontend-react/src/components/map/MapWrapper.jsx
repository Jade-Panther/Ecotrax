import { useState } from 'react';
import Map from './Map';
import MapControls from './MapControls';

const MapWrapper = ({ filters, sightings, setSightings }) => {
    const [mapInst, setMapInst] = useState(null);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex'}}>
            <Map sightings={sightings} onMapReady={setMapInst}/>
            
            <div id="ui-layer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, marginRight: '20px'}}>
                <MapControls mapInst={mapInst}/> 
            </div>
        </div>
    );
};

export default MapWrapper;