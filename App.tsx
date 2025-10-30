import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { Controls } from './components/Controls';
import { useMockFrameStream } from './hooks/useMockFrameStream';
import { useCameraStream } from './hooks/useCameraStream';
import type { FrameData, ViewMode, StreamSettings, ProcessingEffect } from './types';
import { RAW_IMAGE_URL, PROCESSED_IMAGE_URL } from './constants';

const App: React.FC = () => {
  const [frameData, setFrameData] = useState<FrameData>({
    imageUrl: PROCESSED_IMAGE_URL,
    stats: {
      fps: 0,
      resolution: '1280x720',
      processingTime: 0,
    },
  });
  const [viewMode, setViewMode] = useState<ViewMode>('processed');
  const [processingEffect, setProcessingEffect] = useState<ProcessingEffect>('edge-detection');
  const [isStreamRunning, setIsStreamRunning] = useState<boolean>(false);
  const [isCameraRunning, setIsCameraRunning] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    resolution: '1280x720',
    frameRate: 15,
  });

  const handleNewFrame = useCallback((newFrame: FrameData) => {
    setFrameData(newFrame);
  }, []);

  const { startStream: startMockStream, stopStream: stopMockStream } = useMockFrameStream(handleNewFrame, viewMode, processingEffect, streamSettings);
  const { startStream: startCameraStream, stopStream: stopCameraStream, error: cameraError } = useCameraStream(handleNewFrame, viewMode, processingEffect, streamSettings);

  useEffect(() => {
    setStreamError(cameraError);
    if (cameraError) {
      setIsCameraRunning(false);
    }
  }, [cameraError]);

  const handleSettingsChange = (newSettings: StreamSettings) => {
    setStreamSettings(newSettings);
    if (isStreamRunning) {
        stopMockStream();
        setIsStreamRunning(false);
    }
    if (isCameraRunning) {
        stopCameraStream();
        setIsCameraRunning(false);
    }
  };

  const handleEffectChange = (effect: ProcessingEffect) => {
    setProcessingEffect(effect);
     if (isStreamRunning) {
      stopMockStream();
      startMockStream();
    }
    if (isCameraRunning) {
      // Effect is applied on the fly, no need to restart camera stream
    }
  };


  const handleViewModeToggle = () => {
    setViewMode((prevMode) => {
      const newMode = prevMode === 'raw' ? 'processed' : 'raw';
      if (!isStreamRunning && !isCameraRunning) {
        setFrameData(prev => ({
          ...prev,
          imageUrl: newMode === 'raw' ? RAW_IMAGE_URL : PROCESSED_IMAGE_URL
        }));
      }
      return newMode;
    });
  };

  const handleStreamToggle = () => {
    setStreamError(null);
    if (isStreamRunning) {
      stopMockStream();
      setIsStreamRunning(false);
    } else {
      stopCameraStream();
      setIsCameraRunning(false);
      startMockStream();
      setIsStreamRunning(true);
    }
  };

  const handleCameraToggle = () => {
    setStreamError(null);
    if (isCameraRunning) {
      stopCameraStream();
      setIsCameraRunning(false);
    } else {
      stopMockStream();
      setIsStreamRunning(false);
      startCameraStream();
      setIsCameraRunning(true);
    }
  };

  const handleFileUpload = (file: File) => {
    setStreamError(null);
    stopMockStream();
    setIsStreamRunning(false);
    stopCameraStream();
    setIsCameraRunning(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setFrameData({
        imageUrl,
        stats: {
          fps: 0,
          resolution: 'Custom',
          processingTime: 0,
        },
      });
    };
    // Fix: Corrected typo from `readAsURL` to `readAsDataURL`
    reader.readAsDataURL(file);
  };


  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageViewer frameData={frameData} error={streamError} />
          </div>
          <div>
            <Controls
              viewMode={viewMode}
              processingEffect={processingEffect}
              isStreamRunning={isStreamRunning}
              isCameraRunning={isCameraRunning}
              streamSettings={streamSettings}
              onViewModeToggle={handleViewModeToggle}
              onStreamToggle={handleStreamToggle}
              onCameraToggle={handleCameraToggle}
              onFileUpload={handleFileUpload}
              onSettingsChange={handleSettingsChange}
              onEffectChange={handleEffectChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
