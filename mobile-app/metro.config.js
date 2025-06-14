const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  server: {
    port: 8083
  },
  watchFolders: [__dirname],
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json']
  },
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles']
  }
}; 