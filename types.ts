export interface FrameStats {
  fps: number;
  resolution: string;
  processingTime: number; // in milliseconds
}

export interface FrameData {
  imageUrl: string;
  stats: FrameStats;
}

export type ViewMode = 'raw' | 'processed';

export type ProcessingEffect = 'edge-detection' | 'grayscale' | 'invert' | 'canny-edge-detection';

export interface StreamSettings {
  resolution: string; // e.g., '1280x720'
  frameRate: number; // e.g., 15
}
