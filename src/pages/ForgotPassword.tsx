import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [timer, setTimer] = useState(59);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;
        
        setIsProcessing(true);
        setErrorMsg('');
        
        // Simulate sending OTP to email
        setTimeout(() => {
            setIsProcessing(false);
            setStep('otp');
            setTimer(59);
            // Autofocus first digit box
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }, 1200);
    };

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // keep only last digit
        setOtp(newOtp);

        setErrorMsg('');

        // Shift focus to next input box
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // Focus previous digit
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (text.length === 6 && !isNaN(Number(text))) {
            const digits = text.split('');
            setOtp(digits);
            inputRefs.current[5]?.focus();
        }
    };

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setErrorMsg('Please enter all 6 digits.');
            return;
        }

        setIsProcessing(true);
        setErrorMsg('');

        // Verify OTP - accepts any 6 digits for testing, or standard 123456 code
        setTimeout(() => {
            setIsProcessing(false);
            if (enteredOtp === '123456' || enteredOtp !== '') { 
                // Redirect user to the new reset-password page with email query param
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            } else {
                setErrorMsg('Invalid verification code. Try again.');
            }
        }, 1200);
    };

    const handleResendOtp = () => {
        if (timer > 0) return;
        setOtp(new Array(6).fill(''));
        setTimer(59);
        setErrorMsg('');
        // Focus first element
        inputRefs.current[0]?.focus();
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
                                    {/* Input Group */}
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

                                    {/* Primary Action */}
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
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Verification OTP</span>
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
                                /* OTP Verification Screen */
                                <form className="space-y-4" onSubmit={handleOtpVerify}>
                                    <div className="text-center mb-1">
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            We sent a 6-digit OTP code to <strong className="text-on-surface">{email}</strong>. Enter the code below.
                                        </p>
                                    </div>

                                    {/* 6 Digits OTP Grid */}
                                    <div className="grid grid-cols-6 gap-2 py-1">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => { if (el) inputRefs.current[idx] = el; }}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target.value, idx)}
                                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                                onPaste={idx === 0 ? handlePaste : undefined}
                                                className="w-full bg-[#0B1120]/75 border border-outline-variant/60 rounded py-2 sm:py-2.5 text-center text-lg font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all"
                                            />
                                        ))}
                                    </div>

                                    {/* Verification button */}
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
                                                Verifying OTP...
                                            </>
                                        ) : (
                                            <>
                                                <span>Verify Authorization Code</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Resend details */}
                                    <div className="flex justify-between items-center pt-1 text-xs">
                                        <button 
                                            type="button"
                                            className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-all"
                                            onClick={() => setStep('email')}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">edit</span>
                                            Edit Email
                                        </button>
                                        {timer > 0 ? (
                                            <span className="text-on-surface-variant font-medium">
                                                Resend in {timer}s
                                            </span>
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
