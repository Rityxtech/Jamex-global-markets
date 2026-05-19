import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;
        
        setIsProcessing(true);
        // Simulate API Call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 1500);
    };

    const handleResend = () => {
        setIsSuccess(false);
        setEmail('');
    };

    return (
        <div className="deep-mesh-bg min-h-screen flex flex-col font-body-md text-on-surface overflow-x-hidden dark">
            {/* Top Navigation Bar (Logo only for focus) */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Jamex Global Markets</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">security</span>
                        <span>Support</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center px-4 py-24 relative">
                {/* Decorative Ambient Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                {/* Forgot Password Card */}
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-outline-variant/50 w-full max-w-[440px] p-8 md:p-10 rounded-xl relative z-10 overflow-hidden shadow-2xl">
                    
                    {/* Glass Header Decor */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                    
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/30 mb-6 border border-secondary-container/50">
                                    <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                                </div>
                                <h1 className="text-3xl font-bold text-on-surface mb-3">Forgot Password</h1>
                                <p className="text-base text-on-surface-variant leading-relaxed">
                                    Enter your registered email address to receive a password reset link.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Input Group */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                        </div>
                                        <input 
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline-variant/60 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                                            id="email" 
                                            name="email" 
                                            placeholder="name@company.com" 
                                            required 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Primary Action */}
                                <button 
                                    className={`w-full font-medium text-sm py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                                        isProcessing ? 'bg-primary-container brightness-75 text-on-primary-container cursor-wait' : 'bg-primary-container hover:bg-inverse-primary text-on-primary-container'
                                    }`}
                                    disabled={isProcessing} 
                                    type="submit"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Reset Link</span>
                                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                            
                            {/* Secondary Actions */}
                            <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col items-center gap-4">
                                <Link className="text-sm font-medium text-primary hover:text-on-secondary-container flex items-center gap-2 transition-colors" to="/login">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div className="absolute inset-0 bg-[#0d1322] z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                            <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-tertiary text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-on-surface mb-2">Check your email</h2>
                            <p className="text-base text-on-surface-variant mb-8 leading-relaxed">
                                We've sent a password recovery link to your email address. Please check your inbox and spam folder.
                            </p>
                            <button className="text-sm font-medium text-primary underline cursor-pointer hover:opacity-80 transition-opacity" onClick={handleResend}>
                                Did not receive? Resend
                            </button>
                        </div>
                    )}
                </div>

                {/* Security Badge */}
                <div className="absolute bottom-8 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-default hidden sm:flex">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-xs font-bold tracking-widest uppercase">Institutional Grade Encryption</span>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/20 bg-surface-dim mt-auto relative z-10">
                <p className="text-xs font-bold text-on-surface-variant text-center md:text-left">© 2024 Jamex Global Markets. Institutional Grade Security.</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Privacy Policy</Link>
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Terms of Service</Link>
                    <Link className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors" to="#">Cookie Settings</Link>
                </div>
            </footer>
        </div>
    );
}
