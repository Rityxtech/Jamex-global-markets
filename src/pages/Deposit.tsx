import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ASSET_LABEL: Record<string, string> = {
    usdt: 'USDT TRC20',
    eth:  'ETH ERC20',
    btc:  'Bitcoin',
};

interface DepositTx {
    id: string;
    asset: string;
    amount: number;
    destination_address: string | null;
    status: string;
    created_at: string;
}

export default function Deposit() {
    const navigate = useNavigate();
    const [selectedAsset, setSelectedAsset]   = useState('usdt');
    const [addresses, setAddresses]           = useState({ usdt: '', eth: '', btc: '' });
    const [copied, setCopied]                 = useState(false);
    const [totalBalance, setTotalBalance]     = useState<number | null>(null);
    const [depositFee, setDepositFee]         = useState<number>(0);
    const [kycStatus, setKycStatus]           = useState<string>('pending');
    const [deposits, setDeposits]             = useState<DepositTx[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        async function loadAll() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Deposit addresses + deposit fee from platform_config
            supabase
                .from('platform_config')
                .select('deposit_address_usdt, deposit_address_eth, deposit_address_btc, deposit_fee')
                .eq('id', 1)
                .single()
                .then(({ data }) => {
                    if (data) {
                        setAddresses({
                            usdt: data.deposit_address_usdt || '',
                            eth:  data.deposit_address_eth  || '',
                            btc:  data.deposit_address_btc  || '',
                        });
                        setDepositFee(Number(data.deposit_fee) || 0);
                    }
                });

            // Wallet balance
            supabase
                .from('wallets')
                .select('main_balance, profit_balance')
                .eq('user_id', user.id)
                .single()
                .then(({ data }) => {
                    if (data) setTotalBalance(Number(data.main_balance) + Number(data.profit_balance));
                });

            // KYC status
            supabase
                .from('kyc_submissions')
                .select('status')
                .eq('user_id', user.id)
                .maybeSingle()
                .then(({ data }) => {
                    if (data) setKycStatus(data.status);
                });

            // Deposit history
            setHistoryLoading(true);
            supabase
                .from('transactions')
                .select('id, asset, amount, destination_address, status, created_at')
                .eq('user_id', user.id)
                .eq('type', 'deposit')
                .order('created_at', { ascending: false })
                .limit(20)
                .then(({ data }) => {
                    setDeposits(data || []);
                    setHistoryLoading(false);
                });
        }
        loadAll();
    }, []);

    const activeAddress = addresses[selectedAsset as 'usdt' | 'eth' | 'btc'];

    function handleCopy() {
        if (!activeAddress) return;
        try {
            navigator.clipboard.writeText(activeAddress);
        } catch (e) {
            // fallback for non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = activeAddress;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function fmtDate(iso: string) {
        const d = new Date(iso);
        return d.toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit', hour12: false }).replace(',', '');
    }

    function truncateTx(addr: string | null) {
        if (!addr) return '—';
        return addr.length > 12 ? `${addr.substring(0,6)}…${addr.slice(-4)}` : addr;
    }

    function assetIcon(asset: string) {
        const a = asset.toUpperCase();
        if (a === 'BTC') return <span className="material-symbols-outlined text-[#f59e0b] text-[16px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>;
        if (a === 'ETH') return <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]" />;
        if (a === 'USDT') return <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg" alt="USDT" className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]" />;
        return <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">monetization_on</span>;
    }

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1400px] mx-auto w-full mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-6">
                        {/* Left: Workflow Column */}
                        <div className="lg:col-span-8 flex flex-col gap-2.5 md:gap-6">
                            {/* Step 1: Select Asset */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2 py-1.5 md:px-4 md:py-2.5 flex justify-between items-center border-b border-outline-variant/10">
                                    <span className="text-[10px] md:text-label-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[8px] md:text-[9px] font-bold">1</span>
                                        Select Asset
                                    </span>
                                    <span className="text-[7px] md:text-[9px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-1.5 py-0.5 rounded uppercase tracking-widest">Live Networks</span>
                                </div>
                                <div className="p-1.5 md:p-3 grid grid-cols-3 gap-1.5 md:gap-2.5">
                                    {[ 
                                        { key: 'usdt', label: 'USDT', net: 'TRC20', iconType: 'img', iconSrc: 'https://cryptologos.cc/logos/tether-usdt-logo.svg', color: '#26A17B' },
                                        { key: 'btc',  label: 'BTC',  net: 'Bitcoin', iconType: 'material', iconSrc: 'currency_bitcoin', color: '#f59e0b' },
                                        { key: 'eth',  label: 'ETH',  net: 'ERC20', iconType: 'img', iconSrc: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg', color: '#6366f1' },
                                    ].map(a => {
                                        const isActive = selectedAsset === a.key;
                                        return (
                                            <button
                                                key={a.key}
                                                onClick={() => setSelectedAsset(a.key)}
                                                className={`group flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2.5 rounded-lg transition-all active:scale-[0.985] ${isActive ? 'bg-primary/5 border border-primary ring-1 ring-primary/30' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'}`}
                                            >
                                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 border`} style={{ backgroundColor: `${a.color}1a`, borderColor: `${a.color}33`, color: a.color }}>
                                                    {a.iconType === 'img' ? (
                                                        <img src={a.iconSrc} alt={a.label} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[14px] md:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{a.iconSrc}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <div className={`font-bold text-[12px] md:text-sm leading-none ${isActive ? 'text-primary' : 'text-on-surface'}`}>{a.label}</div>
                                                    <div className="text-[8px] md:text-[9px] text-on-surface-variant font-medium truncate leading-tight mt-0.5">{a.net}</div>
                                                </div>
                                                {isActive && <span className="ml-auto material-symbols-outlined text-primary text-[14px] md:text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Step 2: Address & QR */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-4 md:py-2.5 border-b border-outline-variant/10">
                                    <span className="text-[12px] md:text-label-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="w-5 h-5 md:w-5 md:h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] md:text-[9px] font-bold">2</span>
                                        Deposit Address
                                    </span>
                                </div>
                                <div className="p-2.5 md:p-3 flex flex-row gap-2.5 md:gap-4 items-stretch">
                                    {/* Compact QR */}
                                    <div className="w-[106px] md:w-28 bg-white rounded-lg relative group shrink-0 shadow-sm border border-outline-variant/20 cursor-pointer overflow-hidden flex flex-col">
                                        {activeAddress ? (
                                            <img
                                                alt="Deposit QR Code"
                                                className="w-full aspect-square object-cover"
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(activeAddress)}`}
                                            />
                                        ) : (
                                            <div className="w-full aspect-square flex flex-col items-center justify-center gap-1 text-outline/40">
                                                <span className="material-symbols-outlined text-[26px] md:text-[26px]">qr_code_2</span>
                                                <span className="text-[8px] md:text-[7px] font-bold uppercase tracking-wider text-center px-1">Not configured</span>
                                            </div>
                                        )}
                                        <a
                                            href={activeAddress ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=8&data=${encodeURIComponent(activeAddress)}` : '#'}
                                            download={`jamex-deposit-qr-${selectedAsset.toUpperCase()}.png`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/55 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity duration-200"
                                            onClick={e => !activeAddress && e.preventDefault()}
                                        >
                                            <span className="material-symbols-outlined text-white text-[22px] md:text-[22px] drop-shadow" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
                                            <span className="text-white text-[9px] md:text-[8px] font-bold uppercase tracking-widest drop-shadow">Save</span>
                                        </a>
                                    </div>

                                    {/* Address + Warning (compact) */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <label className="text-[10px] md:text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block">Personal Deposit Wallet</label>
                                            <div className="flex items-stretch gap-2 md:gap-1.5">
                                                <div className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/50 px-2.5 py-2 md:px-3 md:py-2 rounded-md font-mono text-[11px] md:text-xs font-bold text-on-surface tracking-wide flex items-center overflow-hidden">
                                                    <span className="truncate block w-full">{activeAddress || <span className="text-outline/60 font-normal italic">Address not configured</span>}</span>
                                                </div>
                                                <button onClick={handleCopy} disabled={!activeAddress} className={`px-2.5 md:px-2.5 rounded-md hover:brightness-110 active:scale-95 transition-all shadow-sm shrink-0 flex items-center justify-center disabled:opacity-40 ${copied ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' : 'bg-primary-container text-on-primary-container'}`} title="Copy Address">
                                                    <span className="material-symbols-outlined text-[16px] md:text-[16px]">{copied ? 'check_circle' : 'content_copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 p-2 md:gap-1.5 md:p-2 rounded-md bg-error/10 border border-error/20 items-start mt-2">
                                            <span className="material-symbols-outlined text-error text-[14px] md:text-[14px] shrink-0 mt-0.5">warning</span>
                                            <p className="text-[10px] md:text-[9px] text-error/90 leading-[1.2] font-bold">
                                                Only send <span className="underline uppercase tracking-wider">{ASSET_LABEL[selectedAsset]}</span>. Wrong asset = permanent loss.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Step 3: Automated Block Scanner */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-3.5 border-b border-outline-variant/10 flex justify-between items-center">
                                    <span className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] md:text-[10px]">3</span>
                                        Automated Block Scanner
                                    </span>
                                    <span className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                        Live Scanning
                                    </span>
                                </div>
                                <div className="p-2.5 md:p-5 space-y-3">
                                {/* Scan Visual Dashboard */}
                                    <div className="md:grid md:grid-cols-12 md:gap-3 p-2.5 md:p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 relative overflow-hidden flex flex-col gap-2.5">
                                        {/* Radar Arc Grid Background */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                        
                                        {/* Mobile: Compact Horizontal Layout */}
                                        <div className="md:hidden flex items-center justify-between bg-surface-container-high/40 p-2.5 rounded border border-outline-variant/10 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                                    <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-75"></div>
                                                    <div className="absolute w-[80%] h-[80%] rounded-full border border-primary/20 animate-pulse"></div>
                                                    <div className="absolute w-[60%] h-[60%] rounded-full bg-primary/10 border border-primary/10"></div>
                                                    <span className="material-symbols-outlined text-[18px] text-primary animate-pulse z-10">radar</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Scanning Mempool</span>
                                                    <span className="text-[10px] font-mono text-on-surface-variant flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                                        Awaiting transfer...
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-on-surface-variant/80">
                                                <span className="px-1.5 py-0.5 rounded border border-outline-variant/20">Active</span>
                                                <span className="px-1.5 py-0.5 rounded border border-outline-variant/20">1.2s ping</span>
                                            </div>
                                        </div>

                                        {/* Desktop: Pulse Radar */}
                                        <div className="hidden md:flex md:col-span-4 flex-col items-center justify-center py-2 relative z-10">
                                            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                                                <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-75"></div>
                                                <div className="absolute w-[80%] h-[80%] rounded-full border border-primary/20 animate-pulse"></div>
                                                <div className="absolute w-[60%] h-[60%] rounded-full border border-primary/10"></div>
                                                <span className="material-symbols-outlined text-[32px] text-primary animate-pulse">radar</span>
                                            </div>
                                            <span className="text-[11px] font-mono text-primary font-bold mt-2 uppercase tracking-widest animate-pulse">Scanning Mempool</span>
                                        </div>

                                        {/* Right Side: Scanner Details / Terminal */}
                                        <div className="md:col-span-8 flex flex-col justify-between font-mono text-[10px] md:text-[11px] text-on-surface-variant space-y-2 md:space-y-2.5 relative z-10">
                                            {/* Desktop Terminal */}
                                            <div className="hidden md:block space-y-1.5 bg-surface-container-high/40 p-2.5 rounded-md border border-outline-variant/10 text-[10px] leading-relaxed">
                                                <p className="text-primary font-bold"><span className="text-on-surface-variant">[SYS]</span> Listening on network: <span className="text-on-surface underline">{selectedAsset.toUpperCase()}</span></p>
                                                <p><span className="text-on-surface-variant">[SYS]</span> Monitoring deposit address: <span className="text-on-surface-variant">{activeAddress ? `${activeAddress.substring(0,10)}…${activeAddress.slice(-6)}` : '— not configured'}</span></p>
                                                <div className="h-px bg-outline-variant/10 my-1 w-full"></div>
                                                <p className="flex items-center gap-1.5"><span className="text-tertiary font-bold animate-pulse">●</span> <span className="text-on-surface font-semibold">Awaiting transfer detection on block explorer...</span></p>
                                                <p className="text-[9px] text-on-surface-variant/60">Estimated detection time: &lt; 60 seconds</p>
                                            </div>

                                            {/* Mobile Terminal */}
                                            <div className="md:hidden bg-surface-container-highest/20 p-2.5 rounded border border-outline-variant/5 text-[10px] space-y-1.5">
                                                <div className="flex justify-between">
                                                    <span className="text-outline/60">Network</span>
                                                    <span className="font-bold text-primary">{selectedAsset.toUpperCase()}</span>
                                                </div>
                                                <div className="flex justify-between items-center gap-2">
                                                    <span className="text-outline/60 shrink-0">Target</span>
                                                    <span className="text-on-surface truncate">{activeAddress || 'N/A'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1 md:mt-0">
                                                <div className="hidden md:flex gap-2">
                                                    <span className="px-1.5 py-0.5 rounded bg-surface border border-outline-variant/20 text-[10px] font-bold text-on-surface uppercase">Blocks: Active</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-surface border border-outline-variant/20 text-[10px] font-bold text-on-surface uppercase">Latency: 1.2s</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional info footer */}
                                    <div className="flex items-center gap-2 p-2.5 rounded bg-primary/5 border border-primary/10 mt-3">
                                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
                                        <p className="text-[10px] md:text-[11px] text-on-surface-variant font-medium leading-tight">
                                            You do not need to manually refresh. Once your transaction is finalized on the blockchain, our multi-signature custodian system updates your balance automatically.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: Account Overview & Details */}
                        <aside className="lg:col-span-4 flex flex-col gap-2.5 md:gap-6 mt-2 md:mt-0">
                            <section className="hidden md:flex glass-card rounded-xl p-2.5 md:p-5 flex-col gap-3 md:gap-4 border border-outline-variant/20">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Current Wealth</span>
                                    <span className="text-xl md:text-3xl font-mono font-bold text-on-surface tracking-tight">
                                        {totalBalance !== null
                                            ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : <span className="text-outline/50 text-lg">Loading…</span>}
                                    </span>
                                </div>
                                <div className="h-px bg-outline-variant/20 w-full"></div>
                                <div className="flex flex-col gap-2.5 md:gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Deposit Fee</span>
                                        <span className="text-[11px] md:text-sm font-mono font-bold text-on-surface">{depositFee.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Daily Limit</span>
                                        <span className="text-[11px] md:text-sm font-mono font-bold text-on-surface">$500,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">KYC Status</span>
                                        {kycStatus === 'approved' ? (
                                            <span className="text-[10px] md:text-xs font-bold text-tertiary flex items-center gap-1 uppercase tracking-wider bg-tertiary/10 px-1.5 py-0.5 rounded border border-tertiary/20">
                                                <span className="material-symbols-outlined text-[14px]">verified</span>Verified
                                            </span>
                                        ) : kycStatus === 'pending' ? (
                                            <span className="text-[10px] md:text-xs font-bold text-secondary flex items-center gap-1 uppercase tracking-wider bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/20">
                                                <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>Pending
                                            </span>
                                        ) : kycStatus === 'rejected' ? (
                                            <span className="text-[10px] md:text-xs font-bold text-error flex items-center gap-1 uppercase tracking-wider bg-error/10 px-1.5 py-0.5 rounded border border-error/20">
                                                <span className="material-symbols-outlined text-[14px]">cancel</span>Rejected
                                            </span>
                                        ) : (
                                            <span className="text-[10px] md:text-xs font-bold text-outline uppercase tracking-wider">Not submitted</span>
                                        )}
                                    </div>
                                </div>
                            </section>
                            
                            <section className="hidden md:block glass-card rounded-xl p-2.5 md:p-5 bg-primary/5 border border-primary/20">
                                <h3 className="text-[11px] md:text-sm font-bold text-primary mb-1.5 md:mb-2 uppercase tracking-wide">OTC Support Desk</h3>
                                <p className="text-[10px] md:text-xs font-medium text-on-surface-variant leading-relaxed mb-2.5 md:mb-4">Assistance available for high-volume OTC deposits or corporate fund transfers.</p>
                                <button className="w-full py-2.5 md:py-3 border border-primary/50 text-primary rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all">
                                    Contact Desk
                                </button>
                            </section>
                            
                            <div className="hidden md:flex glass-card rounded-xl p-2.5 md:p-5 overflow-hidden relative border border-outline-variant/20 items-center gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] md:text-[24px]">security</span>
                                </div>
                                <div>
                                    <h3 className="text-[11px] md:text-sm font-bold text-on-surface mb-0.5">Multi-Sig Custody</h3>
                                    <p className="text-[9px] md:text-[10px] font-medium text-on-surface-variant leading-snug">Secured in MPC cold storage with insurance coverage.</p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Bottom: Deposit History */}
                    <section className="glass-card rounded-xl overflow-hidden mt-2.5 md:mt-8 border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 flex justify-between items-center border-b border-outline-variant/10">
                            <h2 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-wide flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">history</span>
                                Deposit History
                            </h2>
                            <div className="flex gap-1.5 md:gap-2">
                                <button className="text-[9px] md:text-[10px] font-bold bg-surface-container-low border border-outline-variant/50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-on-surface uppercase tracking-wider">All Time</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-surface-container-highest/20 text-[9px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">Date &amp; Time</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">Asset</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3 text-right">Amount</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">TXID</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs md:text-sm divide-y divide-outline-variant/5">
                                    {historyLoading ? (
                                        <tr><td colSpan={5} className="px-5 py-8 text-center text-outline text-sm">Loading…</td></tr>
                                    ) : deposits.length === 0 ? (
                                        <tr><td colSpan={5} className="px-5 py-10 text-center">
                                            <span className="material-symbols-outlined text-[32px] text-outline/30 block mb-2">inbox</span>
                                            <span className="text-[11px] text-outline/50 uppercase tracking-wider font-bold">No deposit history yet</span>
                                        </td></tr>
                                    ) : deposits.map(tx => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-2.5 py-2 md:px-5 md:py-4 text-[10px] md:text-sm font-bold text-on-surface whitespace-nowrap">{fmtDate(tx.created_at)}</td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    {assetIcon(tx.asset)}
                                                    <span className="text-[11px] md:text-sm font-bold">{tx.asset.toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4 text-[11px] md:text-sm text-on-surface font-bold text-right">
                                                {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                            </td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4 text-[11px] md:text-xs text-primary font-bold">{truncateTx(tx.destination_address)}</td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4 text-center">
                                                {tx.status === 'completed' && (
                                                    <span className="inline-block px-2 py-0.5 rounded bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Completed</span>
                                                )}
                                                {tx.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>Pending
                                                    </span>
                                                )}
                                                {tx.status === 'failed' && (
                                                    <span className="inline-block px-2 py-0.5 rounded bg-error/10 border border-error/20 text-error text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Failed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-2.5 md:p-4 border-t border-outline-variant/10 text-center bg-surface-container-highest/10">
                            <button className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-wider">View All History</button>
                        </div>
                    </section>
        </div>
    );
}
