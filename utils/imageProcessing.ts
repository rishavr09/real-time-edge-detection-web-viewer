export const applyGrayscale = (imageData: ImageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Using luminosity-preserving weights for better visual results
    const luma = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = luma; // red
    data[i + 1] = luma; // green
    data[i + 2] = luma; // blue
  }
};

export const applyInvert = (imageData: ImageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];     // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
};

export const applySobelEdgeDetection = (imageData: ImageData) => {
    const { data, width, height } = imageData;
    const grayscaleData = new Uint8ClampedArray(width * height);

    // 1. Create a grayscale copy of the image
    for (let i = 0, g = 0; i < data.length; i += 4, g++) {
        const luma = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        grayscaleData[g] = luma;
    }

    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    // 2. Apply Sobel operator
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let gx = 0;
            let gy = 0;

            // Apply 3x3 kernel
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const ix = x + kx;
                    const iy = y + ky;
                    if (ix >= 0 && ix < width && iy >= 0 && iy < height) {
                        const pixelVal = grayscaleData[iy * width + ix];
                        gx += pixelVal * sobelX[ky + 1][kx + 1];
                        gy += pixelVal * sobelY[ky + 1][kx + 1];
                    }
                }
            }
            
            const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
            const index = (y * width + x) * 4;
            data[index] = magnitude;     // red
            data[index + 1] = magnitude; // green
            data[index + 2] = magnitude; // blue
        }
    }
};

export const applyCannyEdgeDetection = (imageData: ImageData) => {
    const { data, width, height } = imageData;
    const lowThreshold = 20;
    const highThreshold = 50;

    // 1. Grayscale
    const grayscaleData = new Uint8ClampedArray(width * height);
    for (let i = 0, g = 0; i < data.length; i += 4, g++) {
        const luma = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        grayscaleData[g] = luma;
    }

    // 2. Gaussian Blur (5x5 kernel)
    const blurredData = new Uint8ClampedArray(width * height);
    const kernel = [
        [2, 4, 5, 4, 2],
        [4, 9, 12, 9, 4],
        [5, 12, 15, 12, 5],
        [4, 9, 12, 9, 4],
        [2, 4, 5, 4, 2],
    ];
    const kernelSum = 159;
    const kernelRadius = 2;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;
            for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
                for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                    const ix = Math.min(width - 1, Math.max(0, x + kx));
                    const iy = Math.min(height - 1, Math.max(0, y + ky));
                    sum += grayscaleData[iy * width + ix] * kernel[ky + kernelRadius][kx + kernelRadius];
                }
            }
            blurredData[y * width + x] = sum / kernelSum;
        }
    }
    
    // 3. Sobel Operator (Gradient calculation)
    const magnitudes = new Float32Array(width * height);
    const directions = new Float32Array(width * height);
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0;
            let gy = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelVal = blurredData[(y + ky) * width + (x + kx)];
                    gx += pixelVal * sobelX[ky + 1][kx + 1];
                    gy += pixelVal * sobelY[ky + 1][kx + 1];
                }
            }
            const index = y * width + x;
            magnitudes[index] = Math.sqrt(gx * gx + gy * gy);
            directions[index] = Math.atan2(gy, gx);
        }
    }

    // 4. Non-maximum suppression
    const suppressedData = new Float32Array(width * height);
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = y * width + x;
            const angle = directions[index] * (180 / Math.PI);
            const mag = magnitudes[index];
            let q = 255;
            let r = 255;

            if ((0 <= angle && angle < 22.5) || (157.5 <= angle && angle <= 180) || (-22.5 <= angle && angle < 0) || (-180 <= angle && angle < -157.5)) {
                q = magnitudes[index + 1]; r = magnitudes[index - 1];
            } else if ((22.5 <= angle && angle < 67.5) || (-157.5 <= angle && angle < -112.5)) {
                q = magnitudes[index - width + 1]; r = magnitudes[index + width - 1];
            } else if ((67.5 <= angle && angle < 112.5) || (-112.5 <= angle && angle < -67.5)) {
                q = magnitudes[index - width]; r = magnitudes[index + width];
            } else if ((112.5 <= angle && angle < 157.5) || (-67.5 <= angle && angle < -22.5)) {
                q = magnitudes[index - width - 1]; r = magnitudes[index + width + 1];
            }

            suppressedData[index] = (mag >= q && mag >= r) ? mag : 0;
        }
    }
    
    // 5. Double thresholding and Hysteresis
    const finalData = new Uint8ClampedArray(width * height);
    const STRONG = 255;
    const WEAK = 75;

    for (let i = 0; i < suppressedData.length; i++) {
        const mag = suppressedData[i];
        if (mag >= highThreshold) finalData[i] = STRONG;
        else if (mag >= lowThreshold) finalData[i] = WEAK;
    }

    const hysteresis = (x: number, y: number) => {
        const index = y * width + x;
        if (x < 0 || x >= width || y < 0 || y >= height || finalData[index] !== WEAK) return;

        finalData[index] = STRONG;
        for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
                if (ky === 0 && kx === 0) continue;
                hysteresis(x + kx, y + ky);
            }
        }
    };

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (finalData[y * width + x] === STRONG) {
                hysteresis(x, y);
            }
        }
    }

    // 6. Final rendering
    for (let i = 0; i < data.length; i += 4) {
        const gIndex = i / 4;
        const value = (finalData[gIndex] === STRONG) ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
    }
};
