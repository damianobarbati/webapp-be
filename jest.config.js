/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
