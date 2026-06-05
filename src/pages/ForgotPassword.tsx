import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthBackground from '../components/AuthBackground';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'sent'>('email');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;

        setIsProcessing(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setErrorMsg(error.message);
                setIsProcessing(false);
                return;
            }

            setIsProcessing(false);
            setStep('sent');
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to send reset email');
            setIsProcessing(false);
        }
    };

    const handleResend = async () => {
        setIsProcessing(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) setErrorMsg(error.message);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to resend email');
        }

        setIsProcessing(false);
    };

    return (
        <div className="auth-page h-screen overflow-hidden flex flex-col font-body-md text-on-surface selection:bg-primary-container selection:text-white dark relative">
            {/* Custom Background Image */}
            <AuthBackground />

            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center py-2 px-3 sm:py-4 sm:px-4 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Institutional Security Badge */}
                    <div className="hidden sm:flex justify-center mb-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-md">
                            <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Institutional Grade Security</span>
                        </div>
                    </div>

                    {/* Forgot Password Card */}
                    <div className="bg-[#111827]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                        
                        {/* Card Header */}
                        <div className="bg-[#1f293b]/25 border-b border-outline-variant/10 px-4 py-2.5 sm:px-6 sm:py-3.5">
                            <h1 className="text-xl md:text-2xl font-bold text-on-surface">Terminal Reset</h1>
                            <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">
                                {step === 'email' ? 'Recover portfolio access credentials.' : 'Verify authorization credentials.'}
                            </p>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-4 sm:p-5">
                            {errorMsg && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mb-3.5">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {errorMsg}
                                </div>
                            )}

                            {step === 'email' ? (
                                <form className="space-y-3.5" onSubmit={handleEmailSubmit}>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="email">
                                            <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                                            Institutional Email
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5 sm:py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm"
                                            id="email"
                                            name="email"
                                            placeholder="name@firm.com"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className={`w-full font-medium text-sm py-2 sm:py-2.5 rounded shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
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
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Reset Link</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="pt-2 text-center">
                                        <Link className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1.5 transition-all" to="/login">
                                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-4 py-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary text-3xl">mail</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-on-surface mb-1">Check your email</h3>
                                        <p className="text-xs text-on-surface-variant leading-relaxed max-w-[260px]">
                                            We sent a password reset link to <strong className="text-on-surface">{email}</strong>. Click the link in the email to set a new password.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isProcessing}
                                        className="text-xs font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Resending…' : 'Didn\'t receive it? Resend'}
                                    </button>
                                    <button
                                        type="button"
                                        className="text-xs text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-all"
                                        onClick={() => setStep('email')}
                                    >
                                        <span className="material-symbols-outlined text-[14px]">edit</span>
                                        Use a different email
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
