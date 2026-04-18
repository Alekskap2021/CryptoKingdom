# CryptoKingdom

Full-stack admin panel for Bybit API v5 trading, built with TanStack Start.

## Tech Stack

- **Framework**: TanStack Start (SSR, file-based routing)
- **UI**: Tailwind CSS v4, Base UI, Lucide icons
- **Data**: TanStack Query + TanStack Table
- **Auth**: Better Auth (email/password + TOTP 2FA)
- **Database**: SQLite via better-sqlite3
- **Charts**: TradingView Lightweight Charts
- **Exchange**: Bybit API v5 (REST + WebSocket)
- **Architecture**: Feature-Sliced Design

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your secrets (BETTER_AUTH_SECRET, APP_ENCRYPTION_KEY)

# Run database migrations
npx auth migrate

# Start development server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
src/
  app/          # App shell, providers, layout, devtools
  pages/        # File-based routes
    auth/       # Login, register (public)
    _protected/ # Auth-guarded layout
      dashboard/  # Overview, orders, chart, history, settings
    api/        # API routes (auth handler)
  shared/       # Infrastructure layer
    api/        # DB, API key CRUD, Bybit client/queries/orders
    auth/       # Better Auth config, client, server functions
    config/     # Env schema, server config
    lib/        # Utilities (cn, crypto)
    ui/         # UI components (Button, Input, Card, DataTable, etc.)
```

## Routes

| Route                            | Access    | Description                                |
| -------------------------------- | --------- | ------------------------------------------ |
| `/auth/login`                    | Public    | Sign in with email/password + 2FA          |
| `/auth/register`                 | Public    | Create account                             |
| `/dashboard`                     | Protected | Overview with KPI cards, positions, orders |
| `/dashboard/orders`              | Protected | Order management with place/cancel         |
| `/dashboard/chart`               | Protected | Candlestick chart with symbol/timeframe    |
| `/dashboard/history`             | Protected | Trade history with CSV export              |
| `/dashboard/settings/profile`    | Protected | Account settings                           |
| `/dashboard/settings/api-keys`   | Protected | Bybit API key management                   |
| `/dashboard/settings/two-factor` | Protected | 2FA setup/management                       |

## Security

- API keys encrypted at rest (AES-256-GCM)
- All Bybit operations execute server-side only
- Session-based auth with cookie cache
- 2FA via TOTP with backup codes

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # ESLint check
npm run format     # Prettier check
```

## Docker

```bash
docker build -t cryptokingdom .
docker run -p 3000:3000 --env-file .env cryptokingdom
```

## Environment Variables

See [`.env.example`](.env.example) for all required and optional variables.
