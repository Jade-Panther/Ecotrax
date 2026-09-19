import { useState } from 'react';
import Autocomplete from '../../ui/Autocomplete';
import { useApp } from "../../../context/AppContext";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterSidebar = () => {
    const { filters, setFilters } = useApp();
    const [isHidden, setIsHidden] = useState(false);

    const hide = () => {
        setIsHidden((prev) => !prev);
    };

    const clearFilters = () => {
        setFilters({
            species: null,
            state: null,
            condition: null,
            position: null,
            dayRange: [null, null],
            dateRange: [null, null],
            road: null,
        });
    };

    // Update state when a filter changes
    const handleChange = (key, value) => {
        console.log('changing')
        console.log(key, value)
        setFilters((prev) => ({
            ...prev,
            [key]: value || null,
        }));
    };

    return (
        <div id='filter-sidebar' className={`sidebar over-map ${isHidden ? 'hidden' : ''}`}>
            <button
                className='hide-btn'
                id='hide-filter-sidebar'
                onClick={hide}
            >
                <span className='material-symbols-outlined'>
                    {isHidden ? 'arrow_forward_ios' : 'arrow_back_ios'}
                </span>
            </button>

            <div className='sidebar-content'>
                <div id='filter-title'>Filters</div>

                <h3 className='filter-section'>General</h3>
                <Autocomplete
                    type='species'
                    filters={filters}
                    setFilters={setFilters}
                    onChange={(val) => handleChange('species', val)}
                />

                <div className='section-flex'>
                    <select
                        id='filter-position'
                        className='filter select-input'
                        value={filters.position || ''}
                        onChange={(e) =>
                            handleChange('position', e.target.value)
                        }
                    >
                        <option value=''>Any position</option>
                        <option value='on_road'>On road</option>
                        <option value='road_side'>Roadside</option>
                        <option value='near_road'>Near road</option>
                    </select>

                    <select
                        id='filter-condition'
                        className='filter select-input'
                        value={filters.condition || ''}
                        onChange={(e) =>
                            handleChange('condition', e.target.value)
                        }
                    >
                        <option value=''>Any condition</option>
                        <option value='dead'>Dead</option>
                        <option value='alive'>Alive</option>
                    </select>
                </div>

                <h3 className='filter-section'>Location</h3>
                <Autocomplete
                    type='state'
                    filters={filters}
                    setFilters={setFilters}
                    onChange={(val) => handleChange('state', val)}
                />

                {/**<select
                    id='filter-road-type'
                    className='filter select-input'
                    value={filters.road || ''}
                    onChange={(e) => handleChange('road', e.target.value)}
                >
                    <option value=''>Any road</option>
                    <option value='rural'>Rural</option>
                    <option value='suburban'>Suburban</option>
                    <option value='urban'>Urban</option>
                </select> **/}
                <Autocomplete
                    type='road'
                    filters={filters}
                    setFilters={setFilters}
                    onChange={(val) => handleChange('road', val)}
                />


                <h3 className='filter-section'>Time / Date</h3>
                {/**<select
                    id='filter-time'
                    className='filter select-input'
                    defaultValue=''
                >
                    <option value=''>Any</option>
                    <option value='last-seven'>Last 7 days</option>
                    <option value='last-thirty'>Last 30 days</option>
                    <option value='last-year'>Last year</option>
                </select>**/}

                <div className='section-flex'>
                    <div className='date-input-wrapper'>
                        <label className='date-label'>From</label>
                        <input
                            type='date'
                            id='filter-date-start'
                            className='filter text-input date-input'
                            value={filters.dateRange?.[0] ? new Date(filters.dateRange[0]).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const newStart = e.target.value ? e.target.value : null;
                                handleChange('dateRange', [newStart, filters.dateRange?.[1] || null]);
                            }}
                        />
                    </div>

                    <div className='date-input-wrapper'>
                        <label className='date-label'>To</label>
                        <input
                            type='date'
                            id='filter-date-end'
                            className='filter text-input date-input'
                            min={filters.dateRange?.[0] ? new Date(filters.dateRange[0]).toISOString().split('T')[0] : ''}
                            value={filters.dateRange?.[1] ? new Date(filters.dateRange[1]).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const newEnd = e.target.value ? e.target.value : null;
                                handleChange('dateRange', [filters.dateRange?.[0] || null, newEnd]);
                            }}
                        />
                    </div>
                </div>

                <button
                    id='clear-filters-btn'
                    className='submit-btn'
                    onClick={clearFilters}
                >
                    Clear filters
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
