/* eslint-disable */
require('dotenv').config();

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],
};
