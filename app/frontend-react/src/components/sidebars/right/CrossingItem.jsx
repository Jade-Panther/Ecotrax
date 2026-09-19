import { formatStr, formatDateTime } from '../../../utils/helpers';
import { RAINBOW } from '../../../utils/constants'
import { useListItem } from '../../hooks/useListItem'

const CrossingItem = ({ crossing, onPromote }) => {
    const { isOpen, handleGotoClick, handleToggleClick } = useListItem(crossing, onPromote);
    
    let color = crossing.status == 'Under Construction' ? RAINBOW.yellow : crossing.status == 'In Planning' ? RAINBOW.red : RAINBOW.green
    return (
       <li className='sighting' id={`crossing-${crossing.id}`}>
            <div className='sighting-layout'>
                <div className='sighting-actions'>
                    <button className='goto-loc-btn' onClick={handleGotoClick}>
                        <span className='material-symbols-outlined' style={{color: color}}>
                            my_location
                        </span>
                    </button>

                    <button
                        className={`size-toggle-btn ${isOpen ? 'open' : ''}`}
                        onClick={handleToggleClick}
                    >
                        <span className='material-symbols-outlined'>
                            expand_more
                        </span>
                    </button>
                </div>

                <div className='sighting-main'>
                    <div
                        className={`compact-container ${
                            isOpen ? 'closed' : 'open'
                        }`}
                    >
                        <div className='sighting-species-name'>
                            {crossing.name}
                        </div>
                        <div className='sighting-species-scientific-name'>
                            {crossing.state + ' - ' + crossing.road_name}
                        </div>
                    </div>

                    <div
                        className={`extra-info-container ${
                            isOpen ? 'open' : 'closed'
                        }`}
                    >

                        <div className='sighting-info'>
                            Over/under pass?: 
                            <div className='sighting-condition'>
                               {formatStr(crossing.underpass_or_overpass)}
                            </div>

                            Structure: 
                            <div className='sighting-condition'>
                                {formatStr(crossing.structure_type)}
                            </div>
                           
                            <div className='sighting-condition'>
                                {formatStr(crossing.species_of_concern)}
                            </div>

                            <div className='sighting-position'>
                                {formatStr(crossing.target_species)}
                            </div>

                            {/*<div className='sighting-date'>
                                Observed:{' '}
                                <span>
                                    {formatDateTime(sighting.time_observed)}
                                </span>
                            </div>

                            <div className='sighting-flex'>
                                <span className='sighting-condition'>
                                    {formatStr(sighting.condition)}
                                </span>
                                -
                                <span className='sighting-position'>
                                    {formatStr(sighting.position)}
                                </span>
                            </div>

                            <div className='sighting-flex'>
                                <span className='sighting-road-name'>
                                    {formatStr(sighting.road_name)}
                                </span>
                                -
                                <span className='sighting-state'>
                                    {formatStr(sighting.state)}
                                </span>
                            </div>

                            <div className='sighting-location'>
                                <span>{sighting.lat.toFixed(3)}</span>
                                <span>{sighting.lon.toFixed(3)}</span>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CrossingItem;
