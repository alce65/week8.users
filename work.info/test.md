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

## Remote testing (Github action for SonarCloud)

### Valores en .env

Ignorados en .gitignore

USER=<`Mongo DB user`>
PASSWD=<`Mongo DB user`>
CLUSTER=<`Mongo DB cluster`>
SECRET=<`JWT Token generation`>

### Secrets en GitHub

### Acceso a los secrets en GitHub Actions

```yml
    -name: Testing coverage
        run: npm run test:prod #Change for a valid npm script
        env:
          USER: ${{ secrets.USER }}
          PASSWORD: ${{ secrets.PASSWORD }}
          CLUSTER: ${{ secrets.CLUSTER }}
          SECRET: ${{ secrets.SECRET }}
```
