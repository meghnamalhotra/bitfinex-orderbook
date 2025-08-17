# 📊 Bitfinex Order Book (React Native + Expo)

A **real-time cryptocurrency order book viewer** built with **React Native (Expo SDK 53)**.  
The app streams live **bids** and **asks** from the **Bitfinex API** and displays them with  
**depth visualization**, precision controls, and smooth rendering.

---

## 🚀 Tech Stack

This project is built using the following technologies:

- **[React Native (Expo SDK 53)](https://docs.expo.dev/)** – Cross-platform mobile framework for iOS & Android.
- **[Redux](https://redux.js.org/)** – State management to handle order book data consistently.
- **[Redux-Saga](https://redux-saga.js.org/)** – Middleware for managing async tasks like WebSocket connections.
- **[Axios](https://axios-http.com/)** – For fetching initial order book snapshot from Bitfinex REST API.
- **[Lucide-react-native](https://lucide.dev/)** – Icon library (used for precision `+` / `-` controls).
- **FlatList (React Native)** – Optimized list rendering for smooth performance with large data sets.
- **React.memo & useTransition** – Performance optimization for real-time UI updates.

---

## 📡 Features

- **Live Data** – Streams bids & asks directly from Bitfinex via WebSockets.  
- **Precision Controls** – Adjust price grouping dynamically (`P0 → P1 → P2 → P3 → R0`).  
- **Depth Visualization** – Green (bids) and Red (asks) bars scale by amount, giving a quick overview of market depth.  
- **Optimized Rendering** – `FlatList`, `React.memo`, `useTransition` minimize re-renders for smooth scrolling.  
- **Responsive Layout** – Works seamlessly on both Android and iOS devices.  

---

## ⚙️ Installation & Setup

1. **Create a new Expo project** (or clone this repo):

   ```bash
   npx create-expo-app bitfinex-orderbook --template blank
   cd bitfinex-orderbook

**Install dependencies:**

npm install axios redux react-redux redux-saga lucide-react-native
Fix Expo SDK 53 Metro bundler issue by editing metro.config.js:

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
Run the app:

npx expo start

**Usage**

Open the Order Book screen.

Tap plus(+) or minus(➖) signs to change price precision.

Green (bids) and Red (asks) columns update in real-time.

Depth bars show relative market liquidity.

**Performance Optimizations**

Redux-Saga handles streaming efficiently.

FlatList with getItemLayout improves scroll performance.

React.memo prevents re-render of unchanged rows.

useTransition makes precision updates smoother.

**Reference**

Bitfinex API Docs
Expo Documentation
Redux-Saga Guide

