import { useEffect, useState } from 'react';
import SightingItem from './SightingItem';
import CrossingItem from './CrossingItem';
import { useApp } from "../../../context/AppContext";

const SightingsList = () => {
    const { sightings, setSightings, crossings, setCrossings, viewMode } = useApp();
    const [limit, setLimit] = useState(10);
    
    const promoteSighting = (id) => {
        const func = viewMode == 'crossings' ? setCrossings : setSightings;
        func((prevSightings) => {
            const currInd = prevSightings.findIndex((s) => s.id === id);
            if(currInd === -1) return prevSightings;

            const updated = [...prevSightings];
            const [promotedItem] = updated.splice(currInd, 1);
            updated.unshift(promotedItem);

            return updated;
        });
    };

    useEffect(() => {
        const handleMarkerClick = (e) => {
            const clickedId = e.detail.id;
            promoteSighting(clickedId);
        };

        document.addEventListener('mapMarkerSelected', handleMarkerClick);

        return () => {
            document.removeEventListener('mapMarkerSelected', handleMarkerClick);
        };
    }, []);

    return (
        <>
            <h4 id='sightings-count'>
                <span>
                    {viewMode == 'density' ? (Math.min(limit, sightings.length) + ' / ' + sightings.length) : Math.min(limit, crossings.length) + '/' + crossings.length}
                </span>{' '}
                {viewMode == 'density' ? 'sightings' : 'crossings'}
            </h4>

            <ul id='sightings-list'>
                {
                viewMode == 'density' ? 
                    (sightings.slice(0, limit).map((sighting) => (
                        <SightingItem key={sighting.id} sighting={sighting} onPromote={promoteSighting} /> 
                    )))
                :
                    (crossings.slice(0, limit).map((crossing) => (
                        <CrossingItem key={crossing.id} crossing={crossing} onPromote={promoteSighting} /> 
                    )))
                }
                <li><button id='extend-btn' onClick={() => setLimit(limit + 10)}>Extend List</button></li>
            
            </ul>
            
        </>
    );
};

export default SightingsList;
