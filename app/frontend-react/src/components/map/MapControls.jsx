import { useLocation } from "react-router-dom";
import HeatSlider from "./HeatSlider";
import ViewToggles from "./ViewToggles";
import TimeControls from "./TimeControls";

import { useApp } from "../../context/AppContext";

const MapControls = ({ mapInst }) => {
    const location = useLocation();
    const { viewMode, setViewMode } = useApp();

    return (
        <>
            <div className='over-map' id='map-controls'>
                <button id='zoom-in'>+</button>
                <div id='zoom-level'>100%</div>
                <button id='zoom-out'>-</button>
                <button id='reset-zoom'>Reset</button>
            </div>  
            {location.pathname === "/" && (
                <>
                    {viewMode === 'density' && <HeatSlider mapInst={mapInst} />}
                    {viewMode === 'density' && <TimeControls />}
                    <ViewToggles />
                </>
            )}
        </>
    );
};

export default MapControls;
