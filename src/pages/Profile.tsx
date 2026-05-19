import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                {/* TopNavBar */}
                <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-surface/90 backdrop-blur-xl h-14 md:h-16 border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-margin-desktop shadow-sm transition-all">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl md:text-headline-md font-bold text-primary tracking-tight md:hidden">Jamex</h1>
                        <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                            <span className="material-symbols-outlined text-on-surface-variant text-body-md mr-2">search</span>
                            <input className="bg-transparent border-none outline-none focus:ring-0 text-label-sm text-on-surface placeholder:text-outline w-48" placeholder="Search profile..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-3 border-l border-outline-variant/30 pl-3 md:pl-4">
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-[20px] md:text-[24px]">notifications</span>
                            <span onClick={() => navigate('/wallet')} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors hidden sm:block text-[24px]">account_balance_wallet</span>
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-container-highest overflow-hidden border border-primary cursor-pointer transition-colors ml-1" onClick={() => window.innerWidth < 768 ? window.dispatchEvent(new Event('toggle-mobile-menu')) : navigate('/profile')}>
                                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjHMWFfdoF2Mysc4qW_RGhD3_ie09HnonrwrC7G1h5yZAcHzWD-Qwmx8C1y1VFLmeUfHHR8kpJq9P4HQM9h8GGC3ADt6HiairNW4MynzETeHkLZ83d2KKNc1ak7eMdC2A3JB9__u8rpcO4sRTL1RIKfp_yxkm0TzhX8aivQ11Oq-e15K7hZ5zD2Z-A-nU-xxojMGhwqNZdjrOD1udjTCrTneDiejvuiuHDV3P7WiXwUW2vbmiDciIAPQsYtyhv4pbrkV8-Z9iTdOk-" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1200px] mx-auto w-full mb-12">
                    <header className="mb-2 md:mb-6">
                        <h1 className="text-2xl md:text-headline-lg font-bold text-on-surface tracking-tight mb-1">User Profile</h1>
                        <p className="text-[11px] md:text-body-md text-on-surface-variant leading-snug max-w-xl">Manage your institutional account details and wallet configurations.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-gutter">
                        {/* Profile Identity Card */}
                        <section className="lg:col-span-12 glass-card rounded-xl overflow-hidden relative group border border-outline-variant/20">
                            <div className="h-20 md:h-32 w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-container/40 to-secondary-container/20"></div>
                                <img alt="Institutional Header" className="w-full h-full object-cover opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS-TDbO2hbpVDtUFouSg9_eQBVbxo6hYtGg0Bcdnp08tsr8-uV-Jpd8-Vj6-7MB7-wak9BZ53SQSCkJ1pJnEpmqk-ekfSQnXlQKa4CaxD9BB4Ke4N3O46pmRwQtv17XKOrIhlI-FlOQBYIGPNjFI4MAU47Miw6EzaUSGwhj_6fA2KhakOnRfyK3qyjPH0odhB6e0Gs23UhQ9JGuPT-bsVAHuj42gwDFka7vTpfupcRlMSiBIYPJGAJl80Q52I4Tuj3gRSWrfu_KExx" />
                            </div>
                            <div className="px-4 pb-4 md:px-card-padding md:pb-card-padding flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-6 -mt-10 md:-mt-12 relative z-10">
                                <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl glass-card border-2 md:border-4 border-background p-1 bg-surface-container shadow-lg">
                                    <img alt="User Profile" className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG3X6LxxL5X36N91_1pfvNas4bUjG1eTJgu-WutIU7gf7X9pdQpu1B77MeN3k0VaobUs68sd2hzztp86L-yj77wo4nasaHlro46kGZhgPnxSSjWexMfggqnby5qCix6AWD2x6MPBvCxnBn8DLwMYsc9g9DgwtCl1VqWwO1gnhOuv-YAAn-gBe14W4Sk1pJgieBHjOUnIcWvubPAftjmpk1qGuM62ENqSDgecKYOy-k1ea1TjyIMpuk-Aece29DRJJvM6Jla115yd3E" />
                                </div>
                                <div className="flex-1 pb-1 md:pb-4 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 mb-2 md:mb-1">
                                        <h2 className="text-xl md:text-headline-md font-bold text-on-surface tracking-tight">Alexander J. Rothschild</h2>
                                        <span className="bg-tertiary-container/20 text-tertiary text-[9px] md:text-label-sm font-bold px-2 py-0.5 md:px-3 md:py-1 rounded border border-tertiary/30 w-max flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] md:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                            VERIFIED INSTITUTIONAL
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-label-md font-bold text-on-surface-variant">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px] md:text-[18px]">fingerprint</span>
                                            <span className="font-tabular-nums">UID: 8829-0012-44X</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px] md:text-[18px]">calendar_today</span>
                                            <span>Joined: Oct 2022</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto md:pb-4 mt-2 md:mt-0">
                                    <button className="w-full md:w-auto bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant transition-all flex items-center justify-center gap-2 border border-outline-variant/30">
                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">edit</span>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Personal Information */}
                        <section className="lg:col-span-7 glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-label-md font-bold tracking-wide text-on-surface uppercase">Personal Information (KYC)</h3>
                            </div>
                            <div className="p-4 md:p-card-padding grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Legal First Name</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface flex items-center justify-between">
                                        <span className="font-medium">Alexander</span>
                                        <span className="material-symbols-outlined text-outline/50 text-[16px]">lock</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Legal Last Name</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface flex items-center justify-between">
                                        <span className="font-medium">Rothschild</span>
                                        <span className="material-symbols-outlined text-outline/50 text-[16px]">lock</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Registered Email Address</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface flex items-center justify-between">
                                        <span className="font-medium truncate">a.rothschild@jamex.com</span>
                                        <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Account Type</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface font-medium">
                                        Institutional Wealth
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant block uppercase tracking-wider">Tax Residency</label>
                                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-on-surface font-medium">
                                        United Kingdom
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security Quick Stats */}
                        <section className="lg:col-span-5 flex flex-col">
                            <div className="glass-card rounded-xl p-4 md:p-card-padding flex-1 border border-outline-variant/20 flex flex-col">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Security Level</h3>
                                    <span className="text-[10px] md:text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">Advanced</span>
                                </div>
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-bold text-on-surface leading-tight">Two-Factor Auth</p>
                                            <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">Active via Authenticator</p>
                                        </div>
                                        <span className="text-tertiary material-symbols-outlined text-[24px] md:text-[28px]">toggle_on</span>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px]">key</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-bold text-on-surface leading-tight">Withdrawal Whitelist</p>
                                            <p className="text-[10px] md:text-xs text-on-surface-variant mt-0.5">Enabled for verified addrs</p>
                                        </div>
                                        <span className="text-primary material-symbols-outlined text-[24px] md:text-[28px]">toggle_on</span>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-6 pt-4 border-t border-outline-variant/10">
                                    <button onClick={() => navigate('/settings')} className="w-full bg-surface-container-high text-on-surface py-2.5 md:py-3 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant transition-all border border-outline-variant/30">
                                        Manage Security
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Wallet Addresses */}
                        <section className="lg:col-span-12 glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Verified Wallet Addresses</h3>
                                <button className="flex items-center gap-1.5 text-primary text-[11px] md:text-label-sm font-bold hover:underline self-start sm:self-auto w-max bg-primary/10 px-2 py-1 rounded">
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Add New
                                </button>
                            </div>
                            <div className="overflow-x-auto scrollbar-hide">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/10 bg-surface-container-highest/20">
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Network</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Label</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Address</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3">Status</th>
                                            <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5 text-xs md:text-sm">
                                        <tr className="group hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                                        <span className="text-[10px] md:text-[12px] font-bold text-primary">Ξ</span>
                                                    </div>
                                                    <span className="font-bold text-on-surface">Ethereum</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding text-on-surface-variant">Main Ledger</td>
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <code className="font-tabular-nums bg-surface-container px-1.5 py-0.5 rounded text-primary text-[10px] md:text-[12px] border border-outline-variant/20">0x71C...4f9E</code>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <span className="text-tertiary text-[10px] md:text-xs font-bold flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_5px_rgba(78,222,163,0.8)]"></span> Verified
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding text-right">
                                                <button className="text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[16px] md:text-[20px]">delete</button>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                                                        <span className="text-[10px] md:text-[12px] font-bold text-secondary">₿</span>
                                                    </div>
                                                    <span className="font-bold text-on-surface">Bitcoin</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding text-on-surface-variant">Cold Storage</td>
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <code className="font-tabular-nums bg-surface-container px-1.5 py-0.5 rounded text-primary text-[10px] md:text-[12px] border border-outline-variant/20">bc1qx...yv</code>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding">
                                                <span className="text-tertiary text-[10px] md:text-xs font-bold flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_5px_rgba(78,222,163,0.8)]"></span> Verified
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-card-padding text-right">
                                                <button className="text-on-surface-variant hover:text-error transition-colors material-symbols-outlined text-[16px] md:text-[20px]">delete</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
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
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
