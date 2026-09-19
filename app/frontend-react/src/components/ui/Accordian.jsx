import { useState } from 'react';

const Accordian = ({ title, children, initialClass = '' }) => {
    const [isOpen, setIsOpen] = useState(initialClass.includes('open'));

    const toggleAccordian = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={`accordian ${isOpen ? 'open' : ''}`}>
            <div className='accordian-header' onClick={toggleAccordian}>
                {title}
            </div>
            <div className='accordian-content'>{children}</div>
        </div>
    );
};

export default Accordian;
