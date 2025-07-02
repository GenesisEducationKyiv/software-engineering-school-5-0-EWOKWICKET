# Testing

This document describes how to run integration and end-to-end (E2E) tests using Docker and Docker Compose.

## 🔁 Test Scripts

Run the following npm/yarn scripts to manage your test environment:

### Run Integration Tests

```bash
npm run docker:integration
# or
yarn docker:integration
```

This will:

- Build the test containers
- Run the integration test suite inside the container
- Automatically stop containers after tests complete

### Run E2E Tests

```bash
npm run docker:e2e
# or
yarn docker:e2e
```

This will:

- Build the test containers
- Build all required services
- Execute end-to-end tests in a simulated environment
- Automatically stop containers after tests complete

### Clear Test Containers and Volumes

```bash
npm run docker:test:clear
# or
yarn docker:test:clear
```
