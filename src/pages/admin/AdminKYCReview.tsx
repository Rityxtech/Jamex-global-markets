import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminKYCReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('passport');
  const [checklist, setChecklist] = useState({
    visual: true,
    sanctions: true,
    pep: true,
    address: false,
    expiry: false,
  });

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-6 lg:-mx-8 -mt-6 lg:-mt-8">
      {/* Header */}
      <header className="flex justify-between items-center px-6 lg:px-8 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 sticky top-16 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">KYC Case: #{id || 'JAM-99231'}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container/30 border border-secondary/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-secondary-container">Under Review</span>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">dynamic_feed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 lg:p-8 grid grid-cols-12 gap-6 flex-grow overflow-y-auto pb-20 md:pb-8">
        {/* Left: Document Viewer */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Document Switcher Tabs */}
          <div className="flex gap-2 p-1 bg-surface-container-highest/30 rounded-xl border border-outline-variant/20 w-fit overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('passport')}
              className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'passport' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              Passport / ID
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'address' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              Proof of Address
            </button>
            <button
              onClick={() => setActiveTab('face')}
              className={`px-6 py-2 rounded-lg font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'face' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant/20'
              }`}
            >
              Face Match
            </button>
          </div>

          {/* Image Viewer */}
          <div className="glass-card rounded-xl overflow-hidden flex flex-col group relative">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button className="p-2 bg-surface/80 backdrop-blur hover:bg-primary hover:text-on-primary rounded-lg transition-all shadow-lg border border-outline-variant/20 cursor-pointer text-on-surface">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <button className="p-2 bg-surface/80 backdrop-blur hover:bg-primary hover:text-on-primary rounded-lg transition-all shadow-lg border border-outline-variant/20 cursor-pointer text-on-surface">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
            <div className="aspect-[16/10] bg-surface-container-lowest flex items-center justify-center p-8 overflow-hidden">
              <div className="w-full h-full border border-outline-variant/50 rounded-lg shadow-2xl bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-outline text-6xl">account_box</span>
              </div>
            </div>
            <div className="p-4 bg-surface-container/50 border-t border-outline-variant/30 flex justify-between items-center">
              <div>
                <p className="font-label-md text-label-md text-on-surface">European Passport - Germany</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">OCR Match Confidence: 98.4%</p>
              </div>
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
            </div>
          </div>

          {/* Secondary Document Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-primary transition-colors group">
              <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-outline">receipt_long</span>
              </div>
              <div>
                <p className="font-label-md text-label-md">Utility Bill</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Residential Address</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-primary transition-colors group">
              <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-outline">face</span>
              </div>
              <div>
                <p className="font-label-md text-label-md">Selfie (Live)</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Liveness Check Passed</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
            </div>
          </div>
        </section>

        {/* Right: Data Review & Decision */}
        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Extracted Data Panel */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-highest/20 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Profile Data</h3>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">First Name</label>
                  <p className="font-body-md text-body-md font-medium text-on-surface">Alexander</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Last Name</label>
                  <p className="font-body-md text-body-md font-medium text-on-surface">von Sternberg</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Date of Birth</label>
                  <p className="font-tabular-nums text-tabular-nums text-on-surface">14 May 1984</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Country</label>
                  <p className="font-body-md text-body-md text-on-surface">Germany</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Address Match</label>
                <p className="font-body-md text-body-md mb-2 text-on-surface">Maximilianstraße 12, 80539 München, Bavaria</p>
                <div className="flex items-center gap-2 text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-label-sm text-label-sm">System Verified (Postal API)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Checklist */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-highest/20 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Review Checklist</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{completedCount} / 5 Complete</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {[
                { key: 'visual', label: 'Visual check of photo validity' },
                { key: 'sanctions', label: 'Sanctions list screening check' },
                { key: 'pep', label: 'PEP (Politically Exposed) check' },
                { key: 'address', label: 'Address verification vs Bill' },
                { key: 'expiry', label: 'ID Expiry date validation' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleChecklist(item.key as keyof typeof checklist)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checklist[item.key as keyof typeof checklist] ? 'border-tertiary bg-tertiary/20' : 'border-outline hover:border-primary'}`}>
                    {checklist[item.key as keyof typeof checklist] && <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>}
                  </div>
                  <span className={`font-label-md text-label-md transition-colors ${checklist[item.key as keyof typeof checklist] ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Decision Panel */}
          <div className="glass-card rounded-xl overflow-hidden mt-auto">
            <div className="p-6 flex flex-col gap-4">
              <label className="block font-label-md text-label-md text-on-surface-variant">Reviewer Comments</label>
              <textarea
                className="w-full h-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none placeholder:text-on-surface-variant/30"
                placeholder="State reason for approval or document rejection..."
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-surface-container-highest border border-error/50 text-error rounded-xl font-label-md text-label-md hover:bg-error/10 transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined">block</span>
                  Reject Case
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined">task_alt</span>
                  Approve KYC
                </button>
              </div>
              <p className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-50">Decision will be logged as audit trail</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
