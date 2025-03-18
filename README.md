# 🎬 **Video Diary App**

🚀 **A Simple and Efficient Video Diary App for React Native**

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue) ![Zustand](https://img.shields.io/badge/State%20Management-Zustand-green) ![FFmpegKit](https://img.shields.io/badge/Video%20Processing-FFmpegKit-red) ![Tanstack Query](https://img.shields.io/badge/Async%20Logic-Tanstack%20Query-orange)

---

## 📌 **Introduction**
Video Diary is a **React Native application** that allows users to:
- 🎥 **Import videos** from their device.
- ✂️ **Crop a specific 5-second segment**.
- 📝 **Add a name and description** to the cropped video.
- 📂 **Save and manage** a list of cropped videos with **persistent storage**.

This app is built with **modern best practices** for React Native development, ensuring **performance, scalability, and ease of use**.

---

## 🛠 **Tech Stack**

| Technology            | Purpose |
|----------------------|----------------|
| **Expo & Expo Router** | Base framework & navigation |
| **Zustand**           | State management |
| **AsyncStorage**      | Persistent storage |
| **Tanstack Query**    | Handling async operations & caching |
| **FFmpegKit**        | Video cropping & thumbnail generation |
| **NativeWind**        | Tailwind-based styling for React Native |
| **Expo Video (expo-av)**        | Video rendering & playback |
| **React Hook Form + Zod** | Form validation |
| **React Native Reanimated** | Smooth animations |

---

## 🚀 **Setup & Installation**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/GulaliG/Video-Diary.git
cd Video-Diary
```

### **2️⃣ Install Dependencies**
```sh
yarn install  # or npm install
```

### **3️⃣ Run the Development Server**
For Android:
```sh
expo start --android
```
For iOS (Mac required):
```sh
expo start --ios
```
For Web:
```sh
expo start --web
```

---

## 📱 **App Features**

### 🏠 **1. Home Screen**
✅ Displays a **list of cropped videos** (stored using Zustand & AsyncStorage).
✅ Tap a video to navigate to the **Details Page**.

### 🎞 **2. Video Selection & Cropping**
✅ Select a video from the device.
✅ Uses **FFmpegKit** to crop a **5-second segment**.
✅ Cropping logic is handled in `ffmpegServices.ts`.

### 📝 **3. Add Metadata**
✅ Enter **name & description** for the cropped video.
✅ Tap "Save" to persist it in **AsyncStorage**.
✅ Validation is handled via **Zod + React Hook Form**.

### 📂 **4. Video Details Page**
✅ Displays the **cropped video, name, and description**.
✅ Uses **Expo Video (expo-av)** for video playback.
✅ Users can navigate to the **Edit Page** to modify metadata.

### ✏️ **5. Edit Page**
✅ Allows users to **edit the name & description** of cropped videos.
✅ Updates are **persisted to AsyncStorage**.

### 💾 **6. Persistent Storage & Data Management**
✅ **Zustand** handles **global state**.
✅ **AsyncStorage** ensures **video metadata persistence**.
✅ `useVideoStore.ts` manages **CRUD operations**.

## 📦 **Deployment**

### 🔧 **Building the App**
To generate a **production-ready APK or iOS app**:
```sh
expo build:android  # Android build
expo build:ios  # iOS build
```

### 🚀 **Publishing to Stores**
Follow Expo’s guide to publish to the **App Store & Google Play**:
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Publishing to Google Play](https://docs.expo.dev/submit/android/)
- [Publishing to App Store](https://docs.expo.dev/submit/ios/)

---

## 🏁 **Conclusion**
This document provides a complete **setup and usage guide** for **SevenApps Video Diary App**. The app is designed with **scalability, performance, and usability in mind**, integrating **modern React Native technologies** for an efficient and seamless video management experience.

🔹 **Future Enhancements:**
✅ Use `expo-video` instead of `expo-av`.
✅ Make code more modular. **Currently the clean code ratio is 85-90%.** In future I will split to components.
✅ Implement **SQLite for structured data storage** instead of AsyncStorage.
✅ Use `expo-task-manager` for **background video processing**.

📩 **For questions or contributions, feel free to reach out.**