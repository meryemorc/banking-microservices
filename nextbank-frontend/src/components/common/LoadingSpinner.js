import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
    const sizeClass = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    };

    return (
        <div className={`loading-container ${sizeClass[size]}`}>
            <div className="spinner"></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;