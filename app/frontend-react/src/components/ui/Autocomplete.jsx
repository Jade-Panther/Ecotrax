import React, { useState, useEffect } from 'react';
import { getSpecies, getRoad } from '../../utils/api'; 

const Autocomplete = ({
    type,
    filters,
    setFilters,
    value,
    onChange,
    isForm = false,
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showList, setShowList] = useState(false);

    const states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ];

    const currInputVal = value !== undefined ? value : (type === 'species' ? filters?.species : type == 'road' ? filters?.road : filters?.state) || '';

    useEffect(() => {
        if(type !== 'species') return;

        const handleSpeciesLookup = async () => {
            if(currInputVal.length > 1) {
                const suggested = await getSpecies(currInputVal);
                if(suggested && suggested.length > 0) {
                    setSuggestions(suggested);
                    setShowList(true);
                }
                else {
                    setSuggestions([]);
                    setShowList(false);
                }
            }
            else {
                setSuggestions([]);
                setShowList(false);
            }
        };

        handleSpeciesLookup();
    }, [currInputVal, type]);

    useEffect(() => {
        if(type !== 'state') return;

        const val = currInputVal.toLowerCase();
        const filteredStates = states.filter(
            (s) => val.length === 0 || s.toLowerCase().startsWith(val)
        );
        setSuggestions(filteredStates);
    }, [currInputVal, type]);

    useEffect(() => {
        if(type != 'road') return;

        const handleRoadLookup = async () => {
            if(currInputVal.length > 1) {
                const suggested = await getRoad(currInputVal);
                console.log('road', suggested)
                if(suggested && suggested.length > 0) {
                    setSuggestions(suggested);
                    setShowList(true);
                }
                else {
                    setSuggestions([]);
                    setShowList(false);
                }
            }
            else {
                setSuggestions([]);
                setShowList(false);
            }
        };

        handleRoadLookup();
    }, [currInputVal, type])

    const handleChange = (e) => {
        const val = e.target.value;
        if(onChange) {
            onChange(val);
        }
        else if(setFilters) {
            setFilters((prev) => ({ ...prev, [type]: val }));
        }

        if(type === 'state') {
            setShowList(true);
        }
    };

    const handleSelect = (name) => {
        if(onChange) {
            onChange(name);
        }
        else if(setFilters) {
            setFilters((prev) => ({ ...prev, [type]: name }));
        }
        setShowList(false);
    };

    const handleBlur = () => {
        setTimeout(() => setShowList(false), 200);
    };

    if(type === 'species') {
        return (
            <div
                className='species-autocomplete-container'
                style={{ position: 'relative' }}
            >
                <input
                    className={`${
                        isForm ? 'form-input' : 'filter'
                    } species-autocomplete text-input`}
                    type='text'
                    id='report-species'
                    placeholder='Species'
                    value={currInputVal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={() => {
                        if(currInputVal.length > 1) setShowList(true);
                    }}
                />
                {showList && suggestions.length > 0 && (
                    <ul className='autocomplete' style={{ display: 'block' }}>
                        {suggestions.map((s, idx) => (
                            <li
                                key={idx}
                                onClick={() =>
                                    handleSelect(
                                        s.common_name || s.scientific_name
                                    )
                                }
                            >
                                {s.common_name}{' '}
                                {s.scientific_name ? (
                                    <i>({s.scientific_name})</i>
                                ) : (
                                    ''
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    if(type === 'state') {
        return (
            <div
                className='state-autocomplete-container'
                style={{ position: 'relative' }}
            >
                <input
                    className='filter text-input'
                    type='text'
                    id='filter-state'
                    placeholder='Filter state'
                    value={currInputVal}
                    onChange={handleChange}
                    onClick={() => setShowList(true)}
                    onBlur={handleBlur}
                />
                {showList && suggestions.length > 0 && (
                    <ul className='autocomplete' style={{ display: 'block' }}>
                        {suggestions.map((s, idx) => (
                            <li key={idx} onClick={() => handleSelect(s)}>
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    if(type == 'road') {
        return (
            <div
                className='state-autocomplete-container'
                style={{ position: 'relative' }}
            >
                <input
                    className='filter text-input'
                    type='text'
                    id='filter-road'
                    placeholder='Filter road'
                    value={currInputVal}
                    onChange={handleChange}
                    onClick={() => setShowList(true)}
                    onBlur={handleBlur}
                />
                {showList && suggestions.length > 0 && (
                    <ul className='autocomplete' style={{ display: 'block' }}>
                        {suggestions.map((s, idx) => (
                            <li key={idx} onClick={() => handleSelect(s)}>
                                {s.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return null;
};

export default Autocomplete;
