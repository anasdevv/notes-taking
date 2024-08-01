module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$": "jest-transform-stub",
    "react-markdown":
      "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
