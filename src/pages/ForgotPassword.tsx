import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
import AuthBackground from '../components/AuthBackground';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // OTP state
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [otpError, setOtpError] = useState('');
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Password state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'code' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;

        setIsProcessing(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || 'Failed to send verification code');
                setIsProcessing(false);
                return;
            }

            setIsProcessing(false);
            setStep('code');
            setTimer(59);
            setOtp(new Array(6).fill(''));
            setOtpError('');
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to send verification code');
            setIsProcessing(false);
        }
    };

    const handleResend = async () => {
        if (step === 'code' && timer > 0) return;
        setIsProcessing(true);
        setErrorMsg('');
        setOtpError('');

        try {
            const response = await fetch(`${API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || 'Failed to resend code');
            } else {
                setTimer(59);
                setOtp(new Array(6).fill(''));
                setTimeout(() => inputRefs.current[0]?.focus(), 100);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Failed to resend code');
        }

        setIsProcessing(false);
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
            const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: enteredOtp }),
            });
            const data = await response.json();

            if (!response.ok) {
                setIsProcessing(false);
                setOtpError(data.error || 'Invalid verification code. Please try again.');
                return;
            }

            setIsProcessing(false);
            setStep('password');
        } catch (err: any) {
            setIsProcessing(false);
            setOtpError(err.message || 'Verification failed. Try again.');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
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
            const enteredOtp = otp.join('');
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: enteredOtp, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setIsProcessing(false);
                setErrorMsg(data.error || 'Failed to update password');
                return;
            }

            setIsProcessing(false);
            setStep('success');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            setIsProcessing(false);
            setErrorMsg(err.message || 'Failed to update password');
        }
    };

    const subheading =
        step === 'email'
            ? 'Recover portfolio access credentials.'
            : step === 'code'
            ? 'Enter the 6-digit code sent to your email.'
            : step === 'password'
            ? 'Set a new security password.'
            : 'Password updated successfully.';

    return (
        <div className="auth-page min-h-screen overflow-auto flex flex-col font-body-md text-on-surface selection:bg-primary-container selection:text-white dark relative">
            {/* Custom Background Image */}
            <AuthBackground />

            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Institutional Security Badge */}
                    <div className="hidden sm:flex justify-center mb-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-md">
                            <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Institutional Grade Security</span>
                        </div>
                    </div>

                    {/* Forgot Password Card */}
                    <div className="bg-[#111827]/85 backdrop-blur-xl border border-white/15 rounded-xl overflow-hidden shadow-2xl relative -translate-y-[40px] sm:translate-y-0">

                        {/* Card Header */}
                        <div className="bg-[#1f293b]/25 border-b border-outline-variant/10 px-4 py-2.5 sm:px-6 sm:py-3.5">
                            <h1 className="text-xl md:text-2xl font-bold text-on-surface">Terminal Reset</h1>
                            <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">{subheading}</p>
                        </div>

                        {/* Form Content */}
                        <div className="p-5 sm:p-6">
                            {errorMsg && (
                                <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 mb-3.5">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {errorMsg}
                                </div>
                            )}

                            {step === 'email' && (
                                <form className="space-y-4" onSubmit={handleEmailSubmit}>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="email">
                                            <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                                            Institutional Email
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm"
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
                                        className={`w-full font-medium text-sm py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
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
                                                Sending Code...
                                            </>
                                        ) : (
                                            <>
                                                <span>Send 6-Digit Code</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="pt-3 text-center">
                                        <Link className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1.5 transition-all" to="/login">
                                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            )}

                            {step === 'code' && (
                                <form className="space-y-5" onSubmit={handleOtpVerify}>
                                    <div className="text-center">
                                        <p className="text-xs text-on-surface-variant mb-3">
                                            Enter the 6-digit code sent to <strong className="text-on-surface">{email}</strong>
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    onPaste={handlePaste}
                                                    className="w-10 h-12 text-center bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-lg font-bold"
                                                />
                                            ))}
                                        </div>
                                        {otpError && (
                                            <p className="text-error text-xs font-bold mt-2">{otpError}</p>
                                        )}
                                    </div>

                                    <button
                                        className={`w-full font-medium text-sm py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                                            isProcessing ? 'bg-primary-container brightness-75 text-on-primary-container cursor-wait' : 'bg-primary-container hover:bg-inverse-primary text-on-primary-container'
                                        }`}
                                        disabled={isProcessing || otp.join('').length < 6}
                                        type="submit"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <span>Verify Code</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex flex-col items-center gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isProcessing || timer > 0}
                                            className="text-xs font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {timer > 0 ? `Resend in ${timer}s` : "Didn't receive it? Resend"}
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
                                </form>
                            )}

                            {step === 'password' && (
                                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between px-1" htmlFor="password">
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                                New Password
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm"
                                                id="password"
                                                name="password"
                                                placeholder="Minimum 8 characters"
                                                required
                                                type={showPassword ? 'text' : 'password'}
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
                                        {password && (
                                            <div>
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {[1,2,3,4].map(i => (
                                                        <div key={i} className={`h-[3px] flex-1 rounded-full transition-colors ${i <= getPasswordStrength(password).score ? getPasswordStrength(password).color : 'bg-surface-container-highest'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-[10px] font-bold text-on-surface-variant mt-0.5 leading-none">{getPasswordStrength(password).label}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="confirmPassword">
                                            <span className="material-symbols-outlined text-[16px]">lock</span>
                                            Confirm New Password
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Retype password"
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className={`w-full font-medium text-sm py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${
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
                                                Updating Password...
                                            </>
                                        ) : (
                                            <>
                                                <span>Update Password</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {step === 'success' && (
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
