# Operator Wallet Integration — cumulative Patch 3

New Operator Integration Setup page supports sending a FAKE-COIN wallet endpoint + callback key to `POST /api/v1/operator/wallet` with a freshly confirmed password. The API key is cleared from component state after submission and never stored in frontend storage. `GET /api/v1/operator/integration` and `GET /api/v1/operator/wallet` show nonsecret wallet state. The Admin API Key Management page now offers `Verify Wallet Balance` or `Reject Wallet` when the Operator's wallet is `pending` (fresh admin password required).

This is **not** live-money integration and a verified balance is **not** E2E launch or settlement certification. Real external sandbox wallet hosting, reviewed HTTPS allowlisting and Render secrets must be configured separately; no external host or Atlas resource was provisioned by this patch.

See `BE/docs/PATCH31_B2B_SANDBOX_WALLETS.md` and `BE/docs/PATCH31_TEST_RESULTS.md` within the cumulative delivery archive. Upload `BE/` before `FE/`.
