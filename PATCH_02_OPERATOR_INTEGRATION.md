# Patch 2 — Operator Activation & Integration

This is a cumulative project based on Admin Core Management Patch 1 (including Leaderboard Username Patch 1).

The Operator portal now has an **Integration Setup** page. It reads the new authenticated `GET /api/v1/operator/integration` API and distinguishes requested games from authorized games and config-only backend readiness.

The operator can claim a newly rotated Partner API key **once**, through a password-confirmed `POST /api/v1/operator/credentials/claim` after administrator provisioning. Previous key is immediately invalidated. The new key is displayed in memory only until hidden or navigation; it is never saved in localStorage/sessionStorage. Use it on your backend, not React.

Deployment: **BE first, then FE**. No paid services or new environment variables introduced by this patch. See `BE/docs/PATCH30_OPERATOR_ACTIVATION_INTEGRATION.md` for server flow, security details and limitations.

The managed partner wallet integration is **not** implemented in this patch. `walletE2eVerified: false` and `endToEndVerified: false` are explicit, not proof of a successful live integration.
