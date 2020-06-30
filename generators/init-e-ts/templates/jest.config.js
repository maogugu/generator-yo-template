module.exports = {
  modulePathIgnorePatterns: ['libs/', 'mock', '__snapshots__'],
  testResultsProcessor: '<rootDir>/node_modules/@ali/dtest-toolbox/lib/service/getTestResult.js',
  testMatch: [
    '<rootDir>/dist/.testFiles/__tests__/**',
    '!**/__snapshots__/**'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/dist/.testFiles/.tea/testFileTemplates/*.{js,axml}',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/dist/test-coverage',
  reporters: ['default']
};
