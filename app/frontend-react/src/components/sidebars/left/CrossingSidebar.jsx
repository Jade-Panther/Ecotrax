import { useState } from 'react';

import { useApp } from "../../../context/AppContext";


const CrossingSidebar = () => {
    const [isHidden, setIsHidden] = useState(false);

    const hide = () => {
        setIsHidden((prev) => !prev);
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
                <div id='filter-title'>Crossings</div>

            </div>
        </div>
    );
};

export default CrossingSidebar;
