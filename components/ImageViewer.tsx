import React from 'react';
import type { FrameData } from '../types';
import { Spinner } from './Spinner';

interface ImageViewerProps {
  frameData: FrameData | null;
  error?: string | null;
}

const FpsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ResolutionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
    </svg>
);

const TimeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const ImageViewer: React.FC<ImageViewerProps> = ({ frameData, error }) => {
    const { imageUrl, stats } = frameData || {};

    return (
        <div className="relative aspect-video w-full bg-slate-900/50 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center p-1 border border-sky-500/30 animate-border-pulse">
             {error ? (
                <div className="text-center bg-black/50 p-8 rounded-lg">
                    <ErrorIcon />
                    <p className="font-bold text-lg text-red-500 font-orbitron">Stream Error</p>
                    <p className="max-w-sm text-gray-300 font-semibold">{error}</p>
                </div>
            ) : imageUrl ? (
                <img src={imageUrl} alt="Processed Frame" className="w-full h-full object-contain rounded-md" />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Spinner />
                </div>
            )}
            {!error && stats && (
                 <div className="absolute bottom-4 right-4 bg-black/40 text-white p-3 rounded-lg text-sm shadow-lg backdrop-blur-md border border-sky-400/20 grid grid-cols-3 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                        <FpsIcon />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">FPS</span>
                            <span className="font-orbitron font-bold text-base">{stats.fps.toFixed(1)}</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <ResolutionIcon />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">RESOLUTION</span>
                             <span className="font-orbitron font-bold text-base">{stats.resolution}</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <TimeIcon />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">PROCESS TIME</span>
                            <span className="font-orbitron font-bold text-base">{stats.processingTime}ms</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};