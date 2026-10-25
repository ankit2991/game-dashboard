# Netlify + Render Free deployment guide (Patch 7 verified)

## Dashboard

- Netlify project: https://strong-banoffee-1b55f4.netlify.app
- Build base directory: `FE/` (when repository root contains the FE and BE folders)
- Build: `npm ci && npm run build`; publish directory: `dist`
- Node: `22.x`
- Set only the public `VITE_API_BASE_URL=https://game-provider-be-free.onrender.com` in the frontend. Do not put secrets in Vite environment variables.
- `public/_redirects` contains `/* /index.html 200` so direct navigation to `/admin/login`, `/operator/login`, `/leaderboard`, `/player`, etc. serves `index.html` instead of a hosting 404.
- The post-build `ensureNetlifyRedirects` verifies `dist/index.html` exists and keeps custom redirect rules.

## Provider (Render Free)

- Existing API: `https://game-provider-be-free.onrender.com`
- `GET /health`, `GET /api/v1/provider`, `GET /api/v1/games` are public read-only probes.
- Render's existing deployment must explicitly receive environment changes; editing `render.yaml` alone does not alter existing services.
- `CORS_ORIGINS` must contain the EXACT Netlify origin (no trailing slash): `https://strong-banoffee-1b55f4.netlify.app`.
- The deployed API must have MongoDB Atlas M0 configured when using persistent accounts/transactions. Remain on **Render Free + Atlas M0**.
- Do not enable wagering or game Provider launch flags merely because the source builds. Verify each backend's adapter, active currency, wallet source and timeout reconciliation first.

## Diagnosing a browser 404

1. Check the exact failed URL in DevTools > Network. A document request on a Netlify client-side route requires the SPA redirect, whereas a `/api/v1/` request returning a JSON `NOT_FOUND` may mean a disabled feature flag or a wrong backend URL.
2. If the failed request is an asset (`.js`, `.css`, font, image), check the build output and cache. Do not rewrite asset 404s to HTML as an API fix.
3. If `/api/v1/player/launch-options` is a 404, check `B2C_AUTH_ENABLED` and the deployed Provider version. If `/api/v1/player/wallet` is a 404, check wallet read flags. If `/api/v1/leaderboards` is 404, check `LEADERBOARD_ENABLED`.
4. `GET /api/v1/provider` includes **public flags**, not a guarantee of live game play. Run `npm run preflight:games` on a trusted operator computer to examine configuration.

For the full release checklist see `BE/docs/PATCH7_DEPLOYMENT_AND_API.md`.
