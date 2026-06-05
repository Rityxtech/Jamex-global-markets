import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthBackground from '../components/AuthBackground';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [noSession, setNoSession] = useState(false);

    useEffect(() => {
        const handleRecovery = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setErrorMsg('Invalid or expired reset link. Please try again.');
                    setNoSession(true);
                    return;
                }
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) setNoSession(true);
        };

        handleRecovery();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsProcessing(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                setIsProcessing(false);
                setErrorMsg(error.message);
                return;
            }

            setIsProcessing(false);
            setIsSuccess(true);
            await supabase.auth.signOut();
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (err: any) {
            setIsProcessing(false);
            setErrorMsg(err.message || 'Failed to update password');
        }
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

                    {/* Reset Password Card */}
                    <div className="bg-[#111827]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                        
                        {/* Card Header */}
                        <div className="bg-[#1f293b]/25 border-b border-outline-variant/10 px-4 py-2.5 sm:px-6 sm:py-3.5">
                            <h1 className="text-xl md:text-2xl font-bold text-on-surface">Reset Password</h1>
                            <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">
                                Set a new security password for {email ? <strong className="text-on-surface">{email}</strong> : 'your portfolio'}.
                            </p>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-4 sm:p-5">
                            {errorMsg && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mb-3.5 animate-in fade-in duration-300">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {errorMsg}
                                </div>
                            )}

                            {noSession && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-3 rounded-lg text-sm font-bold flex flex-col items-center gap-2 mb-3.5 animate-in fade-in duration-300 text-center">
                                    <span className="material-symbols-outlined text-[20px]">error</span>
                                    <span>Invalid or expired reset session. Please start from <Link to="/forgot-password" className="underline">Forgot Password</Link>.</span>
                                </div>
                            )}

                            {!isSuccess ? (
                                <form className="space-y-3.5" onSubmit={handleSubmit}>
                                    
                                    {/* New Password Field */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between px-1" htmlFor="password">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                                New Password
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input 
                                                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5 sm:py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm" 
                                                id="password" 
                                                name="password" 
                                                placeholder="Minimum 8 characters" 
                                                required 
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="confirmPassword">
                                            <span className="material-symbols-outlined text-[16px]">lock</span>
                                            Confirm New Password
                                        </label>
                                        <input 
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5 sm:py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm" 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            placeholder="Retype password" 
                                            required 
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    {/* Primary Action */}
                                    <button 
                                        className={`w-full font-medium text-sm py-2 sm:py-2.5 rounded shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                                            isProcessing || noSession ? 'bg-primary-container brightness-75 text-on-primary-container cursor-wait' : 'bg-primary-container hover:bg-inverse-primary text-on-primary-container'
                                        }`}
                                        disabled={isProcessing || noSession} 
                                        type="submit"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating Password...
                                            </>
                                        ) : (
                                            <>
                                                <span>Update Password</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {/* Secondary Action */}
                                    <div className="pt-2 text-center">
                                        <Link className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1.5 transition-all" to="/login">
                                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            ) : (
                                /* Success State */
                                <div className="flex flex-col items-center justify-center text-center py-4 animate-in fade-in duration-500">
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-success text-2xl animate-bounce">check_circle</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-on-surface mb-1.5">Password Updated</h2>
                                    <p className="text-xs text-on-surface-variant mb-6 max-w-xs leading-relaxed">
                                        Your password has been reset successfully. Redirecting you to terminal access...
                                    </p>
                                    <div className="w-full flex justify-center">
                                        <span className="material-symbols-outlined animate-spin text-xl text-primary">progress_activity</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
