import { useState, useEffect } from 'react';
import { getLocData, createObservation, validateObs } from '../../../utils/api';
import Autocomplete from '../../ui/Autocomplete';

const ReportSidebar = ({ onSightingAdded }) => {
    const [formData, setFormData] = useState({
        speciesName: '',
        lat: '',
        lon: '',
        position: '',
        condition: '',
        corpseStage: '',
        date: '',
        time: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [geoData, setGeoData] = useState({ state: '—', road: '—' });
    const [roadWarning, setRoadWarning] = useState("");
    const [errors, setErrors] = useState({});

    const getCurrDateTime = () => {
        const now = new Date();
        return {
            date: now.toISOString().split('T')[0],
            time: new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).format(now),
        };
    };

    // Set inital time and date to current time
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ...getCurrDateTime(),
        }));
    }, []);

    useEffect(() => {
        const handleMapClick = async (e) => {
            const { lat, lon } = e.detail;
            
            // Update coordinates
            setFormData(prev => ({ 
                ...prev, 
                lat: lat.toString(), 
                lon: lon.toString() 
            }));

            const data = await getLocData(lat, lon);
            const stateName = data.state || '';
            const roadName = data.road || '';

            setGeoData({ state: stateName, road: roadName });

            const roadWarn = !roadName ? 'Must be near a valid road' : !stateName ? 'Must be inside the US' : '';
            setRoadWarning(roadWarn);
        }

        document.addEventListener('mapLocationSelected', handleMapClick);
        return () => document.removeEventListener('mapLocationSelected', handleMapClick);
    }, []);

    // Lookup road and state when lat/lon changes
    const lookupLocation = async (latVal, lonVal) => {
        if (!latVal || !lonVal) return;
        try {
            const data = await getLocData(Number(latVal), Number(lonVal));
            setGeoData({ state: data.state || '', road: data.road || '' });
        }
        catch (err) {
            console.error('Failed looking up text input coordinates:', err);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        const fieldMap = {
            species: "speciesName",
            corpse: "corpseStage",
        };
        const stateKey = fieldMap[id.replace("report-", "")] ?? id.replace("report-", "");

        setFormData(prev => {
            const updated = { ...prev, [stateKey]: value };
            
            if(stateKey === 'condition') {
                updated.corpseStage = value === "dead" ? "N/A" : "";
            }
            
            if(stateKey === 'lat' || stateKey === 'lon') {
                lookupLocation(stateKey === 'lat' ? value : formData.lat,stateKey === 'lon' ? value : formData.lon);
            }

            return updated;
        });
    };
    const validateForm = () => {
        const tempErrors = {};

        const validations = [
            ["species", !formData.speciesName.trim(), "Species is required."],
            ["condition", !formData.condition.trim(), "Condition is required."],
            ["position", !formData.position.trim(), "Position is required."],
            [
                "location",
                !formData.lat.trim() || !formData.lon.trim(),
                "Location is required.",
            ],
            [
                "timeDate",
                !formData.date.trim() || !formData.time.trim(),
                "Time and/or date is required.",
            ],
            [
                "corpse",
                formData.condition === "dead" && !formData.corpseStage.trim(),
                "Corpse condition is required when dead.",
            ],
        ];

        validations.forEach(([key, condition, message]) => {
            if(condition) {
                tempErrors[key] = message;
            }
        });

        setErrors(tempErrors);

        const valid = Object.keys(tempErrors).length === 0;
        return { valid, errors: tempErrors };
    };

    const handleSubmit = async () => {
        const localValidation = validateForm();

        if (!localValidation.valid) {
          console.log('Frontend validation failed. Stopping submission.', localValidation.errors);
          return; 
      }

      setErrors({});
        
        const obs = {
            lat: Number(formData.lat),
            lon: Number(formData.lon),
            state: geoData.state || 'Unknown',
            species_name: formData.speciesName || 'Unknown',
            position: formData.position,
            condition: formData.condition,
            corpse: formData.corpseStage || 'N/A',
            road_name: geoData.road || 'Unknown',
            photo: 'None',
            time_observed: `${formData.date} ${formData.time}`
        };

        const validResult = await validateObs(obs);

        if(validResult.valid) {
            const newObs = await createObservation(obs);
    
            if(onSightingAdded && newObs) {
                onSightingAdded(newObs);
            }

            setIsSubmitted(true);
        }
        else {
            const serverErrors = validResult.errors || {};
            const mappedErrors = {};

            Object.entries({
                species_name: "species",
                position: "position",
                condition: "condition",
                time_observed: "timeDate",
            }).forEach(([serverKey, clientKey]) => {
                serverErrors[serverKey] && (mappedErrors[clientKey] = serverErrors[serverKey]);
            });

            if(serverErrors.lat || serverErrors.lon) {
                mappedErrors.location = "Invalid map coordinates.";
            }

            setErrors(mappedErrors);
        }
    };

    const handleResetForm = () => {
        setFormData({
            speciesName: "",
            lat: "",
            lon: "",
            position: "",
            condition: "",
            corpseStage: "",
            ...getCurrDateTime(),
        });

        setErrors({});
        setGeoData({ state: "—", road: "—" });
        setIsSubmitted(false);
    };

    const updateField = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
    <div id='report-sidebar' className='sidebar'>
      
      
      {!isSubmitted ? (
        <div className='sidebar-content' id='form-page'>
          <h2 className='sub-title' id='submit-title'>Report</h2>
          
          <div className='form-group'>
            <div className='photo-container'>
              <img src='/assets/empty-picture.png' alt='Sighting Image' />
              <div className='upload-text'>Upload photo</div>
            </div>
            <div className='note'>Photos are optional, but they help improve data quality</div>
          </div>
          
         
          <div className='form-group'>
                      
            <Autocomplete 
                type='species' 
                value={formData.speciesName} 
                onChange={(value) => updateField("speciesName", value)}
            />
                {errors.species && <span id='species-error' className='error-message'>{errors.species}</span>}
          </div>
        
          <div className='form-group'>
            <h3 className='filter-section'>Position</h3>
            <div className='section-flex'>
              <input 
                type='text' 
                id='report-lat' 
                className='text-input form-input' 
                placeholder='Latitude' 
                value={formData.lat}
                onChange={handleChange}
              />
              <input 
                type='text' 
                id='report-lon' 
                className='text-input form-input' 
                placeholder='Longitude' 
                value={formData.lon}
                onChange={handleChange}
              />
            </div>
            {errors.location && <span id='lon-error' className='error-message'>{errors.location}</span>}

            <div className='note'>You can click on the map to select location as well.</div>

            <div id='state-road' className='geodata-container'>
              <div className='geodata-item'>State: <span id='state-info' className='form-loc-info'>{geoData.state}</span></div>
              <div className='geodata-item'>Road: <span id='road-info' className='form-loc-info'>{geoData.road}</span></div>

              {roadWarning && (
                <div id='road-warn' className='error-message inline-warn'>
                  <img className='small-icon' src='/assets/warn-icon.png' alt='Warning' />
                  <span className='error-text'>{roadWarning}</span>
                </div>
              )}
            </div>
            
            <select id='report-position' className='select-input' value={formData.position} onChange={handleChange}>
              <option value='' disabled>Road position</option>
              <option value='on_road'>On Road</option>
              <option value='road_side'>Road side (within 10 ft)</option>
              <option value='near_road'>Near road (more than 10 ft)</option>
            </select>
            {errors.position && <span id='position-error' className='error-message'>{errors.position}</span>}
          </div>
          
          <div className='form-group'>
            <h3 className='filter-section'>Condition</h3>
            <div className='section-flex'>
              <select id='report-condition' className='select-input form-input' value={formData.condition} onChange={handleChange}>
                <option value='' disabled>Status</option>
                <option value='dead'>Dead</option>
                <option value='alive'>Alive</option>
              </select>

              {formData.condition === 'dead' && (
                <select id='report-corpse' className='select-input form-input' value={formData.corpseStage} onChange={handleChange}>
                  <option value='' disabled>Body Stage</option>
                  <option value='fresh'>Fresh</option>
                  <option value='decomposed'>Decomposed (bloating, smell, etc)</option>
                  <option value='suburban'>Mostly Skeleton</option>
                  <option value='unsure'>Unsure</option>
                </select>
              )}
            </div>
            {errors.condition && <span id='condition-error' className='error-message'>{errors.condition}</span>}
          </div>

          <div className='form-group'>
            <h3 className='filter-section'>Time / Date</h3>
            <input 
              type='text' 
              className='text-input' 
              id='report-date' 
              placeholder='YYYY-MM-DD' 
              value={formData.date} 
              onChange={handleChange}
            />
            <input 
              type='text' 
              id='report-time' 
              className='text-input' 
              placeholder='HH:MM' 
              value={formData.time} 
              onChange={handleChange}
            />
            {errors.timeDate && <span id='time-date-error' className='error-message'>{errors.timeDate}</span>}
          </div>
          
          <button id='submit-report' className='submit-btn' onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div className='sidebar-content' id='submitted-page'>
          <h2 className='sub-title' id='submit-title'>Submit Successful!</h2>
          <div className='section-flex action-row'>
            <button id='submit-again-btn' className='submit-btn' onClick={handleResetForm}>Report Another</button>
            <button id='to-map-btn' className='submit-btn secondary' onClick={() => window.location.href = '/'}>Back To Map</button>
          </div>
        </div>
      )}

    </div>
  );

}

export default ReportSidebar