
# Web Playwright Starter

This project provides a robust, ready-to-use Playwright UI automation framework with a clear structure, custom reporting, and best practices for scalable test automation.

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PGEDigitalCatalyst/web-playwright-starter.git && cd web-playwright-starter
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```
4. **(Optional) Configure credentials:**
  - If your tests require credentials, copy `.env.example` to `.env` and fill in the values, or set environment variables in your shell.

---

## 🧩 Example: SauceDemo Test Flow

This starter uses [SauceDemo](https://www.saucedemo.com/) as a sample application to demonstrate best practices. You can use this as a template for your own web app tests.

**Included Example Flows:**

- Login as different user types (standard, locked_out, etc.)
- Add products to cart
- View and verify cart contents
- Complete the checkout process

**How to explore or extend:**

1. See `tests/login.spec.ts` and `tests/order.spec.ts` for real-world Playwright test examples.
2. Page objects for each feature are in `page-objects/` (e.g., `login/LoginPage.ts`, `products/ProductsPage.ts`, `cart/CartPage.ts`, `checkout/CheckoutPage.ts`).
3. User credentials and config are managed in `config/saucedemo.config.ts`.
4. Run your tests and view the custom and Playwright reports as described above.

You can easily adapt this structure for any web application by updating the page objects and test data.

---

## 🧪 Running Tests

- **Standard run (headed mode by default):**
  ```bash
  npm test
  ```
- **Headless mode:**
  ```bash
  npx playwright test --headed=false
  ```
- **Open Playwright HTML report:**
  ```bash
  npm run test:report
  ```
- **Open custom summary report (tabular):**
  After a test run, open the latest summary in `test-results/`:
  ```bash
  open $(ls -t test-results/test_summary_*.html | head -1)
  ```
  *(On Windows, use `start` instead of `open`; on Linux, use `xdg-open`)*

---

## 📁 Project Structure

- `tests/` — All Playwright test files (e.g., `login.spec.ts`, `order.spec.ts`)
- `page-objects/` — Page Object Model classes for each app page/feature
  - `login/`, `products/`, `cart/`, `checkout/`, etc.
- `core-framework/` — Shared utilities, custom reporters, and helpers
  - `reporters/tabular-reporter.ts` — Custom summary reporter (HTML & console)
- `config/` — Test data and environment config (e.g., user credentials)
- `test-results/` — Artifacts: screenshots, traces, and custom summary HTML
- `playwright-report/` — Playwright's built-in HTML report

---

## 📝 Features

- **Page Object Model:** Clean separation of test logic and UI selectors
- **Custom Tabular Reporter:**
  - Console and HTML summary grouped by feature
  - Email support (configurable in `playwright.config.ts`)
- **Allure & Playwright HTML reporting**
- **Reusable helpers and test reporter**
- **Easy test data/config management**

---

## 🛠️ Helpful Scripts

- `npm test` — Run all tests (headed mode by default)
- `npm run test:headed` — Run tests in headed mode
- `npm run test:report` — Open Playwright HTML report
- `npm run test:with-summary` — Run tests and open the latest custom summary report

---

## 🧩 Adding Tests & Page Objects

1. **Add new test files** to `tests/` (e.g., `tests/checkout.spec.ts`)
2. **Add or update page objects** in `page-objects/` (e.g., `page-objects/checkout/CheckoutPage.ts`)
3. **Use config and test data** from `config/` as needed

---

## 📨 Custom Email Reporting

You can enable email delivery of the custom summary report by editing the `emailReport` section in `playwright.config.ts`:

```js
emailReport: {
  enabled: true,
  recipients: ["your@email.com"],
  smtpConfig: { /* ... */ }
}
```

---

## 🧑‍💻 Contributing & Support

- See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines.
- For selector/debugging issues, run tests in headed mode and use screenshots/traces in `test-results/`.

---

## 🛡️ Troubleshooting

**Chrome private network permission popup:**

If you see a Chrome permission bubble ("Look for and connect to any device on your local network"), disable the local network access check in Chrome for development:

1. Open Chrome used by Playwright.
2. Go to: `chrome://flags/#local-network-access-check`
3. Set to "Disabled" and relaunch Chrome.

---


---

## 📬 Contact

For setup help, issues, or questions about this project, please contact:

**Owner:** Suresh Kumar Kandiah  
**Email:** s0k5@pge.com

---

## 📄 License

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for license and local run instructions.

