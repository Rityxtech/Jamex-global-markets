import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthBackground from '../components/AuthBackground';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || isSuccess) return;

        setIsProcessing(true);
        setErrorMsg('');

        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setErrorMsg(error.message);
                setIsProcessing(false);
                return;
            }

            if (authData.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('account_status, is_admin')
                    .eq('id', authData.user.id)
                    .single();

                if (profile && profile.account_status === 'suspended') {
                    await supabase.auth.signOut();
                    setErrorMsg('Your account has been suspended. Please contact support.');
                    setIsProcessing(false);
                    return;
                }

                if (profile && profile.account_status === 'blocked') {
                    await supabase.auth.signOut();
                    setErrorMsg('Your account has been permanently blocked. Access denied.');
                    setIsProcessing(false);
                    return;
                }

                if (!profile || !profile.is_admin) {
                    await supabase.auth.signOut();
                    setErrorMsg('Administrator access denied. This portal is restricted to authorized personnel only.');
                    setIsProcessing(false);
                    return;
                }
            }

            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 1000);
        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred during login');
            setIsProcessing(false);
        }
    };

    return (
        <div
            className="auth-page text-on-surface font-body-md selection:bg-primary/30 selection:text-primary h-screen overflow-hidden flex flex-col dark relative"
            style={{ transition: 'background-image 0.2s ease-out' }}
        >
            <AuthBackground />
            <main className="flex-grow flex items-center justify-center py-2 px-3 sm:py-4 sm:px-4 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Admin Security Badge */}
                    <div className="hidden sm:flex justify-center mb-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-error/10 rounded-full border border-error/20 shadow-md">
                            <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-error">Restricted Admin Portal</span>
                        </div>
                    </div>

                    {/* Admin Login Card */}
                    <div className="bg-[#111827]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                        {/* Card Header */}
                        <div className="bg-[#1f293b]/25 border-b border-outline-variant/10 px-4 py-2.5 sm:px-6 sm:py-3.5">
                            <h1 className="text-xl md:text-2xl font-bold text-on-surface">Administrator Access</h1>
                            <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">Secure administrative terminal for platform management.</p>
                        </div>

                        {/* Form */}
                        <div className="p-5 sm:p-6">
                            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                                {errorMsg && (
                                    <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined">error</span>
                                        {errorMsg}
                                    </div>
                                )}
                                {/* Email Field */}
                                <div className="space-y-0.5 sm:space-y-1">
                                    <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="email">
                                        <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                                        Admin Email
                                    </label>
                                    <input
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 sm:py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 text-sm"
                                        id="email"
                                        name="email"
                                        placeholder="admin@jamex.com"
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-0.5 sm:space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="password">
                                            <span className="material-symbols-outlined text-[16px]">lock</span>
                                            Access Key
                                        </label>
                                        <Link className="text-[11px] font-bold text-primary hover:underline" to="/forgot-password">Forgot Password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 sm:py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 pr-10 text-sm"
                                            id="password"
                                            name="password"
                                            placeholder="••••••••••••"
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center gap-2 py-0">
                                    <input className="w-3.5 h-3.5 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary cursor-pointer" id="remember" type="checkbox"/>
                                    <label className="text-[11px] font-bold text-on-surface-variant cursor-pointer" htmlFor="remember">Recognize this device for 30 days</label>
                                </div>

                                {/* Primary Button */}
                                <button
                                    disabled={isProcessing || isSuccess || !isFormValid}
                                    className={`w-full font-bold text-base py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md group transition-all ${
                                        isProcessing || isSuccess ? 'bg-error text-on-error brightness-75 cursor-wait' :
                                        !isFormValid ? 'bg-surface-container-lowest text-on-surface-variant/50 cursor-not-allowed border border-outline-variant/30' :
                                        'bg-error hover:bg-error/90 active:scale-[0.98] text-on-error cursor-pointer'
                                    }`}
                                    type="submit"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Authenticating...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Access Granted
                                        </>
                                    ) : !isFormValid ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">lock</span>
                                            Enter Admin Credentials
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                                            Secure Admin Login
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="mt-4 sm:mt-5 text-center">
                                <p className="text-xs font-medium text-on-surface-variant">
                                    Not an administrator?
                                    <Link className="text-primary font-bold hover:underline ml-1 transition-colors" to="/login">User Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
