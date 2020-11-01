module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
      "module:metro-react-native-babel-preset",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@store": "./src/store",
            "@api": "./src/api",
            "@containers": "./src/containers",
            "@components": "./src/components",
          },
        },
      ],
    ],
  };
};
