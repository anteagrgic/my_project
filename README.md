# Base architecture 

<TODO Add brief project description>

## Codebase setup checklist

- Copy .env.example, rename to .env and add necessary variables
- Search through files for "TODO" comments
- Initialize Husky with `husky install`
- Add necessary information about the project in this file, such as title, description, technologies used, etc.
- Before development, make sure to read the codebase documentation in `/docs` directory
- If using AWS EB, configure Papertrail logger config `01_papertrail.config` if you intend to use it; otherwise delete the file
- Modify name and description in `package.json`
- Remove this section


## Project stack

- [Node.js](https://nodejs.org/en) runtime environment
- [Typescript](https://www.typescriptlang.org) programming language
- [Nest](https://github.com/nestjs/nest) Node.js framework
- [Docker](https://www.docker.com) for project containerization
- TODO Add

## Getting started

### Installation

```bash
$ npm install
```

### Running the app

Before running the app, make sure to add missing environment variables into .env file

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### Tests

```bash
# Unit tests
$ npm run test

# Integration tests
# Prequisites:
#  - running test database with correct credentials from .env.test
$ npm run test:integration

# E2E tests
# Prequisites:
#  - running test database with correct credentials from .env.test
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Project documentation

Make sure to keep the codebase and the project documentation up to date.
For more detailed codebase documentation, please navigate to `/docs`
