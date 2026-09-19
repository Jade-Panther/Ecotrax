import { useState, useEffect } from 'react';

import MapWrapper from '../components/map/MapWrapper';
import ReportSidebar from '../components/sidebars/report/ReportSidebar';

import '../css/report.css';

console.log('Initializing Report Page')
const ReportPage = ({ onSightingAdded }) => {
    return (
        <div id='map-container'>
            <ReportSidebar onSightingAdded={onSightingAdded} />
            <MapWrapper />
        </div>
    )
}

export default ReportPage