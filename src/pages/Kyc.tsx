import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Kyc() {
    const navigate = useNavigate();
    const [frontId, setFrontId] = useState<File | null>(null);
    const [backId, setBackId] = useState<File | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    return (
        <div className="deep-mesh-bg text-on-surface font-body-md min-h-screen flex flex-col dark bg-background">
             
            {/* Sidebar Navigation Shell */}
            <Sidebar />

            {/* Top Navigation for Mobile (Optional but consistent) */}
            

            {/* Main Content Area */}
            <main className="md:ml-64 p-4 md:p-margin-desktop pt-20 md:pt-16 pb-24 md:pb-12 min-h-screen flex flex-col max-w-[1400px] mx-auto w-full">
                {/* Header / Status Bar */}
                

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-grow">
                    {/* Left Column: Personal Form */}
                    <section className="lg:col-span-7 space-y-4 md:space-y-6">
                        <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-label-md font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 md:gap-2">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">person</span>
                                    Personal Details
                                </h3>
                            </div>
                            <div className="p-4 md:p-5">
                                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Legal First Name</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium" placeholder="John" type="text"/>
                                    </div>
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Legal Last Name</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium" placeholder="Doe" type="text"/>
                                    </div>
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Date of Birth</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none [color-scheme:dark] font-medium" type="date"/>
                                    </div>
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Country of Residence</label>
                                        <select className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer font-medium">
                                            <option>Select Country</option>
                                            <option>United Kingdom</option>
                                            <option>United States</option>
                                            <option>Singapore</option>
                                            <option>Switzerland</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2 flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Residential Address</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium" placeholder="Street name, Building No." type="text"/>
                                    </div>
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">City</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium" placeholder="London" type="text"/>
                                    </div>
                                    <div className="flex flex-col gap-1 md:gap-1.5">
                                        <label className="text-[9px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Postal Code</label>
                                        <input className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 md:p-3 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium" placeholder="EC1A 1BB" type="text"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        {/* Data Security Assurance */}
                        <div className="glass-card border border-outline-variant/20 rounded-xl p-4 md:p-5 flex items-start gap-3 md:gap-4 bg-primary/5">
                            <div className="bg-primary/10 border border-primary/20 p-2 md:p-3 rounded-lg shrink-0">
                                <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span>
                            </div>
                            <div>
                                <h4 className="text-[11px] md:text-sm font-bold text-on-surface mb-0.5 md:mb-1 uppercase tracking-wide">Institutional Security Standards</h4>
                                <p className="text-[9px] md:text-xs text-on-surface-variant leading-relaxed font-medium">Your sensitive information is encrypted via AES-256 and stored in vault-isolated environments. We comply with global GDPR and CCPA regulations.</p>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Document Upload */}
                    <section className="lg:col-span-5 space-y-4 md:space-y-6">
                        <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-label-md font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 md:gap-2">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">upload_file</span>
                                    Document Upload
                                </h3>
                            </div>
                            <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                                {/* Front of ID */}
                                <div className={`group relative bg-surface-container-lowest border-2 border-dashed rounded-xl p-5 md:p-6 text-center hover:border-primary/50 transition-colors cursor-pointer ${frontId ? 'border-primary bg-primary/5' : 'border-outline-variant/40'}`}>
                                    <input 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        type="file" 
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={(e) => setFrontId(e.target.files?.[0] || null)}
                                    />
                                    {frontId ? (
                                        <>
                                            <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-[28px] md:text-3xl">task_alt</span>
                                            <p className="text-[11px] md:text-sm font-bold"><span className="text-tertiary">✓</span> File Selected</p>
                                            <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5 md:mt-1 truncate px-2 md:px-4">{frontId.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary mb-1 md:mb-2 text-[28px] md:text-3xl transition-colors">badge</span>
                                            <p className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-wide">Front of Government ID</p>
                                            <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5 md:mt-1 font-medium">PNG, JPG or PDF up to 10MB</p>
                                        </>
                                    )}
                                </div>
                                
                                {/* Back of ID */}
                                <div className={`group relative bg-surface-container-lowest border-2 border-dashed rounded-xl p-5 md:p-6 text-center hover:border-primary/50 transition-colors cursor-pointer ${backId ? 'border-primary bg-primary/5' : 'border-outline-variant/40'}`}>
                                    <input 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        type="file"
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={(e) => setBackId(e.target.files?.[0] || null)}
                                    />
                                    {backId ? (
                                        <>
                                            <span className="material-symbols-outlined text-primary mb-1 md:mb-2 text-[28px] md:text-3xl">task_alt</span>
                                            <p className="text-[11px] md:text-sm font-bold"><span className="text-tertiary">✓</span> File Selected</p>
                                            <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5 md:mt-1 truncate px-2 md:px-4">{backId.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary mb-1 md:mb-2 text-[28px] md:text-3xl transition-colors">credit_card</span>
                                            <p className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-wide">Back of Government ID</p>
                                            <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5 md:mt-1 font-medium">Ensure all four corners are visible</p>
                                        </>
                                    )}
                                </div>

                                {/* Selfie Verification */}
                                <div className="bg-surface-container-low rounded-xl p-3 md:p-4 border border-outline-variant/30">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <div>
                                            <p className="text-[11px] md:text-sm font-bold uppercase tracking-wide">Liveness Check</p>
                                            <p className="text-[9px] md:text-xs text-on-surface-variant mt-0.5 font-medium">Live facial verification required</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsCameraOpen(!isCameraOpen)}
                                            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${isCameraOpen ? 'bg-error/10 text-error border-error/20 hover:bg-error/20' : 'bg-primary border-primary text-on-primary hover:brightness-110 active:scale-95 shadow-sm'}`}
                                        >
                                            {isCameraOpen ? 'Close Cam' : 'Open Cam'}
                                        </button>
                                    </div>
                                    <div className={`aspect-square w-20 md:w-24 mx-auto rounded-full bg-surface-container-lowest border flex items-center justify-center relative overflow-hidden transition-all ${isCameraOpen ? 'border-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-outline-variant/50'}`}>
                                        <span className={`material-symbols-outlined text-[32px] md:text-4xl transition-colors ${isCameraOpen ? 'text-primary' : 'text-outline/30'}`}>face</span>
                                        {/* Simulated Scanner Line */}
                                        {isCameraOpen && (
                                            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/50 animate-[scan_3s_infinite] shadow-[0_0_8px_#2563EB]"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2 md:pt-0">
                            <button className="w-full bg-primary text-on-primary py-3.5 md:py-4 rounded-xl text-[11px] md:text-sm font-bold uppercase tracking-wider shadow-sm shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mb-3 md:mb-4">
                                Submit Verification
                            </button>
                            <p className="text-center text-[9px] md:text-[10px] text-on-surface-variant px-2 md:px-4 leading-snug font-medium">
                                By clicking submit, you agree to our <Link className="text-primary hover:underline font-bold" to="#">Terms of Service</Link> and acknowledge the processing of your biometric data.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            {/* Mobile Bottom NavBar - 5 sleek items */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-[68px] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-between items-center px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </Link>
                <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Invest</span>
                </Link>
                <Link to="/wallet" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Wallet</span>
                </Link>
                <Link to="/transactions" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">History</span>
                </Link>
                <Link to="/settings" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
                    <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">KYC</span>
                </Link>
            </nav>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </div>
    );
}
