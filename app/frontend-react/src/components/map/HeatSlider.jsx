import { useEffect, useRef, useState } from 'react';
import { RAINBOW } from '../../utils/constants';
import L from 'leaflet';

const START_STOPS = [
    { id: 'blue', pos: 0.2, color: RAINBOW.blue },
    { id: 'green', pos: 0.4, color: RAINBOW.green },
    { id: 'yellow', pos: 0.6, color: RAINBOW.yellow },
    { id: 'red', pos: 0.9, color: RAINBOW.red }
]

const HeatSlider = ({ mapInst, heatLayerInst }) => {
    const heatBarRef = useRef(null);
    const containerRef = useRef(null);
    const [stops, setStops] = useState(START_STOPS);


    useEffect(() => {
        // Sort to prevent glitches
        const sortStops = Object.values(stops).sort((a, b) => a.pos - b.pos);

        const gradient = {};
        const cssGradient = [];

        for(const s of sortStops) {
            gradient[s.pos] = s.color;
            cssGradient.push(`${s.color} ${s.pos * 100}%`);
        }

        if(heatLayerInst) {
            heatLayerInst.setOptions({ gradient: gradient });
        }
        if(heatBarRef.current) {
            heatBarRef.current.style.background = `linear-gradient(to top, ${cssGradient.join(', ')})`;
        }
    }, [stops, heatLayerInst]);


    const startDrag = (e, targetInd) => {
        e.preventDefault();
        e.stopPropagation();
    
        if(mapInst && mapInst.dragging) {
            mapInst.dragging.disable();
        }
    
        const handle = e.currentTarget;
        
        // Calculate the position of threshold and adjust map gradient
        const handleMove = (event) => {
            if(!heatBarRef.current) return;

            const rect = heatBarRef.current.getBoundingClientRect();
    
            let y = event.clientY - rect.top + 20;
            y = Math.max(15, Math.min(rect.height, y - 5))

    
            const stop = 1 - y / rect.height;
            const ind = handle.dataset.index;
            setStops((prevStops) => {
                const updated = [...prevStops];
                updated[targetInd] = {...updated[targetInd], pos: stop};
                return updated;
            });
        }

        const stopDrag = () => {
            if(mapInst && mapInst.dragging) {
                mapInst.dragging.enable();
            }
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', stopDrag);
        };

        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', stopDrag);
    
       
    }

    return (
        <div ref={containerRef} className="over-map" id="heat-controls" >
            <div id="heat-gradient" ref={heatBarRef}></div>
            <div id="heat-bar" >
                {stops.map((stop, index) => {
                    const topVal = heatBarRef.current ? (1 - stop.pos) * heatBarRef.current.getBoundingClientRect().height : (1 - stop.pos) * 150; 

                    return (
                        <div key={stop.id} className="threshold" style={{ top: `${Math.max(15, topVal)}px` }} >
                            <div className="dragger" onPointerDown={(e) => startDrag(e, index)}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeatSlider