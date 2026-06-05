import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/* ── types ── */
interface PlatformConfig {
  withdrawal_fee: number;
  deposit_fee: number;
  roi_cap_standard: number;
  roi_cap_institutional: number;
  maintenance_mode: boolean;
  new_registrations: boolean;
  deposit_address_usdt: string;
  deposit_address_eth: string;
  deposit_address_btc: string;
  site_name: string;
  site_logo_url: string;
  advanced_config: Record<string, unknown>;
  updated_at: string | null;
}

interface ServiceStatus {
  name: string;
  endpoint: string;
  latency: number | null;
  status: 'ok' | 'error' | 'checking';
  lastPing: string;
}

/* ── defaults ── */
const DEFAULT_CONFIG: PlatformConfig = {
  withdrawal_fee: 2.50,
  deposit_fee: 0.00,
  roi_cap_standard: 12.5,
  roi_cap_institutional: 28.0,
  maintenance_mode: false,
  new_registrations: true,
  deposit_address_usdt: '',
  deposit_address_eth: '',
  deposit_address_btc: '',
  site_name: 'Jamex Global Markets',
  site_logo_url: '',
  advanced_config: {},
  updated_at: null,
};

const DEFAULT_JSON = JSON.stringify(
  { rate_limits: { public_api: 100, admin_api: 5000, burst: true }, debug_mode: false, geo_fencing: { enabled: true, restricted_codes: [] } },
  null, 2
);

