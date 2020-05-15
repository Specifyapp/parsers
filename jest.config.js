module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    collectCoverageFrom: ['parsers/**/*.ts', '!parsers/**/*.spec.ts'],
    collectCoverage: true,
    coverageReporters: ['lcov'],
    'ts-jest': {},
  },
};
