# 🌐 Android-CV-GL-Debug-Viewer-Clean  
### Real-Time Edge Detection Viewer  
> **Powered by OpenCV + OpenGL ES 2.0 + TypeScript**

---

## 📸 Project Overview  
**Android-CV-GL-Debug-Viewer-Clean** is a real-time vision debugging tool that integrates **Android Camera**, **C++ (OpenCV)**, and **OpenGL ES 2.0** rendering.  
It enables developers to visualize and debug live computer vision (CV) pipelines efficiently.  

The app captures live frames from an Android device, processes them natively (e.g., grayscale, edge detection, invert filters) using **OpenCV**, and renders the processed output with **OpenGL ES** in real-time (~15–30 FPS).  
A complementary **TypeScript Web Viewer** provides an interactive display for processed frames and system metrics.

---

## 🧩 Features  
- 🎥 **Live Camera Capture** using Android TextureView / SurfaceTexture  
- ⚙️ **Native Processing (JNI + C++)** with OpenCV for:  
  - Grayscale Conversion  
  - Canny Edge Detection  
  - Invert / Sepia Filters  
- 🧠 **OpenGL ES 2.0 Rendering** for fast frame display  
- 🌐 **TypeScript Web Viewer** for futuristic frame visualization  
- 🧱 **Modular Architecture:**  
  - `/app` → Android (Java/Kotlin) + Camera Integration  
  - `/jni` → C++ + OpenCV Native Code  
  - `/gl` → OpenGL ES Renderer Modules  
  - `/web` → TypeScript Viewer  
- ⚡ Optimized for 10–30 FPS real-time rendering  
- 🧩 Clean dark UI with neon accents for better visualization  

---


## 🛠️ Tech Stack  

| Layer | Technology |
|:------|:------------|
| **Frontend (Web)** | TypeScript · HTML · TailwindCSS |
| **Android App** | Java/Kotlin · Camera API · JNI |
| **Native Layer** | C++ · OpenCV SDK · CMake |
| **Rendering Engine** | OpenGL ES 2.0 (Fragment + Vertex Shaders) |
| **Version Control** | Git · GitHub |

---

## ⚙️ Getting Started  

### 🔹 Prerequisites  
- Android Studio with **NDK** and **CMake** installed  
- A device (or emulator) running Android 7.0 (API 24)+  
- **Node.js** (v16 or higher) for building the web viewer  

