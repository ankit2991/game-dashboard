# NEXUS | Unified Game Provider SaaS Platform
## Production-Grade Frontend Prototype & Architecture Blueprint

### 1. Executive Summary & Overview
The **NEXUS Platform** is a unified Game Provider SaaS and player gaming ecosystem designed with modern luxury aesthetics, vibrant cyber-gaming palettes (`#0B1020`, `#121A2D`, `#7C5CFC`, `#00D4FF`), glassmorphism, and responsive layouts. 

The architecture unifies three primary portals connected via an instant **1-Click Portal Switcher**:
1. **B2C Gaming Portal (Player Hub)**: High-roller gaming website inspired by winmyr.asia, complete with animated slot reels, live lobby filters, player cashier/wallet, tournament leaderboards, and profile management.
2. **B2B Operator Portal**: Self-service enterprise portal for gaming brands and aggregators to browse game catalogs, provision HMAC-SHA256 API credentials, inspect real-time GGR telemetry, configure webhook endpoints, and view interactive API & SDK documentation.
3. **Super Admin Dashboard**: Central mission control for platform owners to oversee 284K+ players, approve B2B operator KYC applications, audit GGR/NGR financials, monitor live game engine clusters, and rotate master API keys.

---

### 2. Architecture & Design Principles

#### A. Fixed Non-Scrolling Sidebars
Across both the **Super Admin Layout** (`src/layouts/AdminLayout.tsx`) and the **B2B Operator Layout** (`src/layouts/OperatorLayout.tsx`), sidebars are pinned:
- Container: `h-screen overflow-hidden flex flex-col`
- Desktop Sidebar: `h-full flex-shrink-0 select-none overflow-hidden`
- Internal Nav: `flex-1 overflow-y-auto`
- Main Content Stage: `flex-1 h-full overflow-y-auto`

#### B. Symmetrical Full-Width Header
The B2C gaming header (`src/layouts/B2CLayout.tsx`) features:
- **Full-Width Horizon**: `w-full px-4 sm:px-6 lg:px-8`
- **Segmented Navigation Ribbon**: Integrated pill tabs with active gradients.
- **Docked Wallet & Deposit Capsule**: Unified container housing player balance (`MYR 8,420.50`) and glowing `+ Deposit` button.
- **Search & Quick Command Bar**: Sleek input with `⌘K` keyboard badge.
- **Player Avatar Status**: Real-time online indicator and VIP tier label (`VIP 4`).

---

### 3. Complete Portal & Route Directory

#### I. B2C Gaming Hub (Player Portal)
| Route | Page Component | Features & Interactive Demonstrations |
| :--- | :--- | :--- |
| `/` | `src/modules/b2c/pages/B2CHomepage.tsx` | Hero banner slider, Progressive Mega Jackpot ticker ($4.8M), game provider logos, live winner ticker. |
| `/games` | `src/modules/b2c/pages/B2CGamesLobby.tsx` | Category tabs (Slots, Crash, Live Casino, Card), provider dropdown, instant search filter, grid display. |
| `/play/:id` | `src/modules/b2c/pages/B2CGamePlayer.tsx` | Simulated 5-reel slot engine, spin animation, win multiplier popups, audio/fullscreen toggles, bet controls. |
| `/promotions` | `src/modules/b2c/pages/B2CPromotions.tsx` | 100% Welcome Bonus, Daily Cashback, VIP Reloads, claim bonus modal with demo promo codes. |
| `/leaderboard` | `src/modules/b2c/pages/B2CLeaderboard.tsx` | Top 3 podium standings ($15,000 cash prizes), real-time ranked list, personal rank badge (`#14`). |
| `/login`, `/register` | `src/modules/b2c/pages/B2CAuth.tsx` | Player authentication with social login simulations, 1-click demo player quick fill. |

#### II. Dedicated Player Account Dashboard
| Route | Page Component | Features & Interactive Demonstrations |
| :--- | :--- | :--- |
| `/player/profile` | `src/modules/b2c/pages/PlayerOverview.tsx` | VIP Platinum 4 progression bar, KYC certified badge, profile details editor modal, quick favorite launches. |
| `/player/wallet` | `src/modules/b2c/pages/PlayerWallet.tsx` | Instant deposit simulation (MYR 100, 250, 500, 1000), payment methods (FPX, USDT, Cards, GrabPay), payout request. |
| `/player/transactions` | `src/modules/b2c/pages/PlayerTransactions.tsx` | Detailed bet and spin ledger, win/loss status badges, filter by transaction type, receipt modal. |

