
import { formatStr, formatDateTime } from '../../../utils/helpers';

import { useListItem } from '../../hooks/useListItem'

const SightingItem = ({ sighting, onPromote }) => {
    const { isOpen, handleGotoClick, handleToggleClick } = useListItem(sighting, onPromote);


    return (
        <li className='sighting' id={`sighting-${sighting.id}`}>
            <div className='sighting-layout'>
                <div className='sighting-actions'>
                    <button className='goto-loc-btn' onClick={handleGotoClick}>
                        <span className='material-symbols-outlined'>
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
                            {sighting.species.common_name}
                        </div>
                        <div className='sighting-species-scientific-name'>
                            {sighting.species.scientific_name}
                        </div>
                    </div>

                    <div
                        className={`extra-info-container ${
                            isOpen ? 'open' : 'closed'
                        }`}
                    >
                        <div className='photo-container'>
                            <img
                                src='/empty-picture.png'
                                alt='Sighting Image'
                            />
                        </div>

                        <div className='sighting-info'>
                            <div className='sighting-species-name'>
                                {formatStr(sighting.species.common_name)}
                            </div>

                            <div className='sighting-species-scientific-name'>
                                {formatStr(sighting.species.scientific_name)}
                            </div>

                            <div className='sighting-date'>
                                Observed:{' '}
                                <span>
                                    {formatDateTime(sighting.time_observed)}
                                </span>
                            </div>

                            <div className='sighting-flex'>
                                Condition:
                                <span className='sighting-condition'>
                                    {formatStr(sighting.condition)}
                                </span>
                                -
                                <span className='sighting-position'>
                                    {formatStr(sighting.position)}
                                </span>
                            </div>

                            <div className='sighting-flex'>
                                Location:
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default SightingItem;
