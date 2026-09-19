import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navigation from "./components/Navigation";

import InfoPage from "./pages/InfoPage";
import AboutPage from "./pages/AboutPage";
import ReportPage from "./pages/ReportPage";
import MainPage from "./pages/MainPage";

import { AppContext } from "./context/AppContext";

const App = () => {
    const [filters, setFilters] = useState({
        species: '',
        state: '',
        condition: '',
        position: '',
        dayRange: ['', ''],
        dateRange: ['', ''],
        road: '',
        invert: ''
    });
    const [sightings, setSightings] = useState([]);
    const [viewMode, setViewMode] = useState('density'); 
    const [crossings, setCrossings] = useState([]);

    const addSighting = (newSighting) => {
        setSightings((prev) => [newSighting, ...prev]);
    };

    return (
        <AppContext.Provider value={{
            filters,
            setFilters,
            sightings,
            setSightings,
            viewMode,      
            setViewMode,   
            crossings,
            setCrossings,
        }}>
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/"
                    element={
                        <MainPage />
                    }
                />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route
                    path="/report"
                    element={<ReportPage onSightingAdded={addSighting} />}
                />

                <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
        </AppContext.Provider>
    );
};

export default App;
