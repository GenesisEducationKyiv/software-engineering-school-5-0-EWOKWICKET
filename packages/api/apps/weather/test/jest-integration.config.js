const path = require('path');

module.exports = {
  ...require('../../../test/jest.config'),
  rootDir: path.join(__dirname, '..'),
  testMatch: ['**/*.integration.spec.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    '^@common/(.*)$': '<rootDir>/../../libs/common/src/$1',
    '^@logger/(.*)$': '<rootDir>/../../libs/logger/src/$1',
    '^@metrics/(.*)$': '<rootDir>/../../libs/metrics/src/$1',
  },
};
