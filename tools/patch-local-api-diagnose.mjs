/** Read-only dev connectivity diagnosis. Requires Vite to be running on :5175. */
const endpoint = process.env.LOCAL_UI_ORIGIN || 'http://127.0.0.1:5175';
async function inspect(path) {
  try {
    const result = await fetch(`${endpoint}/api/v1/${path}`, { signal: AbortSignal.timeout(15000) });
    const type = result.headers.get('content-type') || '';
    const json = type.includes('application/json') ? await result.json() : null;
    return { status: result.status, data: json?.data, error: json?.error, json: !!json };
  } catch (error) { return { status: 0, error: {code: error?.name || 'ERROR'}, json: false }; }
}
console.log(`Checking Vite /api proxy at ${endpoint} (read-only)`);
const provider = await inspect('provider');
console.log('Provider status:', provider.status, provider.error?.code || '');
if (!provider.json) console.log('Backend did not return JSON: check Vite proxy and VITE_API_BASE_URL.');
if (provider.data?.featureAvailability) {
  const f = provider.data.featureAvailability;
  for (const [label, key] of [['Player registration','playerRegistration'], ['Operator registration','operatorRegistration'], ['Admin login','superAdminLogin'], ['Leaderboard read','leaderboardRead']]) {
    console.log(`${label}: ${f[key] === true ? 'ENABLED' : 'DISABLED'}`);
  }
}
const leaderboard = await inspect('leaderboards/global?limit=1&offset=0');
console.log('Leaderboard GET status:', leaderboard.status, leaderboard.error?.code || '');
if (leaderboard.status === 404) console.log('404: the proxy target is probably a backend with LEADERBOARD_ENABLED=false.');
if (leaderboard.status === 403) console.log('403: the backend rejected the request Origin. Check your Vite dev proxy setup.');
if (provider.status !== 200 || leaderboard.status !== 200) process.exitCode = 1;
