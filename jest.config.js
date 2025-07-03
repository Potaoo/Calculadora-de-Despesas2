module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  maxWorkers: 1,
  testTimeout: 10000
}; 