import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { supabase } from '../lib/supabase';

interface ProfileData {
    full_name: string;
    avatar_url: string | null;
    referral_code: string | null;
    created_at: string | null;
}

interface KycStatus {
    status: string;
}

interface WalletAddress {
    id: string;
    network: string;
    label: string;
    address: string;
    status: string;
}

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { settings, fetchSettings, updateSetting } = useSettingsStore();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [kyc, setKyc] = useState<KycStatus | null>(null);
    const [wallets, setWallets] = useState<WalletAddress[]>([]);
    const [loadingWallets, setLoadingWallets] = useState(false);

    // Edit Profile Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Wallet Modal
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
    const [walletForm, setWalletForm] = useState({ network: 'ethereum', label: '', address: '' });
    const [savingWallet, setSavingWallet] = useState(false);

    // Copy feedback
    const [copyFeedback, setCopyFeedback] = useState(false);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            supabase.from('profiles').select('full_name, avatar_url, referral_code, created_at').eq('id', user.id).single(),
            supabase.from('kyc_submissions').select('status').eq('user_id', user.id).maybeSingle(),
        ]).then(([pRes, kRes]) => {
            if (pRes.data) setProfile(pRes.data as ProfileData);
            if (kRes.data) setKyc(kRes.data as KycStatus);
        });
        fetchSettings(user.id);
        setLoadingWallets(true);
        supabase.from('wallet_addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data, error }) => {
            if (!error && data) setWallets(data as WalletAddress[]);
            setLoadingWallets(false);
        });
    }, [user, fetchSettings]);

    const fetchWallets = async () => {
        if (!user) return;
        setLoadingWallets(true);
        const { data, error } = await supabase.from('wallet_addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (!error && data) setWallets(data as WalletAddress[]);
        setLoadingWallets(false);
    };

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const kycVerified = kyc?.status === 'approved';
    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '—';

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSavingProfile(true);
        setSaveError('');
        setSaveSuccess(false);
        try {
            let avatarUrl = profile?.avatar_url || null;
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop() || 'png';
                const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
                const { error: upError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
                if (upError) {
                    throw new Error(upError.message || 'Failed to upload avatar');
                }
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
                avatarUrl = urlData.publicUrl;
            }
            const updates: any = {};
            if (editName.trim()) updates.full_name = editName.trim();
            if (avatarUrl !== profile?.avatar_url) updates.avatar_url = avatarUrl;

            if (Object.keys(updates).length > 0) {
                const { data: updated, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
                if (error) throw new Error(error.message || 'Failed to update profile');
                if (updated) {
                    setProfile(updated as ProfileData);
                    useAuthStore.getState().setProfile(updated);
                }
            }
            setSaveSuccess(true);
            setTimeout(() => {
                setShowEditModal(false);
                setAvatarFile(null);
                setAvatarPreview(null);
                setSaveSuccess(false);
            }, 1200);
        } catch (err: any) {
            setSaveError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSavingProfile(false);
        }
    };

    const copyReferralCode = () => {
        if (!profile?.referral_code) return;
        navigator.clipboard.writeText(profile.referral_code);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const openWalletModal = (wallet?: WalletAddress) => {
        if (wallet) {
            setEditingWalletId(wallet.id);
            setWalletForm({ network: wallet.network, label: wallet.label, address: wallet.address });
        } else {
            setEditingWalletId(null);
            setWalletForm({ network: 'ethereum', label: '', address: '' });
        }
        setShowWalletModal(true);
    };

    const handleSaveWallet = async () => {
        if (!user || !walletForm.address.trim() || !walletForm.label.trim()) return;
        setSavingWallet(true);
        try {
            if (editingWalletId) {
                await supabase.from('wallet_addresses').update({
                    network: walletForm.network,
                    label: walletForm.label.trim(),
                    address: walletForm.address.trim(),
                }).eq('id', editingWalletId);
            } else {
                await supabase.from('wallet_addresses').insert({
                    user_id: user.id,
                    network: walletForm.network,
                    label: walletForm.label.trim(),
                    address: walletForm.address.trim(),
                });
            }
            await fetchWallets();
            setShowWalletModal(false);
        } finally {
            setSavingWallet(false);
        }
    };

    const handleDeleteWallet = async (id: string) => {
        if (!confirm('Are you sure you want to delete this wallet address?')) return;
        await supabase.from('wallet_addresses').delete().eq('id', id);
        await fetchWallets();
    };

    const networkIcon = (network: string) => {
        switch (network) {
            case 'ethereum': return { symbol: 'Ξ', color: 'primary' };
            case 'bitcoin': return { symbol: '₿', color: 'secondary' };
            case 'usdt': return { symbol: '₮', color: 'tertiary' };
            case 'bnb': return { symbol: 'B', color: 'primary' };
            default: return { symbol: '◈', color: 'primary' };
        }
    };

    const formatAddress = (addr: string) => addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

    return (
        <div className="flex-1 p-4 md:p-margin-desktop space-y-4 md:space-y-6 max-w-[1600px] mx-auto w-full mb-12">
                    

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-gutter">
                        {/* Profile Identity Card */}
                        <section className="lg:col-span-12 glass-card rounded-xl overflow-hidden relative group border border-outline-variant/20">
                            <div className="h-14 md:h-32 w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-container/40 to-secondary-container/20"></div>
                                <img alt="Institutional Header" className="w-full h-full object-cover opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS-TDbO2hbpVDtUFouSg9_eQBVbxo6hYtGg0Bcdnp08tsr8-uV-Jpd8-Vj6-7MB7-wak9BZ53SQSCkJ1pJnEpmqk-ekfSQnXlQKa4CaxD9BB4Ke4N3O46pmRwQtv17XKOrIhlI-FlOQBYIGPNjFI4MAU47Miw6EzaUSGwhj_6fA2KhakOnRfyK3qyjPH0odhB6e0Gs23UhQ9JGuPT-bsVAHuj42gwDFka7vTpfupcRlMSiBIYPJGAJl80Q52I4Tuj3gRSWrfu_KExx" />
                            </div>
                            <div className="px-4 pb-2 md:px-card-padding md:pb-card-padding flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-6 -mt-7 md:-mt-12 relative z-10">
                                <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl glass-card border-2 md:border-4 border-background p-1 bg-surface-container shadow-lg flex items-center justify-center overflow-hidden">
                                    {profile?.avatar_url
                                        ? <img alt="User Profile" className="w-full h-full object-cover rounded-lg" src={profile.avatar_url} />
                                        : <span className="text-4xl md:text-5xl font-bold text-primary select-none">{displayName.charAt(0).toUpperCase()}</span>
                                    }
                                </div>
                                <div className="flex-1 pb-1 md:pb-4 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 mb-2 md:mb-1">
                                        <h2 className="text-xl md:text-headline-md font-bold text-on-surface tracking-tight">{displayName}</h2>
                                        {kycVerified && (
                                            <span className="bg-tertiary-container/20 text-tertiary text-[9px] md:text-label-sm font-bold px-2 py-0.5 md:px-3 md:py-1 rounded border border-tertiary/30 w-max flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px] md:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                                KYC VERIFIED
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-label-md font-bold text-on-surface-variant">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px] md:text-[18px]">fingerprint</span>
                                            <span className="font-tabular-nums">UID: {user?.id.substring(0,12).toUpperCase() || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px] md:text-[18px]">calendar_today</span>
                                            <span>Joined: {joinDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto md:pb-4 mt-2 md:mt-0">
                                    <button 
                                        onClick={() => { setEditName(profile?.full_name || ''); setShowEditModal(true); }}
                                        className="w-full md:w-auto bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-2 border border-outline-variant/30"
                                    >
                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">edit</span>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Account Information */}
                        <section className="lg:col-span-7 glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-label-md font-bold tracking-wide text-on-surface uppercase">Account Information</h3>
                            </div>
                            <div className="p-4 md:p-card-padding grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Display Name</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface font-medium">
                                        {displayName}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Email Address</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface flex items-center justify-between">
                                        <span className="font-medium truncate">{user?.email || '—'}</span>
                                        <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Referral Code</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface font-medium flex items-center justify-between">
                                        <span className="font-tabular-nums">{profile?.referral_code || '—'}</span>
                                        <button 
                                            onClick={copyReferralCode}
                                            className="material-symbols-outlined text-outline/50 hover:text-primary text-[16px] transition-colors relative"
                                            title="Copy"
                                        >
                                            {copyFeedback ? 'check' : 'content_copy'}
                                        </button>
                                    </div>
                                    {copyFeedback && (
                                        <p className="text-[10px] md:text-xs text-tertiary font-medium">Copied to clipboard!</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* KYC Status Summary */}
                        <section className="lg:col-span-5 flex flex-col">
                            <div className="glass-card rounded-xl p-4 md:p-card-padding flex-1 border border-outline-variant/20 flex flex-col">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Identity Verification</h3>
                                    {kycVerified ? (
                                        <span className="text-[10px] md:text-xs text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded uppercase border border-tertiary/20">Verified</span>
                                    ) : kyc?.status === 'pending' ? (
                                        <span className="text-[10px] md:text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">Pending</span>
                                    ) : (
                                        <span className="text-[10px] md:text-xs text-on-surface-variant font-bold bg-surface-container-highest px-2 py-0.5 rounded uppercase border border-outline-variant/30">Not Submitted</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                        </div>
                                        <div>
                                            <p className="text-sm md:text-base font-bold text-on-surface">KYC Verification</p>
                                            <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">
                                                {kycVerified
                                                    ? 'Your identity has been verified. You have full access to all features.'
                                                    : kyc?.status === 'pending'
                                                    ? 'Your documents are under review. This usually takes 1-3 business days.'
                                                    : 'Complete identity verification to unlock deposits, withdrawals, and investments.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-outline-variant/10">
                                    <button
                                        onClick={() => navigate('/kyc')}
                                        className="w-full bg-surface-container-high text-on-surface py-2.5 md:py-3 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant transition-all border border-outline-variant/30 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{kycVerified ? 'visibility' : 'assignment'}</span>
                                        {kycVerified ? 'View KYC Details' : 'Complete Verification'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Security Quick Stats */}
                        <section className="lg:col-span-12 glass-card rounded-xl p-4 md:p-card-padding border border-outline-variant/20">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Security Level</h3>
                                <span className="text-[10px] md:text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">
                                    {(settings?.two_factor_enabled && settings?.withdrawal_whitelist_enabled) ? 'Maximum' : (settings?.two_factor_enabled || settings?.withdrawal_whitelist_enabled) ? 'Advanced' : 'Standard'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div className="flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => updateSetting('two_factor_enabled', !(settings?.two_factor_enabled ?? false))}>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-bold text-on-surface leading-tight">Two-Factor Auth</p>
                                        <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">{settings?.two_factor_enabled ? 'Active via Authenticator' : 'Not enabled'}</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[24px] md:text-[28px] transition-colors ${settings?.two_factor_enabled ? 'text-tertiary' : 'text-outline/30'}`}>{settings?.two_factor_enabled ? 'toggle_on' : 'toggle_off'}</span>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => updateSetting('withdrawal_whitelist_enabled', !(settings?.withdrawal_whitelist_enabled ?? false))}>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px]">key</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-bold text-on-surface leading-tight">Withdrawal Whitelist</p>
                                        <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">{settings?.withdrawal_whitelist_enabled ? 'Enabled for verified addrs' : 'Disabled'}</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-[24px] md:text-[28px] transition-colors ${settings?.withdrawal_whitelist_enabled ? 'text-primary' : 'text-outline/30'}`}>{settings?.withdrawal_whitelist_enabled ? 'toggle_on' : 'toggle_off'}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-6 pt-4 border-t border-outline-variant/10">
                                <button onClick={() => navigate('/settings')} className="w-full md:w-auto bg-surface-container-high text-on-surface px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant transition-all border border-outline-variant/30 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Manage Security
                                </button>
                            </div>
                        </section>

                        {/* Wallet Addresses */}
                        <section className="lg:col-span-12 glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Verified Wallet Addresses</h3>
                                <button 
                                    onClick={() => openWalletModal()}
                                    className="flex items-center gap-1.5 text-primary text-[11px] md:text-label-sm font-bold hover:underline self-start sm:self-auto w-max bg-primary/10 px-2 py-1 rounded"
                                >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Add New
                                </button>
                            </div>
                            <div className="overflow-x-auto scrollbar-hide">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/10 bg-surface-container-highest/20">
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Network</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Label</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Address</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Status</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5 text-xs md:text-sm">
                                        {loadingWallets ? (
                                            <tr><td colSpan={5} className="px-4 py-6 text-center text-on-surface-variant">Loading wallets...</td></tr>
                                        ) : wallets.length === 0 ? (
                                            <tr><td colSpan={5} className="px-4 py-6 text-center text-on-surface-variant">No wallet addresses added yet.</td></tr>
                                        ) : wallets.map((w) => {
                                            const nic = networkIcon(w.network);
                                            const statusColor = w.status === 'verified' ? 'tertiary' : w.status === 'rejected' ? 'error' : 'on-surface-variant';
                                            return (
                                                <tr key={w.id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 md:px-card-padding">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-5 h-5 md:w-6 md:h-6 bg-${nic.color}/20 rounded-full flex items-center justify-center`}>
                                                                <span className={`text-[10px] md:text-[12px] font-bold text-${nic.color}`}>{nic.symbol}</span>
                                                            </div>
                                                            <span className="font-bold text-on-surface capitalize">{w.network}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 md:px-card-padding text-on-surface-variant">{w.label}</td>
                                                    <td className="px-4 py-3 md:px-card-padding">
                                                        <code className="font-tabular-nums bg-surface-container px-1.5 py-0.5 rounded text-primary text-[10px] md:text-[12px] border border-outline-variant/20">{formatAddress(w.address)}</code>
                                                    </td>
                                                    <td className="px-4 py-3 md:px-card-padding">
                                                        <span className={`text-${statusColor} text-[10px] md:text-xs font-bold flex items-center gap-1 capitalize`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full bg-${statusColor} ${w.status === 'verified' ? 'shadow-[0_0_5px_rgba(78,222,163,0.8)]' : ''}`}></span> {w.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 md:px-card-padding text-right">
                                                        <button onClick={() => openWalletModal(w)} className="text-on-surface-variant hover:text-primary transition-colors material-symbols-outlined text-[16px] md:text-[20px] mr-2">edit</button>
                                                        <button onClick={() => handleDeleteWallet(w.id)} className="text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[16px] md:text-[20px]">delete</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
                    <div className="bg-surface-container-highest rounded-xl border border-outline-variant/30 w-full max-w-md p-4 md:p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="text-base md:text-lg font-bold text-on-surface">Edit Profile</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:text-error material-symbols-outlined">close</button>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-outline-variant/30 bg-surface-container flex items-center justify-center overflow-hidden relative">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                                >
                                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                    Change Photo
                                </button>
                            </div>
                            {saveError && (
                                <div className="text-error text-xs font-medium bg-error/10 border border-error/20 p-2 rounded-lg">{saveError}</div>
                            )}
                            {saveSuccess && (
                                <div className="text-tertiary text-xs font-medium bg-tertiary/10 border border-tertiary/20 p-2 rounded-lg flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Profile updated successfully!
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Display Name</label>
                                <input 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Your display name"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={savingProfile || saveSuccess}
                                    className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {savingProfile ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                                </button>
                                <button 
                                    onClick={() => { setShowEditModal(false); setSaveError(''); setSaveSuccess(false); setAvatarFile(null); setAvatarPreview(null); }}
                                    className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-lg text-sm font-bold border border-outline-variant/30 hover:bg-surface-variant transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wallet Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWalletModal(false)}>
                    <div className="bg-surface-container-highest rounded-xl border border-outline-variant/30 w-full max-w-md p-4 md:p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="text-base md:text-lg font-bold text-on-surface">{editingWalletId ? 'Edit Wallet' : 'Add Wallet Address'}</h3>
                            <button onClick={() => setShowWalletModal(false)} className="text-on-surface-variant hover:text-error material-symbols-outlined">close</button>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Network</label>
                                <select 
                                    value={walletForm.network}
                                    onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value })}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                >
                                    <option value="ethereum">Ethereum</option>
                                    <option value="bitcoin">Bitcoin</option>
                                    <option value="usdt">USDT (TRC20/ERC20)</option>
                                    <option value="bnb">BNB Smart Chain</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Label</label>
                                <input 
                                    value={walletForm.label}
                                    onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="e.g. Main Ledger, Cold Storage"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Wallet Address</label>
                                <input 
                                    value={walletForm.address}
                                    onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                                    placeholder="0x... or bc1..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleSaveWallet}
                                    disabled={savingWallet || !walletForm.address.trim() || !walletForm.label.trim()}
                                    className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {savingWallet ? 'Saving...' : (editingWalletId ? 'Update' : 'Add Address')}
                                </button>
                                <button 
                                    onClick={() => setShowWalletModal(false)}
                                    className="flex-1 bg-surface-container-high text-on-surface py-2.5 rounded-lg text-sm font-bold border border-outline-variant/30 hover:bg-surface-variant transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
