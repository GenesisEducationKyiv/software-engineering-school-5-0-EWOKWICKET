module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
    '^test/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
