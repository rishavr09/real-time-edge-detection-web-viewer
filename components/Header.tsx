import React from 'react';

const VisionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="text-center border-b border-sky-400/20 pb-6">
            <div className="flex justify-center items-center gap-4">
                <div className="animate-float">
                    <VisionIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-sky-400 font-orbitron">
                    Real-Time Edge Detection Viewer
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                A web-based debug tool for visualizing processed camera frames from an Android/OpenCV pipeline.
            </p>
        </header>
    );
};