# Contributing & Local Setup
# Contributing to Web Playwright Starter

Thank you for your interest in contributing! This project welcomes all types of contributions—code, documentation, bug reports, feature requests, and more.

---

## 🚦 Getting Started

1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```
4. **Write your code or documentation.**
5. **Add or update tests** as needed (see `tests/login.spec.ts` and `tests/order.spec.ts` for examples based on the SauceDemo app).
6. **Run all tests locally:**
   ```bash
   npm test
   ```
7. **Commit your changes** with a clear message:
   ```bash
   git commit -am "feat: add new login test"
   ```
8. **Push your branch** and open a Pull Request (PR) against the `main` branch.

---

## 🧪 Code Style & Testing

- Follow the existing code style (TypeScript, Playwright best practices, async/await, etc.).
- Use the Page Object Model for UI interactions (see `page-objects/`).
- Place new tests in the `tests/` folder and new page objects in `page-objects/`.
- Use the config structure in `config/` for test data (see `saucedemo.config.ts` for user examples).
- Run `npm test` before submitting to ensure all tests pass.
- If you add a new feature, please add corresponding tests.

---

## 📝 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) for clarity. Examples:

- `feat: add checkout page object`
- `fix: correct login error message assertion`
- `docs: update README with new setup instructions`

---

## 🐞 Reporting Issues & Feature Requests

- For bugs, please include:
  - Steps to reproduce
  - Expected vs. actual behavior
  - Relevant logs or screenshots
- For feature requests, describe the use case and proposed solution.

---

## 🤝 Code Reviews & Merging

- All PRs require at least one approval.
- Address review comments promptly.
- Squash commits if requested.
- Maintainers will merge once checks pass and reviews are complete.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as this project.

---

Thank you for helping make this project better!

# Local Setup & Example

This repository is a starter template for Playwright tests, currently using SauceDemo as the sample application. Follow these steps to get started locally and contribute:

## Local setup
1. Install dependencies and browsers:
   ```bash
   npm install
   npx playwright install
   ```
2. (Optional) Create a local `.env` from `.env.example` and set any required credentials for your environment.
3. Run a single test in headed mode for debugging:
   ```bash
   npm run test:headed
   ```

## Example tests

See `tests/login.spec.ts` and `tests/order.spec.ts` for real-world examples using the SauceDemo app. These demonstrate:
- Logging in as different user types
- Adding products to the cart
- Verifying cart contents
- Completing the checkout process

## Where to add tests
- Add new Playwright tests in `tests/` (e.g., `login.spec.ts`, `order.spec.ts`).
- Add or extend page objects in `page-objects/` (e.g., `login/LoginPage.ts`, `products/ProductsPage.ts`).

## Style & practices
- Keep selectors in page objects (avoid raw selectors in tests).
- Tests should be resilient: use `waitForLoadState('networkidle')` and check for expected UI elements.

## Reporting & debugging
- Screenshots and artifacts are saved to `./test-results/` and the Playwright HTML report is in `./playwright-report/`.

## CI
- If you add CI workflows, ensure credentials are provided via encrypted secrets and do not commit `.env`.
