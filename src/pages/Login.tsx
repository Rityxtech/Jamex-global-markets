import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import AuthBackground from '../components/AuthBackground';

export default function Login() {
    const navigate = useNavigate();
    const { profile, authError: storeAuthError, setAuthError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [googleLoading, setGoogleLoading] = useState(false);

    // Form validation
    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    useEffect(() => {
        setAuthError(null);
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
                const { data: profile } = await supabase.from('profiles').select('account_status').eq('id', authData.user.id).single();
                
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
            }

            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                if (profile?.is_admin) {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 1000);
        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred during login');
            setIsProcessing(false);
        }
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

    const gradient1 = `radial-gradient(circle at ${20 + (mousePos.x * 10)}% ${30 + (mousePos.y * 10)}%, rgba(37, 99, 235, 0.15) 0%, transparent 40%)`;
    const gradient2 = `radial-gradient(circle at ${80 - (mousePos.x * 10)}% ${70 - (mousePos.y * 10)}%, rgba(30, 58, 138, 0.25) 0%, transparent 50%)`;
    const baseGradient = `radial-gradient(circle at 50% 50%, rgba(13, 19, 34, 1) 0%, rgba(8, 14, 29, 1) 100%)`;

    return (
        <div 
            className="auth-page text-on-surface font-body-md selection:bg-primary/30 selection:text-primary min-h-screen overflow-auto flex flex-col dark relative"
            style={{ transition: 'background-image 0.2s ease-out' }}
        >
            <AuthBackground />
            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 -translate-y-[45px] sm:translate-y-0">
                    
                    {/* Institutional Security Badge */}
                    <div className="hidden sm:flex justify-center mb-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-md">
                            <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Institutional Grade Security</span>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-[#111827]/85 backdrop-blur-xl border border-white/15 rounded-xl overflow-hidden shadow-2xl relative">
                        {/* Card Header */}
                        <div className="bg-[#1f293b]/25 border-b border-outline-variant/10 px-4 py-2.5 sm:px-6 sm:py-3.5">
                            <h1 className="text-xl md:text-2xl font-bold text-on-surface">Terminal Access</h1>
                            <p className="text-xs md:text-sm font-medium text-on-surface-variant mt-0.5">Authenticate to access your global portfolio.</p>
                        </div>
                        
                        {/* Form */}
                        <div className="p-5 sm:p-6">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {(errorMsg || storeAuthError) && (
                                    <div className="bg-error/10 border border-error/50 text-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined">error</span>
                                        {errorMsg || storeAuthError}
                                    </div>
                                )}
                                {/* Email Field */}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                {/* Password Field */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5" htmlFor="password">
                                            <span className="material-symbols-outlined text-[16px]">lock</span>
                                            Access Key
                                        </label>
                                        <Link className="text-[11px] font-bold text-primary hover:underline" to="/forgot-password">Forgot Password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 pr-10 text-sm" 
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
                                <div className="flex items-center gap-2 py-1">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary cursor-pointer" id="remember" type="checkbox"/>
                                    <label className="text-xs font-bold text-on-surface-variant cursor-pointer" htmlFor="remember">Recognize this device for 30 days</label>
                                </div>
                                
                                {/* Primary Button */}
                                <button 
                                    disabled={isProcessing || isSuccess || !isFormValid}
                                    className={`w-full font-bold text-base py-3 rounded-lg flex items-center justify-center gap-2 shadow-md group transition-all ${
                                        isProcessing || isSuccess ? 'bg-primary-container text-on-primary-container brightness-75 cursor-wait' :
                                        !isFormValid ? 'bg-surface-container-lowest text-on-surface-variant/50 cursor-not-allowed border border-outline-variant/30' :
                                        'bg-primary-container hover:bg-primary-container/90 active:scale-[0.98] text-on-primary-container cursor-pointer'
                                    }`} 
                                    type="submit"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Authenticating...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Success
                                        </>
                                    ) : !isFormValid ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">lock</span>
                                            Enter Email & Password
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
                                            Secure Login
                                        </>
                                    )}
                                </button>
                            </form>
                            
                            {/* Divider */}
                            <div className="relative my-3 sm:my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-outline-variant/30"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-bold">
                                    <span className="bg-[#111827] px-3 text-on-surface-variant">OR SECURE AUTHENTICATOR</span>
                                </div>
                            </div>
                            
                            {/* SSO / Alternative Login */}
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
                            
                            {/* Footer Links */}
                            <div className="mt-3 sm:mt-4 text-center space-y-1.5">
                                <p className="text-xs font-medium text-on-surface-variant">
                                    Don't have an account?
                                    <Link className="text-primary font-bold hover:underline ml-1 transition-colors" to="/register">Request Access</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
