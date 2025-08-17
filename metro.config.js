// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

// Get Expo's default Metro config
const config = getDefaultConfig(__dirname);

// Disable Metro's package exports resolution (fix for redux-saga & similar libs)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
