import Accordian from '../../ui/Accordian';
import SightingsList from './SightingsList';
import Analytics from './Analytics';
import CrossingKey from './CrossingKey';

import { useApp } from "../../../context/AppContext";

const RightSidebar = () => {
    const { viewMode } = useApp();
    const isCrossingsView = viewMode === 'crossings';

    return (
        <div id='right-sidebar' className='sidebar'>
            <div className='sidebar-content'>
                <Accordian title={isCrossingsView ? 'Wildlife Crossing Key' : 'Analysis'} initialClass='open'>
                    {isCrossingsView ? (
                        <CrossingKey />
                    ) : (
                        <Analytics />
                    )}
                </Accordian>

                <Accordian title={isCrossingsView ? 'Crossing Details' : 'Sightings'} initialClass='open'>
                    
                    <SightingsList />
                    
                </Accordian>
            </div>
        </div>
    );
};

export default RightSidebar;
