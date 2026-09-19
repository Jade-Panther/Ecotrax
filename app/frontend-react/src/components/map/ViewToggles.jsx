import { useApp } from '../../context/AppContext';
import { useState } from "react";

const ViewToggles = () => {
    const { viewMode, setViewMode } = useApp();

    return (
        <div className="over-map" id="toggle-view">
            <button className={`toggle-btn tooltip ${viewMode === "density" ? "activated" : ""}`} id="density" onClick={() => setViewMode("density")}>
                <span className="tooltip-text glassy">Density map</span>
                <span className="material-symbols-outlined">location_on</span>
            </button>
            <button className={`toggle-btn tooltip ${viewMode === "risk" ? "activated" : ""}`} id="risk" onClick={() => setViewMode("risk")}>
                <span className="tooltip-text glassy">Risk assessment</span>
                <span className="material-symbols-outlined">warning</span>
            </button>
            <button className={`toggle-btn tooltip ${viewMode === "crossings" ? "activated" : ""}`} id="crossings" onClick={() => setViewMode("crossings")}>
                <span className="tooltip-text glassy">Crossings</span>
                <span className="material-symbols-outlined">explore</span>
            </button>
        </div>
    );
};

export default ViewToggles;
