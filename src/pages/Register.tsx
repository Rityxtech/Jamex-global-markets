import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthBackground from '../components/AuthBackground';

export default function Register() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [otpError, setOtpError] = useState('');
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef<HTMLInputElement[]>([]);

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
    const [errorMsg, setErrorMsg] = useState('');
    const [showReferral, setShowReferral] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Form validation
    const isFormValid = formData.fullName.trim() !== '' && 
                       formData.email.trim() !== '' && 
                       formData.password.trim() !== '' && 
                       formData.confirmPassword.trim() !== '' && 
                       formData.password === formData.confirmPassword &&
                       formData.password.length >= 8 &&
                       formData.terms;

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || isSuccess) return;
        
        setErrorMsg('');
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (formData.password.length < 8) {
            setErrorMsg('Password must be at least 8 characters');
            return;
        }

        setIsProcessing(true);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        referral_code: formData.referral,
                    }
                }
            });

            if (error) {
                setErrorMsg(error.message);
                setIsProcessing(false);
                return;
            }

            // Signup succeeded — show OTP step
            setIsProcessing(false);
            setStep('otp');
            setTimer(59);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);

        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred during signup');
            setIsProcessing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    // OTP handlers
    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        setOtpError('');
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (text.length === 6 && !isNaN(Number(text))) {
            setOtp(text.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setOtpError('Please enter all 6 digits.');
            return;
        }

        setIsProcessing(true);
        setOtpError('');

        try {
            // Verify OTP using Supabase email OTP method
            const { error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: enteredOtp,
                type: 'signup',
            });

            if (error) {
                setIsProcessing(false);
                setOtpError('Invalid verification code. Please try again.');
                return;
            }

            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            setIsProcessing(false);
            setOtpError(err.message || 'Verification failed. Try again.');
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setOtp(new Array(6).fill(''));
        setOtpError('');
        setTimer(59);

        try {
            await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
            });
        } catch (_) {
            // Silently handle; can show toast in future
        }
        inputRefs.current[0]?.focus();
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setErrorMsg('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) {
                setErrorMsg(error.message);
                setGoogleLoading(false);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
            setGoogleLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#0B1120] border border-outline-variant/50 rounded text-on-surface pl-9 py-2.5 font-body-md focus:ring-0 focus:outline-none focus:shadow-[0_0_12px_rgba(37,99,235,0.3)] focus:border-primary transition-all placeholder:text-outline/50 text-sm";
    const getIconColor = (id: string) => focusedInput === id ? 'text-primary' : 'text-on-surface-variant';

    function getPasswordStrength(pw: string) {
        let score = 0;
        if (!pw || pw.length < 4) return { score: 0, label: '' };
        if (pw.length >= 8) score++;
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['bg-error', 'bg-yellow-500', 'bg-primary', 'bg-emerald-500'];
        return { score, label: labels[score - 1] || '', color: colors[score - 1] || 'bg-error' };
    }

    return (
        <div className="auth-page min-h-screen overflow-auto flex flex-col font-body-md text-on-surface selection:bg-primary-container selection:text-white dark relative"
             style={{ overflowX: 'hidden' }}>
            <AuthBackground />

            <main className="flex-grow flex items-center justify-center px-4 py-6 sm:py-8 relative z-10">
                {/* Center Registration Card */}
                <div className="w-full max-w-[460px] bg-[#111827]/85 backdrop-blur-xl border border-white/15 rounded-xl overflow-hidden shadow-2xl relative -translate-y-[20px] sm:translate-y-0">
                    
                    {/* Glass Header */}
                    <div className="bg-white/5 px-4 py-2.5 sm:px-6 sm:py-4 border-b border-outline-variant/30 relative z-10">
                        <h1 className="text-xl md:text-2xl font-bold text-on-surface">
                            {step === 'form' ? 'Institutional Onboarding' : 'Verify Your Email'}
                        </h1>
                        <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">
                            {step === 'form'
                                ? 'Access Tier-1 liquidity and global asset markets.'
                                : `Enter the 6-digit code sent to ${formData.email}`
                            }
                        </p>
                    </div>

                    {step === 'form' ? (
                        /* ====== REGISTRATION FORM ====== */
                        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 relative z-10">
                            {errorMsg && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {errorMsg}
                                </div>
                            )}
                            
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="fullName">Full Legal Name</label>
                                <div className="relative">
                                    <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${getIconColor('fullName')}`}>person</span>
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
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Institutional Email</label>
                                <div className="relative">
                                    <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${getIconColor('email')}`}>mail</span>
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
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${getIconColor('password')}`}>lock</span>
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
                                    {formData.password && (
                                        <div>
                                            <div className="flex gap-0.5 mt-0.5">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className={`h-[3px] flex-1 rounded-full transition-colors ${i <= getPasswordStrength(formData.password).score ? getPasswordStrength(formData.password).color : 'bg-surface-container-highest'}`} />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-bold text-on-surface-variant mt-0.5 leading-none">{getPasswordStrength(formData.password).label}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="confirmPassword">Confirm</label>
                                    <div className="relative">
                                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${getIconColor('confirmPassword')}`}>verified_user</span>
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

                            {/* Referral Code (Optional) */}
                            {!showReferral ? (
                                <div className="flex justify-start py-1">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowReferral(true)}
                                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                                        Have a referral code?
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="referral">Referral Code</label>
                                        <button 
                                            type="button" 
                                            onClick={() => { setShowReferral(false); setFormData(prev => ({ ...prev, referral: '' })); }} 
                                            className="text-[10px] text-error hover:underline cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${getIconColor('referral')}`}>confirmation_number</span>
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
                            )}

                            {/* Consent */}
                            <div className="flex items-start gap-2.5 py-1">
                                <div className="flex items-center h-4 mt-0.5">
                                    <input 
                                        className="w-4 h-4 rounded border-outline-variant/50 bg-[#0B1120] text-primary focus:ring-primary/20 cursor-pointer" 
                                        id="terms" 
                                        required 
                                        type="checkbox"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                    />
                                </div>
                                <label className="text-xs font-bold text-on-surface-variant leading-tight" htmlFor="terms">
                                    I agree to the <Link className="text-primary hover:underline transition-all" to="#">Terms</Link> and <Link className="text-primary hover:underline transition-all" to="#">Privacy Policy</Link> regarding data.
                                </label>
                            </div>

                            {/* Divider */}
                            <div className="relative my-3 sm:my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-outline-variant/30"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-bold">
                                    <span className="bg-[#111827] px-3 text-on-surface-variant">OR SECURE AUTHENTICATOR</span>
                                </div>
                            </div>
                            
                            {/* SSO / Alternative Registration */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading}
                                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors text-xs font-medium text-on-surface cursor-pointer ${googleLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {googleLoading ? (
                                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    )}
                                    {googleLoading ? 'Redirecting...' : 'Google SSO'}
                                </button>
                                <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors text-xs font-medium text-on-surface cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">passkey</span>
                                    Passkey
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-1">
                                <button 
                                    disabled={isProcessing || isSuccess || !isFormValid}
                                    className={`w-full font-bold text-sm py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                                        isProcessing || isSuccess ? 'bg-primary-container text-on-primary-container brightness-75 cursor-wait' :
                                        !isFormValid ? 'bg-surface-container-lowest text-on-surface-variant/50 cursor-not-allowed border border-outline-variant/30' :
                                        'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-[0.98]'
                                    }`} 
                                    type="submit"
                                >
                                    {isProcessing ? (
                                        <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Processing...</>
                                    ) : isSuccess ? (
                                        <><span className="material-symbols-outlined text-[18px]">check_circle</span> Success</>
                                    ) : !isFormValid ? (
                                        <>Complete All Required Fields <span className="material-symbols-outlined text-[18px]">lock</span></>
                                    ) : (
                                        <>Create Institutional Account <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                                    )}
                                </button>
                                <p className="text-center text-xs font-bold text-on-surface-variant">
                                    Already have an account? <Link className="text-primary hover:text-white transition-colors" to="/login">Login</Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* ====== OTP VERIFICATION STEP ====== */
                        <form onSubmit={handleOtpVerify} className="p-5 sm:p-6 space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            
                            {/* Email icon and description */}
                            <div className="flex flex-col items-center gap-2 text-center pt-1">
                                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs">
                                    A 6-digit authorization code has been dispatched to your registered email. Enter it below to activate your account.
                                </p>
                            </div>

                            {otpError && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {otpError}
                                </div>
                            )}

                            {/* 6-digit OTP Grid */}
                            <div className="grid grid-cols-6 gap-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => { if (el) inputRefs.current[idx] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                        onPaste={idx === 0 ? handlePaste : undefined}
                                        className="w-full aspect-square bg-[#0B1120]/80 border border-outline-variant/60 rounded-lg text-center text-xl font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                ))}
                            </div>

                            {/* Success visual when done */}
                            {isSuccess && (
                                <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300">
                                    <span className="material-symbols-outlined text-success text-3xl">check_circle</span>
                                    <p className="text-xs text-on-surface-variant">Account activated! Launching dashboard...</p>
                                </div>
                            )}

                            {/* Verify Button */}
                            <button 
                                disabled={isProcessing || isSuccess}
                                className={`w-full font-bold text-sm py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                                    isProcessing || isSuccess ? 'bg-primary-container brightness-75 text-on-primary-container cursor-wait' : 
                                    'bg-primary-container hover:brightness-110 active:scale-[0.98] text-on-primary-container'
                                }`}
                                type="submit"
                            >
                                {isProcessing ? (
                                    <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Verifying...</>
                                ) : (
                                    <>Activate Account <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                                )}
                            </button>

                            {/* Resend & Edit email row */}
                            <div className="flex justify-between items-center text-xs">
                                <button 
                                    type="button"
                                    className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-all"
                                    onClick={() => { setStep('form'); setOtp(new Array(6).fill('')); setOtpError(''); }}
                                >
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                    Edit Details
                                </button>
                                {timer > 0 ? (
                                    <span className="text-on-surface-variant font-medium">Resend in {timer}s</span>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="text-primary hover:underline font-bold"
                                        onClick={handleResendOtp}
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary to-transparent"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
