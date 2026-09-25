import { useState, useEffect } from 'react';

import Accordian from '../../ui/Accordian';
import SightingsList from './SightingsList';
import Analytics from './Analytics';
import CrossingKey from './CrossingKey';

import { useApp } from "../../../context/AppContext";

const RightSidebar = () => {
    const { viewMode } = useApp();
    const isCrossingsView = viewMode === 'crossings';

    const [width, setWidth] = useState(350);
    const [dragging, setDragging] = useState(false)

    const handleMouseDown = () => {
        setDragging(true);
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ew-resize";
    }

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e) => {
            const newWidth = window.innerWidth - e.clientX;

            if (newWidth >= 250 && newWidth <= 600) {
                setWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    return (
        <div id='right-sidebar' className='sidebar' style={{ width }}>
            <div className='resize-handle' onMouseDown={handleMouseDown}></div>
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
