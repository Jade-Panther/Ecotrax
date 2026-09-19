import { useEffect, useRef, useState } from 'react';
import { RAINBOW } from '../../../utils/constants';


const CrossingKey = () => {
   
    return (
        <div id='crossing-key'>
            <div className='key-row'>
                <div className='key-color' style={{backgroundColor: RAINBOW.red}}></div>
                <div className='key-name'>In Planning</div>
            </div>
            <div className='key-row'>
                <div className='key-color' style={{backgroundColor: RAINBOW.yellow}}></div>
                <div className='key-name'>Under Construction</div>
            </div>
            <div className='key-row'>
                <div className='key-color' style={{backgroundColor: RAINBOW.green}}></div>
                <div className='key-name'>Completed</div>
            </div>
        </div>
    );
};

export default CrossingKey