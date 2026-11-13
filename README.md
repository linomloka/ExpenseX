# ExpenseX Expense Tracker

ExpenseX is a responsive React/Vite personal finance dashboard. It includes a right-side desktop navigation panel, mobile drawer, transaction tracking, spending summaries, monthly budgets, savings goals, profile/settings pages, dark and light themes, English/Kiswahili labels, and per-account browser storage.

## Run locally

```sh
npm install
npm run dev
```

The app opens on the registration page. Create an account with your name, email, and a password of at least eight characters. Existing users can choose **Sign in**. Each account gets its own transactions, budgets, goals, theme, language, and currency preferences in this browser.

Authentication and data currently use local browser storage; they are for a single-browser demo and are not a substitute for server-side authentication or secure multi-device storage. Passwords are stored as salted PBKDF2 hashes, not plaintext. Older shared demo data is kept under a separate legacy account (`demo@example.com`, password `password`) when present.

## Routes

- `/overview` — balance summary, cash flow and recent activity
- `/activities` — searchable, filterable transaction history
- `/budgets` — category budget progress
- `/goals` — savings goals
- `/profile` and `/settings` — demo profile and preferences
- `/about`, `/terms`, `/privacy`, and `/contact` — app information, policies, and contact details
- `/signin` and `/signup` — demo authentication screens

Transaction, budget, goal, theme, language, and currency data are stored separately per account in browser local storage. Amounts are kept in USD as the base value and displayed in TZS by default or USD using the currency switch. Conversion is fixed at 1 USD = TZS 2,500 and is not a live exchange rate. The sample data in `src/data/mockData.js` is suitable for replacing with API responses later.

## Checks

```sh
npm run lint
npm run build
```
