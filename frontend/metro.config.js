const { getDefaultConfig } = require("@expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("cjs");
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
