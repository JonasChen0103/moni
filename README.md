# Moni — Personal Finance PWA

<p align="center">
  <img src="public/favicon.svg" width="80" alt="Moni logo" />
</p>

<p align="center">
  Multi-currency personal finance tracker built as an installable PWA with an iOS Cupertino design.
  <br>
  <a href="README.zh-TW.md">繁體中文</a>
</p>

---

## Features

- **Multi-currency with live FX** — Fetches real-time exchange rates, caches for 1 hour, base currency TWD.
- **8 account types** — Credit card (billing day, due day, limit), checking, savings, debit, insurance (premium, frequency, maturity), investment (holdings), cash, prepaid (EasyCard, PX Pay, auto top-up, quick deduct).
- **Taiwan credit-card installments with real APR** — Models real Taiwan installment plans. Calculates APR via IRR using Newton-Raphson, not the naive `fee × 12` method. Example: NT$36,000 / 12 months / NT$3,180 per month → APR ≈ 10.98%.
- **Split bills & debt tracking** — Record who you paid for and how much. Tracks who owes you and who you owe, with per-person net balance summaries and settle/unsettle.
- **Recurring transactions** — Daily, weekly, monthly, or yearly recurrence with optional end date.
- **6–12 month forecast** — Projects net worth including recurring income/expenses, installment payments, and insurance premiums, all converted to TWD.
- **Offline-first PWA** — IndexedDB (Dexie.js) for local persistence, service worker for offline access, installable on any device's home screen.
- **PocketBase sync** — Optional sync to a self-hosted PocketBase instance for multi-device access.
- **Responsive design** — Works on any screen size. iOS Cupertino look and feel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (Cupertino design system) |
| State | Zustand |
| Local DB | Dexie.js (IndexedDB) |
| Charts | Recharts |
| PWA | vite-plugin-pwa (Workbox) |
| Sync | PocketBase JS SDK |
| Tests | Vitest |
| Lint | oxlint |

## Getting Started

```bash
git clone https://github.com/JonasChen0103/moni.git
cd moni
npm install
npm run dev        # http://localhost:5173
npm run test       # run tests
npm run lint       # lint
npm run build      # production build
npm run preview    # preview the build
```

## PocketBase Setup

Moni works fully offline. To enable sync:

1. Download [PocketBase](https://pocketbase.io/) and run it on your PC.
2. Import `pocketbase-schema.json` via the admin UI (Settings → Import collections).
3. Create a user account in the PocketBase admin panel.
4. In Moni, go to **Settings → PocketBase Sync** and enter your server URL and credentials.

## iOS Deployment

For native iOS builds via [Codemagic](https://codemagic.io/):

1. Connect this repo to Codemagic.
2. Use the PWA-to-iOS wrapper workflow (Capacitor or similar).
3. Or simply add the PWA to your home screen — it runs fully offline.

## Project Structure

```
src/
├── components/
│   ├── cupertino/       # iOS-style UI component library
│   ├── AccountForm      # Account add/edit
│   ├── TransactionForm  # Transaction add/edit
│   ├── InstallmentForm / InstallmentDetail
│   ├── RecurringForm
│   ├── DebtForm         # Split bill entry
│   └── DebtSummary      # Who owes whom
├── db/                  # Dexie.js database schema
├── models/              # TypeScript type definitions
├── pages/               # Dashboard, Accounts, Activity, Forecast, Settings
├── services/
│   ├── fx               # FX rate fetching & conversion
│   ├── irr              # APR calculation (Newton-Raphson IRR)
│   ├── forecast         # Net worth projection engine
│   └── pocketbase       # PocketBase sync client
└── stores/              # Zustand state management
```

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a PR

## License

MIT
