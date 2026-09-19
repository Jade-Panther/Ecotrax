import { useState, useEffect } from 'react';

import FilterSidebar from '../components/sidebars/left/FilterSidebar';
import CrossingSidebar from '../components/sidebars/left/CrossingSidebar'
import MapWrapper from '../components/map/MapWrapper';
import RightSidebar from '../components/sidebars/right/RightSidebar';
import { getObservations, getCrossings } from '../utils/api';

import { useApp } from "../context/AppContext";

function useDebounce(value, delay) {
    const [debounceVal, setDebounceVal] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceVal;
}

console.log('Initializing Main Page')
const MainPage = () => {
    const { filters, viewMode, setSightings, setCrossings } = useApp();
    const [bounds, setBounds] = useState(null);

    const debounceBounds = useDebounce(bounds, 300);

    useEffect(() => {
        const handleBoundsChange = (e) => {
            setBounds(e.detail);
        };

        document.addEventListener('mapBoundsChanged', handleBoundsChange);
        return () => {
            document.removeEventListener('mapBoundsChanged', handleBoundsChange);
        };
    }, []);

    // Load the sightings
    useEffect(() => {
        const fetchSightings = async () => {
            try {
                const queryParams = { ...filters };
                if(debounceBounds) {
                    queryParams.bounds = debounceBounds;
                }

                const data = await getObservations(queryParams); 
                setSightings(data);
            }
            catch (error) {
                console.error('Error loading sightings:', error);
            }
        };

        fetchSightings();
    }, [filters, debounceBounds, setSightings]);
    
    useEffect(() => {
        const fetchCrossings = async () => {
            try {
                const data = await getCrossings(); 
                setCrossings(data);
            }
            catch (error) {
                console.error('Error loading crossings:', error);
            }
        };

        fetchCrossings();
    }, [])
    

    return (
        <div id='map-container'>
            {viewMode === 'density' ? <FilterSidebar /> : <CrossingSidebar />}
            <MapWrapper />
            <RightSidebar/>
        </div>
    )
}

export default MainPage