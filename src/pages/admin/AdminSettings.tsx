import React, { useState, useRef } from 'react';

export default function AdminSettings() {
  const [show2FA, setShow2FA] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  
  // 2FA code inputs
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const toggleModal = () => {
    setShow2FA(!show2FA);
  };

  return (
    <>
      {/* 2FA Confirmation Modal (Overlay) */}
      <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ${show2FA ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-primary/20 transition-all duration-300 transform ${show2FA ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h2 className="font-headline-md text-headline-md">Authorization Required</h2>
            <p className="text-on-surface-variant mt-2">Enter the 6-digit code from your authenticator app to commit global changes.</p>
          </div>
          <div className="flex justify-center gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 bg-surface-container-highest border border-outline-variant text-center text-xl font-bold rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all"
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleModal}
              className="flex-1 px-6 py-3 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-variant/20 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={toggleModal}
              className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Confirm Change
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8 pb-20 md:pb-0">
        {/* TopAppBar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Settings</h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleModal}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Global Changes
            </button>
          </div>
        </div>

        {/* Main Content Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Platform Fees Section (Bento Grid Item) */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card rounded-xl overflow-hidden flex flex-col">
              <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary">Platform Fees</h3>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">payments</span>
              </div>
              <div className="p-card-padding space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Withdrawal Fee (%)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-tabular-nums focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all" type="text" defaultValue="2.50" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Deposit Fee (%)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-tabular-nums focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all" type="text" defaultValue="0.00" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">%</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-label-sm">Last Update</span>
                    <span className="text-tabular-nums text-xs">2023-10-24 14:02 GMT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Global Caps */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col flex-1">
              <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-tertiary">ROI Global Caps</h3>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">trending_up</span>
              </div>
              <div className="p-card-padding space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface">Standard Cap</span>
                  <span className="text-tabular-nums font-bold text-tertiary">12.5%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-[65%]"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface">Institutional Cap</span>
                  <span className="text-tabular-nums font-bold text-primary">28.0%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* API Integrations & Maintenance (Bento Grid Item) */}
          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Maintenance Toggles */}
              <div className="glass-card rounded-xl p-card-padding">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">System State</h3>
                    <p className="text-label-sm text-on-surface-variant">Global Service Controls</p>
                  </div>
                  <span className="material-symbols-outlined text-error">power_settings_new</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">construction</span>
                      <span className="text-body-md text-on-surface">Maintenance Mode</span>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${maintenanceMode ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenanceMode ? 'right-1' : 'left-1 bg-on-surface-variant'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">login</span>
                      <span className="text-body-md text-on-surface">New Registrations</span>
                    </div>
                    <button
                      onClick={() => setNewRegistrations(!newRegistrations)}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${newRegistrations ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newRegistrations ? 'right-1' : 'left-1 bg-on-surface-variant'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* API Status Chips */}
              <div className="glass-card rounded-xl p-card-padding flex flex-col justify-between">
                <div>
                  <h3 className="font-label-md text-label-md uppercase tracking-wider mb-4 text-on-surface">Active Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span> Binance Cloud
                    </span>
                    <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span> CoinGate v4
                    </span>
                    <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full"></span> Twilio SMS
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 bg-primary-container/10 rounded-lg border border-primary/20">
                  <span className="material-symbols-outlined text-primary">vpn_key</span>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-bold">API Integrity High</div>
                </div>
              </div>
            </div>

            {/* Advanced Configuration JSON Editor */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[400px]">
              <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">code</span>
                  <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface">Advanced Config (JSON)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-on-surface-variant hover:text-white transition-colors text-xs font-label-md cursor-pointer">Format JSON</button>
                  <span className="h-4 w-[1px] bg-outline-variant/30"></span>
                  <span className="text-[10px] text-tertiary font-mono">Status: Ready</span>
                </div>
              </div>
              <div className="flex-1 bg-surface-container-lowest font-mono text-sm p-card-padding overflow-auto">
                <pre className="text-primary/70 leading-6">{`{
  "system_version": "3.42.1-stable",
  "liquidity_provider": {
    "primary": "Binance_Institutional",
    "fallback": "Kraken_Direct",
    "threshold_sec": 0.05
  },
  "security_nodes": [
    "US-EAST-1",
    "EU-WEST-2",
    "SG-CORE-4"
  ],
  "rate_limits": {
    "public_api": 100,
    "admin_api": 5000,
    "burst": true
  },
  "debug_mode": false,
  "geo_fencing": {
    "enabled": true,
    "restricted_codes": ["XX", "YY"]
  }
}`}</pre>
              </div>
            </div>
          </section>
        </div>

        {/* External API Logs Section (Table-style) */}
        <section>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="bg-surface-container-high/50 px-card-padding py-4 border-b border-outline-variant/20">
              <h3 className="font-headline-md text-headline-md text-on-surface">Integration Heartbeat</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/30 text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="px-card-padding py-3">Service</th>
                    <th className="px-card-padding py-3">Endpoint</th>
                    <th className="px-card-padding py-3">Latency</th>
                    <th className="px-card-padding py-3">Status</th>
                    <th className="px-card-padding py-3">Last Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                  <tr className="hover:bg-surface-variant/10 transition-colors">
                    <td className="px-card-padding py-4 font-bold">Binance API</td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">api.binance.com/v3/ticker</td>
                    <td className="px-card-padding py-4 text-tabular-nums text-tertiary">14ms</td>
                    <td className="px-card-padding py-4">
                      <span className="bg-tertiary/20 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">STABLE</span>
                    </td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">0.4s ago</td>
                  </tr>
                  <tr className="hover:bg-surface-variant/10 transition-colors">
                    <td className="px-card-padding py-4 font-bold">CoinGate</td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">api.coingate.com/v2/orders</td>
                    <td className="px-card-padding py-4 text-tabular-nums text-tertiary">42ms</td>
                    <td className="px-card-padding py-4">
                      <span className="bg-tertiary/20 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">STABLE</span>
                    </td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">1.2s ago</td>
                  </tr>
                  <tr className="hover:bg-surface-variant/10 transition-colors">
                    <td className="px-card-padding py-4 font-bold">Twilio Gateway</td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">api.twilio.com/2010-04-01</td>
                    <td className="px-card-padding py-4 text-tabular-nums text-error">N/A</td>
                    <td className="px-card-padding py-4">
                      <span className="bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-bold">TIMEOUT</span>
                    </td>
                    <td className="px-card-padding py-4 text-on-surface-variant text-sm">15.0s ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
