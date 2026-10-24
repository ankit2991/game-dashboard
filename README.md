> **Live Netlify instructions (Patch 14):** See [`PATCH_14_NETLIFY_RENDER_GUIDE.md`](PATCH_14_NETLIFY_RENDER_GUIDE.md). Upload the built `dist/`, not the full integration ZIP.

# Game Dashboard — Frontend (Cumulative Integration Patch 11)

React + TypeScript + Vite. This is the complete cumulative FE: Patch 1 API foundation, Patch 2 player auth, Patch 3 live catalog, Patch 4 browser-safe launch, and Patch 5 verified leaderboard and real B2C profile. Operator registration and approval are connected; Patch 11 adds backend-backed Super Admin overview, analytics snapshot, catalog management and read-only settings. Other inherited Admin pages may still contain prototypes. B2C wallet activity is a read-only view of the operator-scoped sandbox ledger; balances and payments are unavailable until an authoritative wallet API exists.

**Setup:** See [`PATCH_1_INTEGRATION_GUIDE.md`](PATCH_1_INTEGRATION_GUIDE.md).

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Frontend: `http://localhost:5175` · Backend (separate process in sibling `BE/`): `http://localhost:3001`.

The development-only **Dev Persona** panel includes an actual API connection test (health and seven-game catalog), implemented in `src/components/common/DevConnectionStatus.tsx` using `src/lib/api/client.ts` and `src/lib/api/provider.ts`.

Production Vercel builds require `VITE_API_BASE_URL=https://YOUR-RENDER-URL`, and the BE must include the Vercel domain in `CORS_ORIGINS`. Never expose server-side credentials in `VITE_*` variables. Further patches will replace mock auth, games, wallets and dashboards with appropriately authorized data.


## Patch 2: real B2C player login

Set `B2C_AUTH_ENABLED=true` in the Backend environment (MongoDB Atlas M0 FREE is required for Render production). The player forms use the real `/api/v1/auth/*` endpoints. See [PATCH_2_AUTH_GUIDE.md](PATCH_2_AUTH_GUIDE.md). Operator and admin flows remain development UI demonstrations pending later patches.


## Patch 3: live public game catalog

`/` and `/games` now read the seven-game catalog from `GET /api/v1/games`. `/play/:id` shows backend-backed game details, not the old simulated slots. See `PATCH_3_CATALOG_GUIDE.md` in the single combined Patch 3 ZIP.

Run `npm run test:catalog` for the actual backend integration tests. See Patch 4 for the B2C browser-approved launch flow.


## Patch 4: browser game launch

The `/play/:id` page now calls `POST /api/v1/player/launch` and presents a validated, separately hosted launch link. Anonymous demo never uses the player wallet. Provider sandbox is opt-in only, needs real B2C login and a fully configured game backend + sandbox wallet; NO live-money support. See `PATCH_4_LAUNCH_GUIDE.md`.

`npm run test:launch` verifies URL and one-time handoff validation; backend tests cover authorization and ticket exchange.


## Patch 5: verified leaderboard + real player profile

`/leaderboard` fetches pseudonymous, trusted game results from the Backend. `/player/profile` reads and saves the authenticated profile via `GET/PATCH /api/v1/users/me`. Fake tournament rewards, B2C personal ranking, KYC/VIP, wallet balances and transaction history are not presented as facts on those pages. See `PATCH_5_LEADERBOARD_PROFILE_GUIDE.md`.

Run `npm run test:leaderboard` for leaderboard contract tests. Backend integration tests cover profile updates and public leaderboard responses together.


## Patch 6: read-only sandbox wallet & transactions

`/player/wallet` and `/player/transactions` now fetch browser-safe, player-authenticated, operator-scoped ledger data. The backend cannot prove current external wallet balances, so balance is explicitly unavailable and deposit/withdraw UI is disabled rather than simulated. Configure B2C_LAUNCH_PARTNER_ID to enable the scoped history view. See `PATCH_6_SANDBOX_WALLET_GUIDE.md`. Run `npm run test:wallet`.


## Patch 7: real B2B Operator authentication and approvals

`/operator/register` and `/operator/login` call operator-specific backend APIs. Newly registered accounts remain `pending` until a trusted server approves them; no sandbox keys are issued automatically. Operator-only dashboard routes recheck status with the backend; developer operator personas were removed. Configure `B2B_MANAGEMENT_ENABLED`, `B2B_ADMIN_API_KEY`, `B2B_OPERATOR_AUTH_ENABLED`, and production durable MongoDB. See `PATCH_7_OPERATOR_AUTH_GUIDE.md`; run `npm run test:operator`.

## Patch 8 — Operator workspace

The Operator Catalog, My Games and API Credentials screens use authenticated backend data. See [`PATCH_8_OPERATOR_WORKSPACE_GUIDE.md`](PATCH_8_OPERATOR_WORKSPACE_GUIDE.md). These screens do not display Partner secrets. Changes to selected games require trusted administrator synchronization before the actual Partner API permissions change.

## Patch 10 — verified Super Admin and operator approvals

Admin sign-in now requires a real server-side account and server-issued Bearer sessions.
`/admin/operators` reads actual applications and writes approval decisions through the admin
portal API; it cannot create Partner API keys. See `PATCH_10_ADMIN_AUTH_GUIDE.md`.
Run `npm run test:admin`. Other Admin analytics pages remain placeholders pending Patch 11.

## Patch 11 — safe Super Admin overview and configuration

The Admin Dashboard, Analytics, Game Catalog Management, Settings and main Admin Layout no longer claim demo numbers or fictional system alerts. Data are read from three bearer-protected endpoints described in [PATCH_11_ADMIN_INSIGHTS_GUIDE.md](PATCH_11_ADMIN_INSIGHTS_GUIDE.md). Admin game/catalog/settings are read-only and must be changed through server deployment configuration. Verified analytics are point-in-time counts only.

## Patch 12 — Release / FREE-tier deployment

Use [PATCH_12_FINAL_RELEASE_GUIDE.md](PATCH_12_FINAL_RELEASE_GUIDE.md) for local integration, Render Free, Atlas M0 Free, Vercel, environment variables, and the read-only post-deployment smoke. Deep-link refreshes use `vercel.json`; production requires explicit `VITE_API_BASE_URL`. Do not treat a passing mock HTTP integration suite as proof of a live deployed Provider wallet.
