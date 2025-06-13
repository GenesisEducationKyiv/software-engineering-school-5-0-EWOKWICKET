module.exports = {
  ...require('../jest.config'),
  rootDir: '../',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
