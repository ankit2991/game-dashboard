/** Public, secret-free hints for configuration-only diagnostics. */
const HINTS: Record<string, string> = {
  B2C_PARTNER_NOT_SELECTED: 'Set B2C_LAUNCH_PARTNER_ID=operator_sandbox_1 on Render.',
  SANDBOX_PARTNER_REQUIRED: 'B2C requires the isolated operator_sandbox_1 fake-credit partner.',
  B2C_PARTNER_NOT_FOUND: 'The selected partner is missing from PARTNERS_JSON (required for the built-in sandbox wallet).',
  INTERNAL_SANDBOX_WALLET_INVALID: 'The internal sandbox wallet needs an authorized fake-COIN partner and MongoDB.',
  FAKE_WALLET_NOT_CONFIGURED: 'The selected partner has no wallet callback configuration.',
  UNSUPPORTED_FAKE_WALLET_CONFIGURATION: 'The selected wallet is not the approved fake-COIN sandbox wallet.',
  B2C_PARTNER_HAS_NO_GAMES: 'The sandbox partner must authorize at least one game.',
  SANDBOX_BALANCE_READ_DISABLED: 'Set B2C_SANDBOX_BALANCE_READ_ENABLED=true after configuring the fake wallet.',
  BROWSER_PROVIDER_DISABLED: 'B2C_PROVIDER_LAUNCH_ENABLED is disabled.',
  PLAYER_AUTH_DISABLED: 'B2C_AUTH_ENABLED is disabled.',
  OPERATOR_ACCESS_NOT_CONFIGURED: 'The B2C partner is missing or is not authorized for this game.',
  ADAPTER_NOT_CONFIGURED: 'Game adapter secret or per-game launch flag is missing.',
  GAME_BACKEND_NOT_CONFIGURED: 'The game backend URL is not configured.',
  SANDBOX_WALLET_READ_ONLY: 'Patch 1 internal COIN wallet supports verified balance reads only. Game Bet / Win / Refund remains disabled until Patch 3.',
  SANDBOX_WALLET_NOT_CONFIGURED: 'Wallet writes or partner wallet are not configured.',
  PILOT_GAME_NOT_ALLOWED: 'The game is excluded by the pilot allowlist.',
  GAME_NOT_IN_SANDBOX_PILOT: 'This game is not enrolled in the sandbox pilot.',
  PLAYER_SANDBOX_WALLET_NOT_READY: 'The fake-credit B2C wallet configuration is incomplete.',
  DEMO_UNAVAILABLE: 'Game frontend/demo URL is missing.',
  GAME_DISABLED: 'Game is disabled in the published catalog.',
};

export function connectionHint(code: string): string { return HINTS[code] || code.replaceAll('_', ' ').toLowerCase(); }
