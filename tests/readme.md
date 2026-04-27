# Playwright Tests - CRUD Library Application

## About These Tests

This test suite provides comprehensive coverage of the CRUD Library Application through automated testing using Playwright with JavaScript. The tests are designed to validate both the API layer and the graphical user interface (GUI), ensuring that all core functionalities work correctly across different scenarios. The tests are organized into two main categories: API tests that specifically validate endpoints and backend logic, and GUI tests that verify user interactions on the frontend using the Page Object Model (POM) pattern.

## Table of Contents

- [Start the server](#start-the-server)
- [Run Playwright tests](#run-playwright-tests)
- [Test structure](#test-structure)
- [Support structure](#support-structure)
- [Additional Information](#additional-information)
- [Summary](#summary)

## Start the server

1. Open a terminal in the project root.
2. Run:

   ```bash
   npm install
   npm run start
   ```

3. The server should be available at `http://localhost:3000` or as configured in `server.js`.

## Run Playwright tests

Open another terminal in the project folder and run the commands below.

### Headless mode

```bash
npx playwright test
```

### Headed mode (visible browser)

```bash
npx playwright test --headed
```

### UI mode

```bash
npx playwright test --ui
```

> Make sure the server is running before executing API and frontend tests.

## Test structure

The `tests` folder contains two main groups:

- `api/` - API tests for books, favorites, login, registration, and statistics, grouped by endpoint.
- `frontend/` - GUI tests using the Page Object Model (POM) structure.

### `api/`

The test files (spec) in this folder verify the application API:

- `libraryAPITests_Books.spec.js`
- `libraryAPITests_Favorites.spec.js`
- `libraryAPITests_Login.spec.js`
- `libraryAPITests_Registration.spec.js`
- `libraryAPITests_Statistics.spec.js`

### `frontend/`

The frontend tests use POM and focus on application graphical user flows and are included in the following test files (spec):

- `libraryFETests_DashboardFeatures.spec.js`
- `libraryFETests_LibraryBooksFeatures.spec.js`
- `libraryFETests_Login.spec.js`
- `libraryFETests_Logout.spec.js`
- `libraryFETests_NewBooksAddition.spec.js`
- `libraryFETests_PagesSecurity.spec.js`
- `libraryFETests_Registration.spec.js`

## Support structure

The `tests/resources` folder includes utilities and page objects:

- `common/`
  - `localStorageDataManagement.js` - local storage data management.
  - `pageEventHandling.js` - common page event handling.
  - `testDataCreation.js` - test data creation.
- `pom/`
  - `BookDetailsPage.js`
  - `DashboardPage.js`
  - `FavoritesPage.js`
  - `LoginPage.js`
  - `ManageBooksPage.js`
  - `RegistrationPage.js`

## Additional Information

`Hands.pdf` file has the application requirements used as base for the tests definition.

## Summary

- Start the server before running API and frontend tests.
- Use `npx playwright test --headed` for visual debugging.
- Use `npx playwright test --ui` to explore and run tests interactively.
- Use only `npx playwright test` for running headless.
- Validate API endpoints and backend functionalities with files in `tests/api`.
- Validate GUI flows with files in `tests/frontend`.
- Refer to `Hands.pdf` for application requirements and test coverage details.
