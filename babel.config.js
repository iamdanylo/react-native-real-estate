module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          src: './src',
          assets: './src/assets',
        },
      },
    ],
    ['babel-plugin-ts-nameof'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['react-native-reanimated/plugin'],
  ],
};
