module.exports = {
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src/'],
  modulePaths: ['node_modules', '<rootDir>/src/'],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
  },
  testRegex: '.test.ts$',
  collectCoverage: true,
  coverageDirectory: './coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: '.',
        outputName: './junit/test-sentinel-server/results.xml',
      },
    ],
  ],
  setupFilesAfterEnv: ['./dotenv/test-config'],
};
