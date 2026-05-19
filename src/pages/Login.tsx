import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing || isSuccess) return;
        
        setIsProcessing(true);
        // Artificial delay to simulate secure handshake
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        }, 2000);
    };

    const gradient1 = `radial-gradient(circle at ${20 + (mousePos.x * 10)}% ${30 + (mousePos.y * 10)}%, rgba(37, 99, 235, 0.15) 0%, transparent 40%)`;
    const gradient2 = `radial-gradient(circle at ${80 - (mousePos.x * 10)}% ${70 - (mousePos.y * 10)}%, rgba(30, 58, 138, 0.25) 0%, transparent 50%)`;
    const baseGradient = `radial-gradient(circle at 50% 50%, rgba(13, 19, 34, 1) 0%, rgba(8, 14, 29, 1) 100%)`;

    return (
        <div 
            className="deep-mesh-bg text-on-surface font-body-md selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col dark"
            style={{ transition: 'background-image 0.2s ease-out' }}
        >
            {/* TopNavBar Simplified for Auth */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
                <div className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                    Jamex Global Markets
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">language</span>
                        <span>English</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                        <span>Security</span>
                    </div>
                    <button className="text-sm font-bold text-primary border-b-2 border-primary pb-1 hover:opacity-80 transition-all cursor-pointer">
                        Support
                    </button>
                </div>
            </nav>

            {/* Main Content Canvas */}
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Institutional Security Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/20 shadow-lg">
                            <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Institutional Grade Security</span>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl overflow-hidden shadow-2xl relative">
                        {/* Card Header */}
                        <div className="bg-[#1f293b]/50 border-b border-outline-variant/10 px-8 py-6">
                            <h1 className="text-2xl font-bold text-on-surface">Terminal Access</h1>
                            <p className="text-sm font-medium text-on-surface-variant mt-1">Authenticate to access your global portfolio.</p>
                        </div>
                        
                        {/* Form */}
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2" htmlFor="email">
                                        <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                                        Institutional Email
                                    </label>
                                    <input 
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50" 
                                        id="email" 
                                        name="email" 
                                        placeholder="name@firm.com" 
                                        required 
                                        type="email"
                                    />
                                </div>
                                
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2" htmlFor="password">
                                            <span className="material-symbols-outlined text-[18px]">lock</span>
                                            Access Key
                                        </label>
                                        <Link className="text-xs font-bold text-primary hover:underline" to="/forgot-password">Forgot Password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-outline/50 pr-12" 
                                            id="password" 
                                            name="password" 
                                            placeholder="••••••••••••" 
                                            required 
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <button 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer" 
                                            onClick={() => setShowPassword(!showPassword)} 
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Remember Me */}
                                <div className="flex items-center gap-3 py-1">
                                    <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary cursor-pointer" id="remember" type="checkbox"/>
                                    <label className="text-xs font-bold text-on-surface-variant cursor-pointer" htmlFor="remember">Recognize this device for 30 days</label>
                                </div>
                                
                                {/* Primary Button */}
                                <button 
                                    disabled={isProcessing || isSuccess}
                                    className={`w-full font-bold text-lg py-4 rounded-lg flex items-center justify-center gap-3 shadow-lg group transition-all ${
                                        isProcessing ? 'bg-primary-container text-on-primary-container brightness-75 cursor-wait' :
                                        isSuccess ? 'bg-tertiary-container text-on-tertiary-container' :
                                        'bg-primary-container hover:bg-primary-container/90 active:scale-[0.98] text-on-primary-container cursor-pointer'
                                    }`} 
                                    type="submit"
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span> Success
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
                                            Secure Login
                                        </>
                                    )}
                                </button>
                            </form>
                            
                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-outline-variant/30"></span>
                                </div>
                                <div className="relative flex justify-center text-xs font-bold">
                                    <span className="bg-[#111827] px-4 text-on-surface-variant">OR SECURE AUTHENTICATOR</span>
                                </div>
                            </div>
                            
                            {/* SSO / Alternative Login */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors text-sm font-medium text-on-surface cursor-pointer">
                                    <img alt="SSO" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLWxS0cUdE7Je0mU-akvae3IYcQXjdd7_mBbn9KM_0VrOSuE98l0CKFMTfmil0MPXcBdeRsE847cNC_T9hFOyyc4YY3QPZ7-HRZogE5lDLyxEbPabE55ryvUe4WLEur5d3VSeEAMBkmPBbPkK-Padr7pvbWKcJsOb5VKkbI0stkmj3DRjBxTBwStQRvSkfeLwN40Rw5vFvK6QluLAAC3Ecj9mqo6onwYuLndhkgN0d49qR_t5ffAeyN4cFmYtVrYmdBzM4TghUOpYU"/>
                                    Google SSO
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors text-sm font-medium text-on-surface cursor-pointer">
                                    <span className="material-symbols-outlined text-[20px]">passkey</span>
                                    Passkey
                                </button>
                            </div>
                            
                            {/* Footer Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm font-medium text-on-surface-variant">
                                    Don't have an account? 
                                    <Link className="text-primary font-bold hover:underline ml-1 transition-colors" to="/register">Request Access</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contextual Image */}
                    <div className="mt-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 flex justify-center">
                        <div className="relative w-full h-24 rounded-xl overflow-hidden">
                            <img alt="Network" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3aJImszNnkFiUw3K0Q1iw6ofu-6CPAmtOupNjg_zRTiAduTP0dShbXY6f1joOsiDEIYRmpDXK-285ErbPRAqlbd2KJuEAXUAggk_H_ebupSQ-7zLG64OWYFII9nUssGghs7OhTJ7ysQMUM2Ju437SxwSM92SCnAIQXuKHuIomavdG0XuWskb1t3H_dgejHG6pQthMo1-JMv7cOX25A0fPvT4QVDlmHRVeGUC_nvN0E5_960eun6IEON1UsEyZJUeYCt6U3rwXuTLd"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Footer Component */}
            <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-dim border-t border-outline-variant/20 mt-auto">
                <div className="text-sm font-bold text-on-surface">
                    Jamex Global Markets
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link className="text-on-surface-variant text-xs font-bold hover:text-on-surface transition-colors" to="#">Privacy Policy</Link>
                    <Link className="text-on-surface-variant text-xs font-bold hover:text-on-surface transition-colors" to="#">Terms of Service</Link>
                    <Link className="text-on-surface-variant text-xs font-bold hover:text-on-surface transition-colors" to="#">Cookie Settings</Link>
                    <Link className="text-on-surface-variant text-xs font-bold hover:text-on-surface transition-colors" to="#">Regulatory Disclosures</Link>
                </div>
                <div className="text-xs font-bold text-on-surface-variant text-center md:text-left">
                    © 2024 Jamex Global Markets. Institutional Grade Security.
                </div>
            </footer>
        </div>
    );
}
