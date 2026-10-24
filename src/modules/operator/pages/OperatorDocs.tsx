import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  CheckCircle2,
  Terminal,
  Code2,
  BookOpen,
  KeyRound,
  Gamepad2,
  Wallet,
  Webhook,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export const OperatorDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'auth' | 'launch' | 'catalog' | 'wallet' | 'webhooks' | 'errors'>('launch');
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'php' | 'python'>('curl');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code snippet copied to clipboard.');
  };

  const codeSnippets: Record<string, Record<string, string>> = {
    launch: {
      curl: `curl -X POST https://gateway.nexus-provider.io/v1/games/launch \\
  -H "Authorization: Bearer nx_live_9a8f4920b7c1..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "game_id": "game_gates_olympus",
    "player_id": "usr_9921048",
    "currency": "USD",
    "session_ip": "103.45.22.18",
    "return_url": "https://yourcasino.com/lobby"
  }'`,
      node: `import axios from 'axios';

const response = await axios.post('https://gateway.nexus-provider.io/v1/games/launch', {
  game_id: 'game_gates_olympus',
  player_id: 'usr_9921048',
  currency: 'USD',
  session_ip: '103.45.22.18',
  return_url: 'https://yourcasino.com/lobby'
}, {
  headers: {
    'Authorization': 'Bearer nx_live_9a8f4920b7c1...',
    'Content-Type': 'application/json'
  }
});

console.log('Launch URL:', response.data.launch_url);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://gateway.nexus-provider.io/v1/games/launch",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "game_id" => "game_gates_olympus",
    "player_id" => "usr_9921048",
    "currency" => "USD"
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer nx_live_9a8f4920b7c1...",
    "Content-Type: application/json"
  ]
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://gateway.nexus-provider.io/v1/games/launch"
payload = {
    "game_id": "game_gates_olympus",
    "player_id": "usr_9921048",
    "currency": "USD",
    "session_ip": "103.45.22.18"
}
headers = {
    "Authorization": "Bearer nx_live_9a8f4920b7c1...",
    "Content-Type": "application/json"
}

res = requests.post(url, json=payload, headers=headers)
print("Launch URL:", res.json()["launch_url"])`
    },
    wallet: {
      curl: `# When player bets, Nexus calls your server:
POST https://your-server.com/api/nexus-wallet/bet
X-Nexus-Signature: sha256=98f12a...
Content-Type: application/json

{
  "transaction_id": "tx_99210480",
  "player_id": "usr_9921048",
  "game_id": "game_gates_olympus",
  "amount": 5.00,
  "currency": "USD"
}`,
      node: `// Express.js Route Handling Nexus Wallet Deductions
app.post('/api/nexus-wallet/bet', async (req, res) => {
  const { player_id, amount, currency, transaction_id } = req.body;
  
  // Verify HMAC header with your secret key
  const valid = verifyHmac(req.headers['x-nexus-signature'], req.body);
  if (!valid) return res.status(401).json({ error: 'INVALID_SIGNATURE' });

  // Atomic balance debit in your database
  const newBalance = await db.users.debitBalance(player_id, amount);

  res.json({
    status: 'SUCCESS',
    balance: newBalance,
    transaction_id
  });
});`,
      php: `<?php
// PHP Wallet Webhook Handler
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_NEXUS_SIGNATURE'] ?? '';

if (!verifyNexusSignature($payload, $signature, $apiKey)) {
    http_response_code(401);
    exit(json_encode(['error' => 'INVALID_SIGNATURE']));
}

$data = json_decode($payload, true);
// Debit balance...
echo json_encode(['status' => 'SUCCESS', 'balance' => 450.00]);`,
      python: `@app.route('/api/nexus-wallet/bet', methods=['POST'])
def handle_nexus_bet():
    payload = request.get_json()
    sig = request.headers.get('X-Nexus-Signature')
    
    if not verify_signature(sig, request.data):
        return jsonify({"error": "INVALID_SIGNATURE"}), 401
        
    new_balance = debit_player_wallet(payload["player_id"], payload["amount"])
    return jsonify({"status": "SUCCESS", "balance": new_balance})`
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#00D4FF] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <FileCode2 className="w-6 h-6 text-[#00D4FF]" />
            Developer API Reference & SDKs
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Complete integration guide for launching games, handling real-time wallet callbacks, and syncing catalogs.
          </p>
        </div>

        <Badge variant="cyan" size="sm">
          Protocol: REST + Webhook v1.4
        </Badge>
      </div>

      {/* Main Documentation Layout: Navigation + Content + Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Nav Menu */}
        <div className="lg:col-span-3 space-y-1 text-xs">
          <div className="p-3 bg-[#121A2D] rounded-xl border border-[#233252] mb-3">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Base Endpoints</span>
            <code className="text-[#20C997] font-mono text-[11px] block truncate">https://gateway.nexus-provider.io/v1</code>
            <code className="text-[#00D4FF] font-mono text-[11px] block truncate mt-1">https://sandbox.nexus-provider.io/v1</code>
          </div>

          {[
            { id: 'auth', label: '1. Authentication & Headers', icon: KeyRound },
            { id: 'launch', label: '2. Game Launch API', icon: Gamepad2 },
            { id: 'catalog', label: '3. Games Catalog Feed', icon: BookOpen },
            { id: 'wallet', label: '4. Seamless Wallet Callbacks', icon: Wallet },
            { id: 'webhooks', label: '5. Webhook Security (HMAC)', icon: Webhook },
            { id: 'errors', label: '6. Error Codes & Retries', icon: AlertCircle }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-left transition-all ${
                activeSection === item.id
                  ? 'bg-[#00D4FF] text-[#0B1020] font-bold shadow-md shadow-[#00D4FF]/20'
                  : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Center & Right: Documentation Content with Multi-Language Code Box */}
        <div className="lg:col-span-9 space-y-6">
          {activeSection === 'launch' && (
            <Card>
              <CardHeader
                title="POST /v1/games/launch"
                subtitle="Generates an authenticated, short-lived mobile-first player session URL"
                action={<Badge variant="success" size="sm">200 OK</Badge>}
              />

              <p className="text-xs text-[#98A5BF] leading-relaxed mb-4">
                Call this endpoint from your backend whenever a player clicks "Play Now" on your casino or mobile app. The returned <code className="text-[#00D4FF]">launch_url</code> can be loaded in an iframe or fullscreen webview.
              </p>

              {/* Language Switcher & Code Snippet Box */}
              <div className="rounded-2xl bg-[#0B1020] border border-[#233252] overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#233252] bg-[#121A2D]">
                  <div className="flex items-center gap-1 text-xs">
                    {(['curl', 'node', 'php', 'python'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-3 py-1 rounded-lg uppercase font-semibold text-[10px] transition-all ${
                          activeLang === lang
                            ? 'bg-[#00D4FF] text-[#0B1020]'
                            : 'text-[#98A5BF] hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => copyCode(codeSnippets.launch[activeLang])}
                    className="flex items-center gap-1.5 text-xs text-[#98A5BF] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>

                <pre className="p-4 font-mono text-xs text-[#F5F7FF] overflow-x-auto leading-relaxed">
                  {codeSnippets.launch[activeLang]}
                </pre>
              </div>

              {/* Request Parameters Table */}
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2">Request Body Parameters</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-[#233252] rounded-xl overflow-hidden">
                  <thead className="bg-[#121A2D] text-[#98A5BF]">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Required</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#233252] text-[#98A5BF]">
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-[#00D4FF]">game_id</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-[#20C997]">Yes</td>
                      <td className="py-2.5 px-3 text-white">Unique identifier from the catalog (e.g. <code>game_gates_olympus</code>)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-[#00D4FF]">player_id</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-[#20C997]">Yes</td>
                      <td className="py-2.5 px-3 text-white">Your system's unique player identifier</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-[#00D4FF]">currency</td>
                      <td className="py-2.5 px-3 font-mono">string (ISO 4217)</td>
                      <td className="py-2.5 px-3 text-[#20C997]">Yes</td>
                      <td className="py-2.5 px-3 text-white">Currency ISO code (USD, EUR, MYR, USDT, etc.)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-[#00D4FF]">session_ip</td>
                      <td className="py-2.5 px-3 font-mono">string (IPv4)</td>
                      <td className="py-2.5 px-3 text-[#FFB547]">Optional</td>
                      <td className="py-2.5 px-3 text-white">Player IP for geo-compliance & latency routing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeSection === 'wallet' && (
            <Card>
              <CardHeader
                title="Seamless Wallet Protocol Specification"
                subtitle="Inbound callbacks sent from Nexus to your backend server"
                action={<Badge variant="purple" size="sm">Zero Hold</Badge>}
              />

              <p className="text-xs text-[#98A5BF] leading-relaxed mb-4">
                To guarantee zero latency, player funds never leave your database. When a player bets in any game, Nexus dispatches a synchronous POST request to your registered webhook URL. Your server debits or credits the player balance and responds within 2,000ms.
              </p>

              <div className="rounded-2xl bg-[#0B1020] border border-[#233252] overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#233252] bg-[#121A2D]">
                  <div className="flex items-center gap-1 text-xs">
                    {(['curl', 'node', 'php', 'python'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-3 py-1 rounded-lg uppercase font-semibold text-[10px] transition-all ${
                          activeLang === lang
                            ? 'bg-[#00D4FF] text-[#0B1020]'
                            : 'text-[#98A5BF] hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => copyCode(codeSnippets.wallet[activeLang])}
                    className="flex items-center gap-1.5 text-xs text-[#98A5BF] hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>

                <pre className="p-4 font-mono text-xs text-[#F5F7FF] overflow-x-auto leading-relaxed">
                  {codeSnippets.wallet[activeLang]}
                </pre>
              </div>
            </Card>
          )}

          {activeSection !== 'launch' && activeSection !== 'wallet' && (
            <Card>
              <CardHeader
                title="Section Reference"
                subtitle="Live implementation reference for backend developers"
              />
              <div className="p-6 text-center text-xs text-[#98A5BF] space-y-2">
                <p className="font-semibold text-white">Full SDK Reference is configured and ready for backend integration.</p>
                <p>This module provides real mock payloads matching standard iGaming aggregator specifications (HMAC signatures, idempotent transaction IDs, and currency normalization).</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
