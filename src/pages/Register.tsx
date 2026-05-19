import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        referral: '',
        terms: false
    });
    
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || isSuccess) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            // In a real app, we would navigate to dashboard or login
            setTimeout(() => navigate('/dashboard'), 1500);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const inputClasses = "w-full bg-[#0B1120] border border-outline-variant/50 rounded text-on-surface pl-10 py-3 font-body-md focus:ring-0 focus:outline-none focus:shadow-[0_0_12px_rgba(37,99,235,0.3)] focus:border-primary transition-all placeholder:text-outline/50";

    const getIconColor = (id: string) => focusedInput === id ? 'text-primary' : 'text-on-surface-variant';

    return (
        <div className="deep-mesh-bg min-h-screen flex flex-col font-body-md text-on-surface selection:bg-primary-container selection:text-white dark"
             style={{ overflowX: 'hidden' }}>

            {/* Navigation Shell */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface/40 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Jamex Global Markets</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">language</span>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">security</span>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-24">
                {/* Center Registration Card */}
                <div className="w-full max-w-[480px] bg-[#111827]/80 backdrop-blur-xl border border-outline-variant/50 rounded-xl overflow-hidden shadow-2xl relative">
                    
                    {/* Glass Header */}
                    <div className="bg-white/5 px-8 py-6 border-b border-outline-variant/30 relative z-10">
                        <h1 className="text-2xl font-bold text-on-surface">Institutional Onboarding</h1>
                        <p className="text-sm font-medium text-on-surface-variant mt-1">Access Tier-1 liquidity and global asset markets.</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5 relative z-10">
                        
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="fullName">Full Legal Name</label>
                            <div className="relative">
                                <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${getIconColor('fullName')}`}>person</span>
                                <input 
                                    className={inputClasses} 
                                    id="fullName" 
                                    placeholder="Johnathan Doe" 
                                    required 
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('fullName')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Institutional Email</label>
                            <div className="relative">
                                <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${getIconColor('email')}`}>mail</span>
                                <input 
                                    className={inputClasses} 
                                    id="email" 
                                    placeholder="name@corporation.com" 
                                    required 
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </div>
                        </div>

                        {/* Password Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                                <div className="relative">
                                    <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${getIconColor('password')}`}>lock</span>
                                    <input 
                                        className={inputClasses} 
                                        id="password" 
                                        placeholder="••••••••" 
                                        required 
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="confirmPassword">Confirm</label>
                                <div className="relative">
                                    <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${getIconColor('confirmPassword')}`}>verified_user</span>
                                    <input 
                                        className={inputClasses} 
                                        id="confirmPassword" 
                                        placeholder="••••••••" 
                                        required 
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('confirmPassword')}
                                        onBlur={() => setFocusedInput(null)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Referral Code */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="referral">Referral Code (Optional)</label>
                            <div className="relative">
                                <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${getIconColor('referral')}`}>confirmation_number</span>
                                <input 
                                    className={inputClasses} 
                                    id="referral" 
                                    placeholder="EX: GLOBAL-2024" 
                                    type="text"
                                    value={formData.referral}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('referral')}
                                    onBlur={() => setFocusedInput(null)}
                                />
                            </div>
                        </div>

                        {/* Consent */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="flex items-center h-5">
                                <input 
                                    className="h-4 w-4 rounded border-outline-variant/50 bg-[#0B1120] text-primary focus:ring-primary/20 cursor-pointer" 
                                    id="terms" 
                                    required 
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                />
                            </div>
                            <label className="text-xs font-bold text-on-surface-variant leading-tight" htmlFor="terms">
                                I agree to the <Link className="text-primary hover:underline transition-all" to="#">Terms of Service</Link> and <Link className="text-primary hover:underline transition-all" to="#">Privacy Policy</Link> regarding institutional data handling.
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-2">
                            <button 
                                disabled={isProcessing || isSuccess}
                                className={`w-full font-bold text-[16px] py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                                    isProcessing ? 'bg-primary-container text-on-primary-container brightness-75 cursor-wait' :
                                    isSuccess ? 'bg-tertiary-container text-on-tertiary-container' :
                                    'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-[0.98]'
                                }`} 
                                type="submit"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <span className="material-symbols-outlined">check_circle</span> Account Initialized
                                    </>
                                ) : (
                                    <>
                                        Create Institutional Account
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-sm font-bold text-on-surface-variant">
                                Already have an account? <Link className="text-primary hover:text-white transition-colors" to="/login">Login</Link>
                            </p>
                        </div>
                    </form>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary to-transparent"></div>
                    </div>
                </div>
            </main>

            {/* Footer Cluster */}
            <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/20 bg-surface-dim mt-auto z-10 relative">
                <span className="text-sm font-bold text-on-surface">Jamex Global Markets</span>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Privacy Policy</Link>
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Terms of Service</Link>
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Regulatory Disclosures</Link>
                </div>
                <p className="text-xs font-bold text-on-surface-variant text-center md:text-left">© 2024 Jamex Global Markets. Institutional Grade Security.</p>
            </footer>
        </div>
    );
}
