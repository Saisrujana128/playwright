# Page Objects (POM)

This folder holds the project's Page Object Model classes used by Playwright tests.

Guiding conventions

- Each page class exposes `Locator` properties for UI elements (defined in the constructor).
  - Example: `this.loginButton = this.page.locator('#LoginButton')`
  - This centralizes selectors in one place and improves maintainability.

- Page classes extend `BasePage` which provides common helpers:
  - `click`, `fill`, `waitForLoad`, `isVisible`, `getText`.
  - `BasePage` sets a default timeout (30s) that page methods use.

- Interaction methods should:
  1. Use `Locator` properties (not raw selector strings) for clarity and type-safety.
  2. Proactively handle transient UI (for example, session expiry dialogs).
     - We provide `ensureSessionActive()` in `ViewerPage` that clicks the `Renew` button when present.
  3. Wait for page load / networkidle after major actions.

Example pattern (LoginPage)

- Define Locators on the class:
  - `readonly loginButton: Locator`
  - `readonly usernameField: Locator`
  - `readonly passwordField: Locator`

- Initialize them in the constructor using `this.page.locator(...)`.

- Use them in methods:
  - `await this.loginButton.click()`
  - `await this.usernameField.fill(username)`

Why this structure

- Centralized selectors: update once, the whole POM uses the new selector.
- Readability: methods read like steps instead of low-level locator calls.
- Robustness: session renewal and other site-specific quirks are handled inside page objects so tests stay clean.

Next steps / how to add a page object

1. Create a new file `page-objects/YourPage.ts`.
2. Import `BasePage` and `Page` from Playwright.
3. Add `Locator` readonly properties for each UI element.
4. Initialize locators in the constructor using `this.page.locator(...)`.
5. Add high-level actions that compose locators and base helpers (click/fill/wait).
6. Add unit tests or run integration tests to validate selectors.

If you'd like, I can:
- Run the full test suite to surface other flaky tests.
- Convert more tests and helpers to the POM style.
- Add linting or types for page objects.

Tell me which you'd like next.