export default function AdminSettings() {
  const [config, setConfig]     = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [jsonText, setJsonText] = useState(DEFAULT_JSON);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [toast, setToast]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [services, setServices] = useState<ServiceStatus[]>([]);

  /* ── health check ── */
  const pingServices = useCallback(async () => {
    const ts = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const checking: ServiceStatus[] = [
      { name: 'Supabase Database', endpoint: 'rest/v1/wallets',      latency: null, status: 'checking', lastPing: ts() },
      { name: 'Supabase Storage',  endpoint: 'storage/v1/kyc-docs',  latency: null, status: 'checking', lastPing: ts() },
    ];
    setServices([...checking]);

    const t1 = Date.now();
    try {
      const { error } = await supabase.from('wallets').select('user_id').limit(1);
      checking[0] = { ...checking[0], latency: Date.now() - t1, status: error ? 'error' : 'ok', lastPing: ts() };
    } catch { checking[0] = { ...checking[0], status: 'error', lastPing: ts() }; }

    const t2 = Date.now();
    try {
      const { error } = await supabase.storage.from('kyc-documents').list('', { limit: 1 });
      checking[1] = { ...checking[1], latency: Date.now() - t2, status: error ? 'error' : 'ok', lastPing: ts() };
    } catch { checking[1] = { ...checking[1], status: 'error', lastPing: ts() }; }

    setServices([...checking]);
  }, []);

  /* ── fetch config ── */
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('platform_config').select('*').eq('id', 1).single();
      if (data && !error) {
        setConfig({
          withdrawal_fee:        Number(data.withdrawal_fee),
          deposit_fee:           Number(data.deposit_fee),
          roi_cap_standard:      Number(data.roi_cap_standard),
          roi_cap_institutional: Number(data.roi_cap_institutional),
          maintenance_mode:      data.maintenance_mode,
          new_registrations:     data.new_registrations,
          deposit_address_usdt:  data.deposit_address_usdt || '',
          deposit_address_eth:   data.deposit_address_eth  || '',
          deposit_address_btc:   data.deposit_address_btc  || '',
          site_name:             data.site_name || 'Jamex Global Markets',
          site_logo_url:         data.site_logo_url || '',
          advanced_config:       data.advanced_config || {},
          updated_at:            data.updated_at,
        });
        const json = data.advanced_config && Object.keys(data.advanced_config).length > 0
          ? JSON.stringify(data.advanced_config, null, 2)
          : DEFAULT_JSON;
        setJsonText(json);
      }
    } catch (err) { console.warn('platform_config not found — using defaults. Run schema.sql in Supabase.'); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConfig();
    pingServices();
    const interval = setInterval(pingServices, 30000);

    const channel = supabase.channel('platform_config_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_config' }, () => fetchConfig())
      .subscribe();

    return () => { clearInterval(interval); supabase.removeChannel(channel); };
  }, [fetchConfig, pingServices]);

  /* ── save ── */
  async function doSave() {
    setSaving(true);
    let parsedJson: Record<string, unknown> = {};
    try { parsedJson = JSON.parse(jsonText); } catch { parsedJson = config.advanced_config; }

    const { error } = await supabase.from('platform_config').upsert({
      id: 1,
      withdrawal_fee:        config.withdrawal_fee,
      deposit_fee:           config.deposit_fee,
      roi_cap_standard:      config.roi_cap_standard,
      roi_cap_institutional: config.roi_cap_institutional,
      maintenance_mode:      config.maintenance_mode,
      new_registrations:     config.new_registrations,
      deposit_address_usdt:  config.deposit_address_usdt.trim(),
      deposit_address_eth:   config.deposit_address_eth.trim(),
      deposit_address_btc:   config.deposit_address_btc.trim(),
      site_name:             config.site_name.trim(),
      site_logo_url:         config.site_logo_url.trim(),
      advanced_config:       parsedJson,
      updated_at:            new Date().toISOString(),
    });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setToast({ type: 'success', msg: 'Settings saved successfully.' });
    } else {
      setToast({ type: 'error', msg: error.message || 'Failed to save. Check your connection and try again.' });
    }
    setTimeout(() => setToast(null), 5000);

    setSaving(false);
  }

  function toggle(key: 'maintenance_mode' | 'new_registrations') {
    setConfig(c => ({ ...c, [key]: !c[key] }));
  }

  const roiStdPct  = Math.min(100, (config.roi_cap_standard      / 50) * 100);
  const roiInstPct = Math.min(100, (config.roi_cap_institutional  / 50) * 100);

  const fmtUpdated = config.updated_at
    ? new Date(config.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  const jsonValid = (() => { try { JSON.parse(jsonText); return true; } catch { return false; } })();

  return (
    <>
      {/* Toast notification */}
      <div className={`fixed top-6 right-6 z-[100] transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {toast && (
          <div className={`flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border max-w-sm ${
            toast.type === 'success'
              ? 'bg-surface-container glass-card border-tertiary/30'
              : 'bg-surface-container glass-card border-error/40'
          }`}>
            <span className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
              toast.type === 'success' ? 'text-tertiary' : 'text-error'
            }`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <div className="flex-1">
              <p className={`font-bold text-sm ${
                toast.type === 'success' ? 'text-tertiary' : 'text-error'
              }`}>
                {toast.type === 'success' ? 'Saved successfully' : 'Save failed'}
              </p>
              <p className="text-on-surface-variant text-xs mt-0.5 leading-snug">{toast.msg}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-outline/50 hover:text-on-surface transition-colors shrink-0">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8 pb-20 md:pb-0">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-headline-md font-bold text-on-surface">Settings</h2>
            {loading && <span className="text-outline font-label-sm">Loading…</span>}
            {fmtUpdated && !loading && (
              <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/20">
                Last saved {fmtUpdated}
              </span>
            )}
          </div>
          <button
            onClick={doSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-label-md hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50 ${
              saved ? 'bg-tertiary text-on-tertiary shadow-tertiary/20' : 'bg-primary text-on-primary shadow-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{saved ? 'check_circle' : 'save'}</span>
            {saved ? 'Saved!' : 'Save Global Changes'}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Fees + ROI */}
          <section className="lg:col-span-4 flex flex-col gap-6">

            {/* Platform Fees */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col">
              <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
                <h3 className="font-label-md uppercase tracking-wider text-primary">Platform Fees</h3>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">payments</span>
              </div>
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Withdrawal Fee (%)</label>
                  <div className="relative">
                    <input
                      value={config.withdrawal_fee} type="number" step="0.01" min="0" max="100"
                      onChange={e => setConfig(c => ({ ...c, withdrawal_fee: Number(e.target.value) }))}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-tabular-nums focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Deposit Fee (%)</label>
                  <div className="relative">
                    <input
                      value={config.deposit_fee} type="number" step="0.01" min="0" max="100"
                      onChange={e => setConfig(c => ({ ...c, deposit_fee: Number(e.target.value) }))}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-tabular-nums focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">%</span>
                  </div>
                </div>
                {fmtUpdated && (
                  <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between text-on-surface-variant">
                    <span className="text-label-sm">Last Update</span>
                    <span className="text-tabular-nums text-xs">{fmtUpdated}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ROI Caps */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col flex-1">
              <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
                <h3 className="font-label-md uppercase tracking-wider text-tertiary">ROI Global Caps</h3>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">trending_up</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-md text-on-surface">Standard Cap</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      value={config.roi_cap_standard} type="number" step="0.1" min="0"
                      onChange={e => setConfig(c => ({ ...c, roi_cap_standard: Number(e.target.value) }))}
                      className="w-20 bg-surface-container-lowest border border-outline-variant/50 rounded px-2 py-1 text-tabular-nums text-tertiary text-sm font-bold focus:border-primary outline-none text-right"
                    />
                    <span className="text-tertiary text-sm font-bold">%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${roiStdPct}%` }} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-md text-on-surface">Institutional Cap</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      value={config.roi_cap_institutional} type="number" step="0.1" min="0"
                      onChange={e => setConfig(c => ({ ...c, roi_cap_institutional: Number(e.target.value) }))}
                      className="w-20 bg-surface-container-lowest border border-outline-variant/50 rounded px-2 py-1 text-tabular-nums text-primary text-sm font-bold focus:border-primary outline-none text-right"
                    />
                    <span className="text-primary text-sm font-bold">%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${roiInstPct}%` }} />
                </div>
              </div>
            </div>

            {/* Site Branding */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col">
              <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
                <h3 className="font-label-md uppercase tracking-wider text-primary">Site Branding</h3>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">palette</span>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Site Name</label>
                  <input
                    value={config.site_name}
                    onChange={e => setConfig(c => ({ ...c, site_name: e.target.value }))}
                    placeholder="e.g. Jamex Global Markets"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                  <p className="text-[10px] text-on-surface-variant">Displayed in header, footer, page titles, and across the platform.</p>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Logo URL</label>
                  <input
                    value={config.site_logo_url}
                    onChange={e => setConfig(c => ({ ...c, site_logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                  {config.site_logo_url && (
                    <div className="flex items-center gap-3 mt-2">
                      <img src={config.site_logo_url} alt="Logo preview" className="w-8 h-8 rounded object-contain border border-outline-variant/20" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="text-[10px] text-on-surface-variant font-mono truncate">{config.site_logo_url}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-on-surface-variant">Leave empty to use the default icon logo.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right: System State + JSON Editor */}
          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* System State */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-headline-md text-on-surface">System State</h3>
                    <p className="text-label-sm text-on-surface-variant">Global Service Controls</p>
                  </div>
                  <span className="material-symbols-outlined text-error">power_settings_new</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">construction</span>
                      <div>
                        <p className="text-body-md text-on-surface">Maintenance Mode</p>
                        {config.maintenance_mode && <p className="text-[10px] text-error font-bold">PLATFORM OFFLINE TO USERS</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle('maintenance_mode')}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${config.maintenance_mode ? 'bg-error' : 'bg-surface-container-highest border border-outline-variant/30'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.maintenance_mode ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">login</span>
                      <div>
                        <p className="text-body-md text-on-surface">New Registrations</p>
                        {!config.new_registrations && <p className="text-[10px] text-error font-bold">SIGN-UPS DISABLED</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle('new_registrations')}
                      className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${config.new_registrations ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.new_registrations ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Integrations */}
              <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-label-md uppercase tracking-wider mb-4 text-on-surface">Active Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" /> Binance Cloud
                    </span>
                    <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" /> CoinGate v4
                    </span>
                    <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" /> Twilio SMS
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 bg-primary-container/10 rounded-lg border border-primary/20">
                  <span className="material-symbols-outlined text-primary">vpn_key</span>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-bold">API Integrity High</div>
                </div>
              </div>
            </div>

            {/* Advanced Config JSON Editor */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[400px]">
              <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">code</span>
                  <h3 className="font-label-md uppercase tracking-wider text-on-surface">Advanced Config (JSON)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { try { setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2)); } catch {} }}
                    className="text-on-surface-variant hover:text-white transition-colors text-xs cursor-pointer"
                  >
                    Format JSON
                  </button>
                  <span className="h-4 w-[1px] bg-outline-variant/30" />
                  <span className={`text-[10px] font-mono ${jsonValid ? 'text-tertiary' : 'text-error'}`}>
                    {jsonValid ? 'Valid JSON ✓' : 'Invalid JSON ✗'}
                  </span>
                </div>
              </div>
              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                className="flex-1 bg-surface-container-lowest font-mono text-sm p-6 resize-none outline-none text-primary/80 leading-6"
                spellCheck={false}
              />
            </div>
          </section>
        </div>

        {/* Deposit Wallet Addresses */}
        <section className="glass-card rounded-xl overflow-hidden">
          <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
              <h3 className="font-label-md uppercase tracking-wider text-on-surface">Deposit Wallet Addresses</h3>
            </div>
            <span className="text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded border border-outline-variant/20 font-bold uppercase tracking-wider">
              Displayed on user Deposit page
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USDT */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary text-xs font-bold shrink-0">₮</span>
                USDT (TRC20) Address
              </label>
              <input
                value={config.deposit_address_usdt}
                onChange={e => setConfig(c => ({ ...c, deposit_address_usdt: e.target.value }))}
                placeholder="Enter USDT TRC20 deposit address…"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all placeholder:text-outline/50"
              />
              {config.deposit_address_usdt && (
                <p className="text-[10px] text-tertiary font-mono truncate">{config.deposit_address_usdt}</p>
              )}
            </div>
            {/* ETH */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] text-xs font-bold shrink-0">Ξ</span>
                ETH (ERC20) Address
              </label>
              <input
                value={config.deposit_address_eth}
                onChange={e => setConfig(c => ({ ...c, deposit_address_eth: e.target.value }))}
                placeholder="Enter ETH ERC20 deposit address…"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all placeholder:text-outline/50"
              />
              {config.deposit_address_eth && (
                <p className="text-[10px] text-[#6366f1] font-mono truncate">{config.deposit_address_eth}</p>
              )}
            </div>
            {/* BTC */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] text-xs font-bold shrink-0">₿</span>
                BTC (Bitcoin) Address
              </label>
              <input
                value={config.deposit_address_btc}
                onChange={e => setConfig(c => ({ ...c, deposit_address_btc: e.target.value }))}
                placeholder="Enter BTC deposit address…"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-on-surface transition-all placeholder:text-outline/50"
              />
              {config.deposit_address_btc && (
                <p className="text-[10px] text-[#f59e0b] font-mono truncate">{config.deposit_address_btc}</p>
              )}
            </div>
          </div>
          <div className="px-6 pb-5 flex items-center gap-2 text-[10px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-primary">info</span>
            Changes take effect immediately after clicking <span className="font-bold text-primary">Save Global Changes</span> above.
          </div>
        </section>

        {/* Integration Heartbeat — real pings */}
        <section>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="bg-surface-container-high/50 px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md text-on-surface">Integration Heartbeat</h3>
              <button
                onClick={pingServices}
                className="flex items-center gap-1.5 text-primary font-label-sm hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> Ping Now
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/30 text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Endpoint</th>
                    <th className="px-6 py-3">Latency</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Last Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-outline">Running checks…</td>
                    </tr>
                  ) : services.map((svc, i) => (
                    <tr key={i} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-6 py-4 font-bold">{svc.name}</td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">{svc.endpoint}</td>
                      <td className={`px-6 py-4 text-tabular-nums text-sm font-bold ${
                        svc.status === 'ok' ? 'text-tertiary' : svc.status === 'error' ? 'text-error' : 'text-outline'
                      }`}>
                        {svc.status === 'checking' ? '…' : svc.latency !== null ? `${svc.latency}ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {svc.status === 'ok'       && <span className="bg-tertiary/20 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">STABLE</span>}
                        {svc.status === 'error'    && <span className="bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-bold">ERROR</span>}
                        {svc.status === 'checking' && <span className="bg-surface-variant/20 text-outline px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">CHECKING</span>}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">{svc.lastPing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
