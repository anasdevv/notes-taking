module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'jest-transform-stub',
    'react-markdown':
      '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  reporters: [
    'default', // Default reporter (displays output in the console)
    [
      'jest-junit', // Use the jest-junit reporter to generate an XML file
      {
        addFileAttribute: 'true',
        ancestorSeparator: ' › ',
        classNameTemplate: '{classname}',
        titleTemplate: 'test-results.xml', // Name of the XML file
      },
    ],
  ],
};
