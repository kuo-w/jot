module.exports = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testEnvironment: "node",
  preset: "ts-jest/presets/js-with-ts",
  modulePaths: [
    // Add your paths here
    "<rootDir>/src/",
  ],
};
