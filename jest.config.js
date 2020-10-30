module.exports = {
  preset: "react-native",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src/"],
  transform: { "\\.ts$": ["ts-jest"] },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
