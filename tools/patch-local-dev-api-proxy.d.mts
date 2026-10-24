/**
 * Type declarations for the local development API proxy.
 * The runtime implementation remains patch-local-dev-api-proxy.mjs.
 * Keep this file next to the .mjs file so TypeScript NodeNext can resolve it.
 */
export declare const DEV_BROWSER_ORIGINS: readonly string[];
export declare const DEFAULT_DEV_BACKEND: string;

export declare function shouldRemoveProxyOrigin(origin: unknown): boolean;

export declare function stripLocalOriginForServerProxy(
  proxyReq: { removeHeader(name: string): void },
  request: { headers?: { origin?: string } },
): boolean;

export declare function validateDevBackendUrl(value: string): string;
