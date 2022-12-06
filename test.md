# Testing

## Exclusiones del coverage

```
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
```

sonar.coverage.exclusions=src/index.ts, src/app.ts, src/reportWebVitals.ts, src/**/_.test._, src/**/e2e, src/client, src/routers, src/entities, src/repositories/\*_/_.model.ts'
