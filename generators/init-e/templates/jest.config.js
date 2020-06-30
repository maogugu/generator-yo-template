module.exports = {
  modulePathIgnorePatterns: ['libs/', 'mock'],
  testResultsProcessor: '<rootDir>/node_modules/@ali/dtest-toolbox/lib/service/getTestResult.js',
  collectCoverage: true,
  testMatch: ['<rootDir>/.testFiles/__tests__/**', '!**/__snapshots__/**'],
  coverageDirectory: '<rootDir>/test-coverage',
  collectCoverageFrom: [
    '<rootDir>/.testFiles/.tea/testFileTemplates/*.{js,axml}',
    '!**/node_modules/**'
  ],
  reporters: ['default'],
};
