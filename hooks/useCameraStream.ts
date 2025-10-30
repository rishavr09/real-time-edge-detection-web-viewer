import { useRef, useCallback, useEffect, useState } from 'react';
import type { FrameData, ViewMode, StreamSettings, ProcessingEffect } from '../types';
import { applyGrayscale, applyInvert, applySobelEdgeDetection, applyCannyEdgeDetection } from '../utils/imageProcessing';

export const useCameraStream = (onNewFrame: (frame: FrameData) => void, viewMode: ViewMode, processingEffect: ProcessingEffect, settings: StreamSettings) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);
  const fps = useRef(0);

  const [error, setError] = useState<string | null>(null);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) {
      if(mediaStreamRef.current) {
        animationFrameId.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    
    const startTime = performance.now();

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (viewMode === 'processed') {
      try {
        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        switch (processingEffect) {
          case 'grayscale':
            applyGrayscale(imageData);
            break;
          case 'invert':
            applyInvert(imageData);
            break;
          case 'edge-detection':
            applySobelEdgeDetection(imageData);
            break;
          case 'canny-edge-detection':
            applyCannyEdgeDetection(imageData);
            break;
        }
        context.putImageData(imageData, 0, 0);
      } catch (e) {
        // This can happen with a cross-origin video, but shouldn't with getUserMedia
        console.error("Error processing frame:", e);
      }
    }

    const imageUrl = canvasRef.current.toDataURL('image/jpeg');
    const processingTime = performance.now() - startTime;

    // Calculate FPS
    frameCount.current++;
    const now = performance.now();
    const delta = now - lastFrameTime.current;
    if (delta >= 1000) {
      fps.current = (frameCount.current * 1000) / delta;
      frameCount.current = 0;
      lastFrameTime.current = now;
    }

    const newFrame: FrameData = {
      imageUrl,
      stats: {
        fps: fps.current,
        resolution: `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`,
        processingTime: Math.round(processingTime),
      },
    };
    onNewFrame(newFrame);

    animationFrameId.current = requestAnimationFrame(processFrame);
  }, [onNewFrame, viewMode, processingEffect]);

  const stopStream = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setError(null);
    try {
      const [width, height] = settings.resolution.split('x').map(Number);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: width }, 
          height: { ideal: height },
          frameRate: { ideal: settings.frameRate },
          facingMode: 'user' 
        }
      });
      mediaStreamRef.current = stream;

      videoRef.current = document.createElement('video');
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      const track = stream.getVideoTracks()[0];
      const trackSettings = track.getSettings();

      // Mirror the video if the front camera is being used
      if (trackSettings.facingMode === 'user') {
          videoRef.current.style.transform = 'scaleX(-1)';
      } else {
          videoRef.current.style.transform = 'scaleX(1)';
      }
      
      await videoRef.current.play();

      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      lastFrameTime.current = performance.now();
      frameCount.current = 0;
      animationFrameId.current = requestAnimationFrame(processFrame);

    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
          setError(`Could not satisfy constraints: ${settings.resolution} @ ${settings.frameRate}fps. Your camera may not support this setting.`);
        }
        else {
          setError("Could not access camera. Is it being used by another application?");
        }
      } else {
        setError("An unknown error occurred while accessing the camera.");
      }
    }
  }, [stopStream, processFrame, settings]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return { startStream, stopStream, error };
};
