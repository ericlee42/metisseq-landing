# Metis Sequencer Mining

Use Node.js 24.15 or newer within the 24.x release line, or Node.js 26 or newer, and npm 11 or newer. Dependencies are locked in `package-lock.json`; CI installs with `npm ci`.

```sh
npm ci
npm run start           # development
npm run start:prod      # development server with production configuration
npm run check           # TypeScript, Oxlint, Oxfmt check, and regression tests
npm run lint:fix        # safe Oxlint fixes
npm run format          # format source, CSS, configuration and documentation
npm run build:qa        # QA build, using .env.test
npm run build           # production build
npm run preview
```

## Tooling

- React 19, wagmi 3 and viem 2 handle UI and wallet access. Jotai stores shared application state; TanStack Query supports wagmi queries.
- Chain integers and transaction values use `bigint`. Amount entry rejects nonzero fractions smaller than one wei instead of rounding.
- Oxlint replaces the previous ESLint configuration, retaining supported semantic rules and enabling correctness checks. React Compiler readiness diagnostics are advisory because this project does not enable React Compiler. TypeScript 7 (`tsc --noEmit`) provides type checking.
- Oxfmt preserves the previous 120-column, two-space, single-quote formatting policy. CSS formatting is included; the previous Stylelint-specific CSS semantic rules are not part of Oxlint.
- Stylesheets are plain CSS. Shared layout, spacing and typography helpers live in `src/assets/styles/utilities.css` and are edited directly; no Sass, utility CSS generator, or custom PostCSS configuration is required. Vite handles CSS processing without Autoprefixer.
- Regression tests use simulated wallets and RPC clients. They never submit real chain transactions.

## Configuration

`.env.development`, `.env.test`, and `.env.production` select L1 token/lock addresses, L2 chain IDs, RPC endpoints, sequencer contracts and the sequencer metadata base URL.

`src/configs/common.ts` defines contract ABIs, explorer URLs, the default chain, and the L2 client. `src/configs/wallet.ts` defines allowed L1 networks, the injected wallet connector, and transaction receipt clients. L2 polling runs every 60 seconds; subscriptions and pending responses are invalidated when switching networks or unmounting.

`useUpdate()` reads account data. `useSequencerInfo()` reads contract state and sequencer metadata. `allSequencerInfo` comes from the configured metadata endpoint; `sequencerInfo` comes from the contracts.

Wallet reconnection is managed by wagmi. Existing sessions from the previous wallet implementation may require connecting once after upgrading.

## Deployment

The existing `deploy` branch workflow installs with npm, runs checks and both build modes, then deploys the production `dist` to the existing S3 target. Local checks do not prove remote CI, deployment, or live wallet transaction behavior.
