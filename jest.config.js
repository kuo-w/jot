module.exports = {
  silent: true,
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleNameMapper: {
    "@api/(.*)": ["<rootDir>/src/api/$1"],
    "@store/(.*)": ["<rootDir>/src/store/$1"],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo-google-app-auth" +
      "|expo-constants" +
      "|expo-app-auth" +
      "|@unimodules" +
      "|react-native" +
      "|react-navigation-tabs" +
      "|react-native-splash-screen" +
      "|react-native-screens" +
      "|react-native-reanimated" +
      ")/)",
  ],
};
