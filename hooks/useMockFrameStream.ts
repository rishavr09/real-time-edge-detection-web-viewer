import { useRef, useCallback, useEffect } from 'react';
import type { FrameData, ViewMode, StreamSettings, ProcessingEffect } from '../types';
import { RAW_IMAGE_URL } from '../constants';

export const useMockFrameStream = (onNewFrame: (frame: FrameData) => void, viewMode: ViewMode, processingEffect: ProcessingEffect, settings: StreamSettings) => {
  const intervalRef = useRef<number | null>(null);
  const frameCounterRef = useRef(0);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startStream = useCallback(() => {
    stopStream(); // Ensure no multiple intervals are running

    const intervalDelay = 1000 / settings.frameRate;

    intervalRef.current = window.setInterval(() => {
      frameCounterRef.current += 1;
      
      const [width, height] = settings.resolution.split('x');

      const rawUrl = `https://picsum.photos/seed/raw-${frameCounterRef.current}/${width}/${height}`;
      // Use effect name in seed to get a different "processed" image for each effect
      const processedUrl = `https://picsum.photos/seed/${processingEffect}-${frameCounterRef.current}/${width}/${height}?grayscale`;

      const newFrame: FrameData = {
        imageUrl: viewMode === 'raw' 
          ? rawUrl
          : processedUrl,
        stats: {
          fps: settings.frameRate - (Math.random() * (settings.frameRate * 0.1)), // Simulate FPS close to target
          resolution: settings.resolution,
          processingTime: Math.floor(60 + Math.random() * 15), // Simulate 60-75ms
        },
      };
      onNewFrame(newFrame);
    }, intervalDelay);
  }, [onNewFrame, stopStream, viewMode, settings, processingEffect]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return { startStream, stopStream };
};
