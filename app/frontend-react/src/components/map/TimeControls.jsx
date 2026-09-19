import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

const TOTAL_MINUTES = 1440;
const STEP = 30;

const TimeControls = () => {
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(TOTAL_MINUTES);
    const [isNightMode, setIsNightMode] = useState(false);
    const { filters, setFilters } = useApp();

    const minSliderRef = useRef(null);
    const rangeRef = useRef(null);
    const trackRef = useRef(null);

    // Generate ticks for slider
    const ticks = [];
    for(let i = 0; i < TOTAL_MINUTES; i += STEP) {
        const x = 2 + (i / (TOTAL_MINUTES)) * 98;
        const time = i / 60;
        const isMajorTick = time % 2 === 0;

        ticks.push({
            id: i,
            left: `${x}%`,
            isMajor: isMajorTick,
            label: isMajorTick ? `${time <= 12 ? time : time - 12}` : null
        });
    }

    // Update the bar
    useEffect(() => {
        if (!minSliderRef.current || !rangeRef.current) return;

        const THUMB_WIDTH = 20;
        const rect = minSliderRef.current.getBoundingClientRect();
        
        const minX = (minVal / TOTAL_MINUTES) * (rect.width - THUMB_WIDTH) + THUMB_WIDTH / 2;
        const maxX = (maxVal / TOTAL_MINUTES) * (rect.width - THUMB_WIDTH) + THUMB_WIDTH / 2;

        rangeRef.current.style.left = `${minX}px`;
        rangeRef.current.style.width = `${maxX - minX}px`;
    }, [minVal, maxVal]);

    // Make sure min doesn't go beyond max
    const handleMinChange = (e) => {
        const val = +e.target.value;

        const newMin = val > maxVal ? maxVal : val;

        setMinVal(newMin);
        updateTimeFilters(newMin, maxVal);
    };

    // Make sure max doesn't go beyond min
    const handleMaxChange = (e) => {
        const val = +e.target.value;

        const newMax = val < minVal ? minVal : val;

        setMaxVal(newMax);
        updateTimeFilters(minVal, newMax);
    };

    const toggleNightMode = () => {
        setIsNightMode(prev => !prev);
        setFilters((prev) => ({
            ...prev,
            invert: isNightMode
        }));
    };

    const updateTimeFilters = (min, max) => {
        console.log('Updating time filters:', min, max);
        setFilters((prev) => ({
            ...prev,
            dayRange: [min, max],
        }));
    };

    return (
        <div className="over-map" id="time-controls">
            <div id="time-mode-toggle" onClick={toggleNightMode} className={`${isNightMode ? 'night' : ''}`}>
                <div className="icon-wrap">
                    <span className="sun material-symbols-outlined filled">wb_sunny</span>
                    <span className="moon material-symbols-outlined filled">bedtime</span>
                </div>
            </div>
            <div className="time-inner">
                <div ref={trackRef} id="track" style={{background: isNightMode ? 'rgb(26, 241, 219)' : 'rgba(255, 255, 255)'}}></div>
                <div className="ticks" id="ticks">
                    {ticks.map(tick => (
                        <div key={tick.id} className="tick" style={{ left: tick.left, height: tick.isMajor ? '10px' : undefined }}>
                            {tick.label && <div className="tick-label">{tick.label}</div>}
                        </div>
                    ))}
                </div>
                <div id="range" ref={rangeRef} style={{ background: isNightMode ? 'rgba(255, 255, 255)' : 'rgb(26, 241, 219)' }}></div>
                <input ref={minSliderRef} id="min-slider" type="range" min="0" max={TOTAL_MINUTES} value={minVal} onChange={handleMinChange} />
                <input id="max-slider" type="range" min="0" max={TOTAL_MINUTES} value={maxVal} onChange={handleMaxChange} />
            </div>
        </div>
    )
}

export default TimeControls