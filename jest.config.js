/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    resolver: 'jest-ts-webcompat-resolver',
    //collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: [
        'index.ts',
        'app.ts',
        'e2e',
        'client',
        'routers',
        'entities',
        'repositories/user.model.ts',
        'repositories/robot.model.ts',
    ],
};
