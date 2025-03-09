// LoadingBanner.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const LoadingBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if the user has dismissed the banner before
        const dismissed = localStorage.getItem("loadingBannerDismissed");
        if (dismissed === "true") {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("loadingBannerDismissed", "true");
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-blue-50 border-b border-blue-200 text-blue-700 p-3 flex items-center justify-between">
            <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                <p className="text-sm">
                    <span className="font-semibold">Please be patient:</span> The backend is running on a free Render instance.
                    Initial requests may take up to 45 seconds.
                </p>
            </div>
            <button className="text-blue-500 hover:text-blue-800 text-xs px-4" onClick={handleDismiss}>
                Dismiss
            </button>
        </div>
    );
};

export default LoadingBanner;