#### III. B2B Operator Portal
| Route | Page Component | Features & Interactive Demonstrations |
| :--- | :--- | :--- |
| `/operator` | `src/modules/operator/pages/OperatorLanding.tsx` | Enterprise landing page with API feature grid, integration workflow, live sandbox CTA. |
| `/operator/login` | `src/modules/operator/pages/OperatorAuth.tsx` | Corporate authentication with 1-click test company autofill (`Asia Gaming Network Ltd`). |
| `/operator/dashboard` | `src/modules/operator/pages/OperatorDashboard.tsx` | Real-time GGR charts, active players gauge, API volume telemetry, Sandbox/Production switcher. |
| `/operator/catalog` | `src/modules/operator/pages/OperatorCatalog.tsx` | 700+ game marketplace, instant 1-click game activation/deactivation toggle, provider breakdown. |
| `/operator/my-games` | `src/modules/operator/pages/OperatorMyGames.tsx` | Active integration inventory, custom operator RTP override controls, launch URL generators. |
| `/operator/credentials` | `src/modules/operator/pages/OperatorCredentials.tsx` | Client ID / Secret generation, secret masking, key rotation modal, IP allowlist manager. |
| `/operator/docs` | `src/modules/operator/pages/OperatorDocs.tsx` | Complete API docs with code syntax highlighting (cURL, Node.js, PHP, Python) for game sessions, debit/credit wallets. |
| `/operator/logs` | `src/modules/operator/pages/OperatorLogs.tsx` | Live HTTP/WebSocket request stream, response payload inspector, status code filters (200, 400, 500). |
| `/operator/webhooks` | `src/modules/operator/pages/OperatorWebhooks.tsx` | Webhook endpoint registration, HMAC signing secret, instant ping test simulation. |
| `/operator/transactions` | `src/modules/operator/pages/OperatorTransactions.tsx` | Operator-level transaction logs, revenue share calculations, exportable statements. |
| `/operator/team` | `src/modules/operator/pages/OperatorTeam.tsx` | Role-based team access (Owner, Admin, Developer, Auditor) with invite member modal. |

#### IV. Super Admin Mission Control
| Route | Page Component | Features & Interactive Demonstrations |
| :--- | :--- | :--- |
| `/admin/login` | `src/modules/admin/pages/AdminLogin.tsx` | Master admin access with role quick-fill buttons and simulated 2FA token verification. |
| `/admin` | `src/modules/admin/pages/AdminDashboard.tsx` | 12 high-level KPI cards, live revenue charts, pending operator KYC review drawer, system health. |
| `/admin/users` | `src/modules/admin/pages/UserManagement.tsx` | 284K player database, balance adjustment modal, account lock/unlock, KYC document preview. |
| `/admin/operators` | `src/modules/admin/pages/OperatorManagement.tsx` | B2B operator approval table, revenue share tier adjustments, IP whitelist restrictions. |
| `/admin/providers` | `src/modules/admin/pages/ProviderManagement.tsx` | Pragmatic Play, Spribe, Evolution, PG Soft, Hacksaw connector health, ping telemetry, latency. |
| `/admin/games` | `src/modules/admin/pages/GameManagement.tsx` | Master catalog manager, global enable/disable switches, RTP tolerance thresholds. |
| `/admin/api-keys` | `src/modules/admin/pages/ApiKeyManagement.tsx` | Global key rotation registry, rate limit throttles, security revocation triggers. |
| `/admin/transactions` | `src/modules/admin/pages/TransactionManagement.tsx` | Cross-portal settlement logs, payout audits, suspicious bet flags. |
| `/admin/analytics` | `src/modules/admin/pages/AnalyticsReports.tsx` | GGR/NGR trends, player cohort retention curves, provider performance breakdowns. |
| `/admin/settings` | `src/modules/admin/pages/SystemSettings.tsx` | Platform configuration, maintenance mode toggle, wallet currency exchange rates, audit log trail. |

---

### 4. Integration Guide for Backend Engineers

When the backend development team begins connecting live services:
1. **API Client Layer**: Replace the in-memory mock datasets in `src/data/mock/` with an Axios/Fetch API layer using React Query or SWR.
2. **WebSocket Realtime Gateway**: Connect the simulation timers in `B2CGamePlayer.tsx`, `OperatorLogs.tsx`, and `AdminDashboard.tsx` to the live WebSocket stream for push-based betting logs and spin results.
3. **Authentication**: Wire the form submit handlers in `B2CAuth.tsx`, `OperatorAuth.tsx`, and `AdminLogin.tsx` to JWT token endpoints (`/api/v1/auth/login`), storing session tokens in secure `httpOnly` cookies.
4. **Game Launch Seamless URL**: In `B2CGamePlayer.tsx` and `OperatorMyGames.tsx`, substitute the simulated reel canvas with an `<iframe>` pointing to the provider's signed session URL (`/api/v1/games/launch?session_token=...`).
