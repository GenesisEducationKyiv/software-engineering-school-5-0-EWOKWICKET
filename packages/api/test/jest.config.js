module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ['**/*.spec.(t|j)s'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
