import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { supabase } from '../lib/supabase';

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { 
        settings, 
        loading, 
        fetchSettings, 
        updateSetting, 
        updateNotificationPref,
        setupRealtimeSubscriptions,
        unsubscribe 
    } = useSettingsStore();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchSettings(user.id);
            setupRealtimeSubscriptions(user.id);
        }
        return () => {
            unsubscribe();
        };
    }, [user, fetchSettings, setupRealtimeSubscriptions, unsubscribe]);

    const handlePasswordUpdate = async () => {
        if (!newPassword) {
            setPasswordMessage('Please enter a new password.');
            return;
        }
        try {
            setPasswordMessage('Updating...');
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setPasswordMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setTimeout(() => setPasswordMessage(''), 3000);
        } catch (err: any) {
            setPasswordMessage(`Error: ${err.message}`);
        }
    };

    if (loading && !settings) {
        return <div className="p-8 text-center text-on-surface-variant">Loading settings...</div>;
    }

    // Default fallbacks while settings load
    const twoFactor = settings?.two_factor_enabled ?? false;
    const dateFormat = settings?.date_format ?? 'MM/DD/YYYY';
    const baseCurrency = settings?.base_currency ?? 'USD - US Dollar';
    const timezone = settings?.timezone ?? '(GMT -05:00) Eastern Time';
    const notifs = settings?.notification_preferences || {
        market_execution_email: true,
        market_execution_push: true,
        wallet_email: true,
        wallet_push: false,
        security_email: true,
        security_push: true,
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1600px] mx-auto w-full mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 md:gap-gutter">
                {/* Security Section */}
                <section className="lg:col-span-2 space-y-2.5 md:space-y-gutter">
                    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-1.5 md:px-card-padding md:py-3 border-b border-outline-variant/10">
                            <h2 className="text-[10px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-[14px] md:text-[20px]">security</span>
                                Security & Authentication
                            </h2>
                        </div>
                        <div className="px-2.5 py-1.5 md:p-card-padding space-y-2 md:space-y-6">
                            {/* 2FA Toggle */}
                            <div className="flex items-center justify-between py-1 md:py-1.5 border-b border-outline-variant/10 pb-2 md:pb-3">
                                <div>
                                    <p className="text-xs md:text-body-md font-bold text-on-surface mb-0.5">Two-Factor Authentication (2FA)</p>
                                    <p className="text-[8px] md:text-label-sm font-medium text-on-surface-variant">Protect your account with an extra layer of security.</p>
                                </div>
                                <div className="relative inline-block w-8 h-4 md:w-12 md:h-6 transition duration-200 ease-in-out shrink-0">
                                    <input 
                                        checked={twoFactor} 
                                        onChange={(e) => updateSetting('two_factor_enabled', e.target.checked)}
                                        className="absolute block w-4 h-4 md:w-6 md:h-6 rounded-full bg-surface-bright border-2 border-transparent appearance-none cursor-pointer z-10 transition-transform duration-200 checked:translate-x-4 md:checked:translate-x-6" 
                                        id="toggle-2fa" 
                                        type="checkbox"
                                        style={{backgroundColor: twoFactor ? '#2563eb' : '#33394a'}}
                                    />
                                    <label className="block overflow-hidden h-4 md:h-6 rounded-full bg-surface-container-highest cursor-pointer border border-outline-variant/20" htmlFor="toggle-2fa"></label>
                                </div>
                            </div>
                            
                            {/* Password Change */}
                            <div className="space-y-1.5 md:space-y-4">
                                <p className="text-xs md:text-body-md font-bold text-on-surface">Change Password</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-4">
                                    <div className="space-y-0.5 md:space-y-1">
                                        <label className="text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Current Password</label>
                                        <input 
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2.5 py-1 md:px-4 md:py-2.5 text-xs md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                                            placeholder="••••••••" 
                                            type="password" 
                                        />
                                    </div>
                                    <div className="space-y-0.5 md:space-y-1">
                                        <label className="text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
                                        <input 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2.5 py-1 md:px-4 md:py-2.5 text-xs md:text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                                            placeholder="••••••••" 
                                            type="password" 
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-1 md:mt-2">
                                    <button 
                                        onClick={handlePasswordUpdate}
                                        className="w-full md:w-auto bg-primary text-on-primary px-3 py-1.5 md:px-6 md:py-2.5 rounded-lg text-[9px] md:text-label-md font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 shadow-sm shadow-primary/20"
                                    >
                                        Update Password
                                    </button>
                                    {passwordMessage && (
                                        <span className="text-[10px] md:text-sm font-medium text-primary">{passwordMessage}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-card-padding md:py-3 border-b border-outline-variant/10">
                            <h2 className="text-[10px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-[14px] md:text-[20px]">notifications_active</span>
                                Notification Channels
                            </h2>
                        </div>
                        <div className="p-0 overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[320px]">
                                <thead className="border-b border-outline-variant/10 bg-surface-container-highest/20">
                                    <tr>
                                        <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Activity Type</th>
                                        <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-center">Email</th>
                                        <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-center">Push</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-[10px] md:text-body-md font-medium text-on-surface">Market Execution Alerts</td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.market_execution_email} 
                                                onChange={(e) => updateNotificationPref('market_execution_email', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.market_execution_push} 
                                                onChange={(e) => updateNotificationPref('market_execution_push', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-[10px] md:text-body-md font-medium text-on-surface">Wallet Deposits & Withdrawals</td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.wallet_email} 
                                                onChange={(e) => updateNotificationPref('wallet_email', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.wallet_push} 
                                                onChange={(e) => updateNotificationPref('wallet_push', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-[10px] md:text-body-md font-medium text-on-surface">Security Login Notifications</td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.security_email} 
                                                onChange={(e) => updateNotificationPref('security_email', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                        <td className="px-2.5 py-2 md:px-card-padding md:py-4 text-center">
                                            <input 
                                                checked={notifs.security_push} 
                                                onChange={(e) => updateNotificationPref('security_push', e.target.checked)}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/50 cursor-pointer" type="checkbox" 
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Preferences Sidebar */}
                <aside className="space-y-2.5 md:space-y-gutter">
                    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-1.5 md:px-card-padding md:py-3 border-b border-outline-variant/10">
                            <h2 className="text-[10px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-[14px] md:text-[20px]">tune</span>
                                Display Preferences
                            </h2>
                        </div>
                        <div className="px-2.5 py-1.5 md:p-card-padding space-y-2 md:space-y-6">
                            <div className="space-y-0.5 md:space-y-1">
                                <label className="text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Base Currency</label>
                                <select 
                                    value={baseCurrency}
                                    onChange={(e) => updateSetting('base_currency', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2.5 py-1 md:px-4 md:py-2.5 text-xs md:text-base font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                                    <option>USD - US Dollar</option>
                                    <option>EUR - Euro</option>
                                    <option>GBP - British Pound</option>
                                </select>
                            </div>
                            <div className="space-y-0.5 md:space-y-1">
                                <label className="text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Timezone</label>
                                <select 
                                    value={timezone}
                                    onChange={(e) => updateSetting('timezone', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2.5 py-1 md:px-4 md:py-2.5 text-xs md:text-base font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                                    <option>(GMT -05:00) Eastern Time</option>
                                    <option>(GMT +00:00) UTC / London</option>
                                    <option>(GMT +08:00) HKT / Hong Kong</option>
                                </select>
                            </div>
                            <div className="space-y-0.5 md:space-y-1">
                                <label className="text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Date Format</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateSetting('date_format', 'MM/DD/YYYY')}
                                        className={`flex-1 py-1 md:py-1.5 text-[8px] md:text-label-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${dateFormat === 'MM/DD/YYYY' ? 'border border-primary text-primary bg-primary/10 shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-primary/50'}`}>
                                        MM/DD/YYYY
                                    </button>
                                    <button 
                                        onClick={() => updateSetting('date_format', 'DD/MM/YYYY')}
                                        className={`flex-1 py-1 md:py-1.5 text-[8px] md:text-label-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${dateFormat === 'DD/MM/YYYY' ? 'border border-primary text-primary bg-primary/10 shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-primary/50'}`}>
                                        DD/MM/YYYY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Support Widget */}
                    <div className="glass-card rounded-xl p-2.5 md:p-card-padding flex flex-col items-center text-center gap-2.5 md:gap-4 border border-primary/30 bg-primary/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                        <div className="p-1.5 md:p-3 bg-primary/10 border border-primary/20 rounded-full relative z-10">
                            <span className="material-symbols-outlined text-primary text-[20px] md:text-[32px]">support_agent</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs md:text-body-md font-bold text-on-surface tracking-wide">Institutional Concierge</h3>
                            <p className="text-[8px] md:text-label-sm font-medium text-on-surface-variant mt-1 leading-snug px-1 md:px-2">Need assistance with advanced configuration? Specialists available 24/7.</p>
                        </div>
                        <button onClick={() => navigate('/support')} className="w-full md:w-auto bg-transparent border border-primary/50 text-primary px-4 py-2 rounded-lg text-[9px] md:text-label-md font-bold uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all active:scale-95 relative z-10 mt-1">Contact Advisor</button>
                    </div>
                </aside>
            </div>

            {/* Danger Zone */}
            <div className="mt-2.5 md:mt-gutter glass-card rounded-xl overflow-hidden border border-error/30">
                <div className="bg-error/10 px-2.5 py-2 md:px-card-padding py-3 border-b border-error/20 flex items-center gap-1.5 md:gap-2">
                    <span className="material-symbols-outlined text-error text-[14px] md:text-[20px]">warning</span>
                    <h2 className="text-[10px] md:text-label-md font-bold text-error uppercase tracking-wide">Danger Zone</h2>
                </div>
                <div className="p-2.5 md:p-card-padding flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 md:gap-4">
                    <div>
                        <p className="text-xs md:text-body-md font-bold text-on-surface mb-0.5">Deactivate Institutional Account</p>
                        <p className="text-[8px] md:text-label-sm font-medium text-on-surface-variant leading-snug">Temporarily disable access to all markets and wealth management tools.</p>
                    </div>
                    <button className="bg-transparent border border-error/50 text-error px-4 py-2 rounded-lg text-[9px] md:text-label-md font-bold uppercase tracking-wider hover:bg-error hover:text-on-error transition-all active:scale-95 w-full sm:w-auto whitespace-nowrap mt-1 sm:mt-0">Deactivate</button>
                </div>
            </div>
        </div>
    );
}
