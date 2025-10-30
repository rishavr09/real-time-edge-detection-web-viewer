import React, { useRef } from 'react';
import type { ViewMode, StreamSettings, ProcessingEffect } from '../types';

interface ControlsProps {
    viewMode: ViewMode;
    processingEffect: ProcessingEffect;
    isStreamRunning: boolean;
    isCameraRunning: boolean;
    streamSettings: StreamSettings;
    onViewModeToggle: () => void;
    onStreamToggle: () => void;
    onCameraToggle: () => void;
    onFileUpload: (file: File) => void;
    onSettingsChange: (settings: StreamSettings) => void;
    onEffectChange: (effect: ProcessingEffect) => void;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface border border-sky-400/10 rounded-lg p-4 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-sky-400/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]">
        <h3 className="font-orbitron text-lg font-bold text-sky-400 mb-4 border-b border-slate-700 pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; labels: [string, string] }> = ({ checked, onChange, labels }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400 w-16 text-right">{labels[0]}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
            <span className="text-sm font-medium text-gray-300 w-24">{labels[1]}</span>
        </div>
    );
};

const StreamIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C3.732 4.943 10 3.5 10 3.5s6.268 1.443 9.542 6.5c-3.274 5.057-9.542 6.5-9.542 6.5S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm10.5 4.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" clipRule="evenodd" />
    </svg>
);


const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const Controls: React.FC<ControlsProps> = ({ 
    viewMode, 
    processingEffect,
    isStreamRunning, 
    isCameraRunning, 
    streamSettings,
    onViewModeToggle, 
    onStreamToggle, 
    onCameraToggle, 
    onFileUpload,
    onSettingsChange,
    onEffectChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSettingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        onSettingsChange({
            ...streamSettings,
            [name]: name === 'frameRate' ? parseInt(value, 10) : value,
        });
    };

    const handleEffectSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onEffectChange(event.target.value as ProcessingEffect);
    };
    
    const effectLabels: Record<ProcessingEffect, string> = {
      'edge-detection': 'Sobel Edge',
      'canny-edge-detection': 'Canny Edge',
      'grayscale': 'Grayscale',
      'invert': 'Inverted Colors',
    };

    return (
        <div className="space-y-6">
            <ControlSection title="Stream Source">
                <p className="text-xs text-gray-400 text-center -mt-2">Choose a live data source for the viewer.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={onStreamToggle}
                        className={`btn ${isStreamRunning ? 'btn-danger' : 'btn-primary'} flex-col`}
                    >
                        <StreamIcon />
                        {isStreamRunning ? 'Stop Mock' : 'Start Mock'}
                    </button>
                    <button
                        onClick={onCameraToggle}
                        className={`btn ${isCameraRunning ? 'btn-danger' : 'btn-primary'} flex-col`}
                    >
                        <CameraIcon />
                        {isCameraRunning ? 'Stop Camera' : 'Start Camera'}
                    </button>
                </div>
            </ControlSection>

            <ControlSection title="View Options">
                <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Output View</span>
                     <ToggleSwitch
                        checked={viewMode === 'processed'}
                        onChange={onViewModeToggle}
                        labels={['Raw', 'Processed']}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="effect" className={`block text-sm font-medium text-gray-300 transition-opacity ${viewMode === 'raw' && 'opacity-50'}`}>Processing Effect</label>
                    <div className="relative">
                        <select 
                            id="effect" 
                            name="effect" 
                            value={processingEffect}
                            onChange={handleEffectSelectChange}
                            disabled={viewMode === 'raw'}
                            className="block w-full bg-slate-800/60 border border-slate-700 text-white rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-2.5 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="edge-detection">Sobel Edge Detection</option>
                            <option value="canny-edge-detection">Canny Edge Detection</option>
                            <option value="grayscale">Grayscale</option>
                            <option value="invert">Invert Colors</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="resolution" className="block text-sm font-medium text-gray-300">Resolution</label>
                    <div className="relative">
                        <select 
                            id="resolution" 
                            name="resolution" 
                            value={streamSettings.resolution}
                            onChange={handleSettingChange}
                            className="block w-full bg-slate-800/60 border border-slate-700 text-white rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-2.5 appearance-none"
                        >
                            <option value="1920x1080">1920x1080 (1080p)</option>
                            <option value="1280x720">1280x720 (720p)</option>
                            <option value="640x480">640x480 (480p)</option>
                            <option value="320x240">320x240 (240p)</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="frameRate" className="block text-sm font-medium text-gray-300">Frame Rate</label>
                    <div className="relative">
                         <select 
                            id="frameRate" 
                            name="frameRate" 
                            value={streamSettings.frameRate}
                            onChange={handleSettingChange}
                            className="block w-full bg-slate-800/60 border border-slate-700 text-white rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-2.5 appearance-none"
                        >
                            <option value="30">30 FPS</option>
                            <option value="24">24 FPS</option>
                            <option value="15">15 FPS</option>
                        </select>
                        <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <p className="text-xs text-gray-400 text-center">Stream must be restarted for quality changes to take effect.</p>
            </ControlSection>

            <ControlSection title="Static Image">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    onClick={handleUploadClick}
                    className="btn btn-secondary"
                >
                    <UploadIcon />
                    Upload a Frame
                </button>
                <p className="text-xs text-gray-400 text-center -mt-2">Analyze a single, pre-processed image file.</p>
            </ControlSection>
        </div>
    );
};