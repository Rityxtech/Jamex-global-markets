import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface KycData {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  front_id_url: string | null;
  back_id_url: string | null;
  selfie_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
}

export default function AdminKYCReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('passport');
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [walletAmountStr, setWalletAmountStr] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<any[]>([]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) parts.pop();
    if (parts[0]) {
      parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
    }
    setWalletAmountStr(parts.join('.'));
  };
  const [checklist, setChecklist] = useState({
    visual: true,
    sanctions: true,
    pep: true,
    address: false,
    expiry: false,
  });

  const completedCount = Object.values(checklist).filter(Boolean).length;

  useEffect(() => {
    if (id) fetchKyc(id);
  }, [id]);

  const fetchKyc = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      setKyc(data as KycData);
      
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profileData) setProfile(profileData);

      const { data: addrData } = await supabase.from('wallet_addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setWalletAddresses(addrData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load KYC data');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletStatus = async (addrId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase.from('wallet_addresses').update({ status }).eq('id', addrId);
      if (error) throw error;
      setWalletAddresses(prev => prev.map(a => a.id === addrId ? { ...a, status } : a));
    } catch (err: any) {
      alert('Error updating wallet status: ' + err.message);
    }
  };

  const handleApprove = async () => {
    if (!kyc) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({ status: 'approved', rejection_reason: null, updated_at: new Date().toISOString() })
        .eq('id', kyc.id);
      if (error) throw error;
      setKyc({ ...kyc, status: 'approved' });
    } catch (err: any) {
      setError(err.message || 'Failed to approve KYC');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!kyc) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({ status: 'rejected', rejection_reason: comments || 'Rejected by admin', updated_at: new Date().toISOString() })
        .eq('id', kyc.id);
      if (error) throw error;
      setKyc({ ...kyc, status: 'rejected', rejection_reason: comments || 'Rejected by admin' });
    } catch (err: any) {
      setError(err.message || 'Failed to reject KYC');
    } finally {
      setProcessing(false);
    }
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSuperAdmin = profile?.email?.toLowerCase() === 'admin@jamexglobalmarkets.com';

  const handleSuspend = async () => {
    if (!profile) return;
    if (isSuperAdmin) { alert('Cannot suspend the super admin.'); return; }
    if (profile.is_admin) {
      alert('Cannot suspend admin users.');
      return;
    }
    const confirmAction = window.confirm(`Are you sure you want to suspend this user? They will not be able to log in.`);
    if (!confirmAction) return;

    try {
      const { error } = await supabase.from('profiles').update({ account_status: 'suspended' }).eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, account_status: 'suspended' });
      alert('User successfully suspended.');
    } catch (err: any) {
      alert('Error suspending user: ' + err.message);
    }
  };

  const handleBlock = async () => {
    if (!profile) return;
    if (isSuperAdmin) { alert('Cannot block the super admin.'); return; }
    if (profile.is_admin) {
      alert('Cannot block admin users.');
      return;
    }
    const confirmAction = window.confirm(`Are you sure you want to completely block this user?`);
    if (!confirmAction) return;

    try {
      const { error } = await supabase.from('profiles').update({ account_status: 'blocked' }).eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, account_status: 'blocked' });
      alert('User successfully blocked.');
    } catch (err: any) {
      alert('Error blocking user: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (isSuperAdmin) { alert('Cannot delete the super admin.'); return; }
    if (profile.is_admin) {
      alert('Cannot delete admin users.');
      return;
    }
    const confirmAction = window.confirm(`DANGER: Are you sure you want to completely delete this user? This action CANNOT be undone and deletes all their backend data.`);
    if (!confirmAction) return;

    try {
      // In Supabase client with anon key, we cannot easily delete Auth user without a secure RPC.
      // We will attempt RPC or alert the user on how to do it.
      const { error } = await supabase.rpc('delete_user', { target_user_id: profile.id });
      if (error) throw error;
      
      alert('User successfully deleted.');
      navigate('/admin/users');
    } catch (err: any) {
      alert('Error deleting user: ' + err.message + '\nNote: Backend RPC "delete_user" must be created in Supabase with SECURITY DEFINER to delete auth rows.');
    }
  };

  const handleToggleAdmin = async () => {
    if (!profile) return;
    if (isSuperAdmin) { alert('Cannot change the super admin role.'); return; }
    const newAdminStatus = !profile.is_admin;
    const action = newAdminStatus ? 'make' : 'remove';

    const confirmAction = window.confirm(`Are you sure you want to ${action} this user an admin? ${newAdminStatus ? 'Admins cannot be suspended, blocked, or deleted.' : 'This will remove all admin privileges.'}`);
    if (!confirmAction) return;

    try {
      const { error } = await supabase.from('profiles').update({ is_admin: newAdminStatus }).eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, is_admin: newAdminStatus });
      alert(`User ${newAdminStatus ? 'is now' : 'is no longer'} an admin.`);
    } catch (err: any) {
      alert(`Error ${action} admin: ` + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">No KYC submission found for this user.</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold cursor-pointer"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Under Review' },
    approved: { color: 'text-tertiary', bg: 'bg-tertiary/10 border-tertiary/20', label: 'Approved' },
    rejected: { color: 'text-error', bg: 'bg-error/10 border-error/20', label: 'Rejected' },
  };

  const currentStatus = statusConfig[kyc.status];

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
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">KYC Review: {kyc.first_name} {kyc.last_name}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${currentStatus.bg}`}>
            <span className={`w-2 h-2 rounded-full ${kyc.status === 'pending' ? 'bg-yellow-400 animate-pulse' : kyc.status === 'approved' ? 'bg-tertiary' : 'bg-error'}`}></span>
            <span className={`font-label-sm text-label-sm ${currentStatus.color}`}>{currentStatus.label}</span>
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
              {activeTab === 'passport' && kyc.front_id_url && (
                <a href={kyc.front_id_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface/80 backdrop-blur hover:bg-primary hover:text-on-primary rounded-lg transition-all shadow-lg border border-outline-variant/20 cursor-pointer text-on-surface">
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              )}
              {activeTab === 'address' && kyc.back_id_url && (
                <a href={kyc.back_id_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface/80 backdrop-blur hover:bg-primary hover:text-on-primary rounded-lg transition-all shadow-lg border border-outline-variant/20 cursor-pointer text-on-surface">
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              )}
              {activeTab === 'face' && kyc.selfie_url && (
                <a href={kyc.selfie_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface/80 backdrop-blur hover:bg-primary hover:text-on-primary rounded-lg transition-all shadow-lg border border-outline-variant/20 cursor-pointer text-on-surface">
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              )}
            </div>
            <div className="aspect-[16/10] bg-surface-container-lowest flex items-center justify-center p-8 overflow-hidden">
              {activeTab === 'passport' && kyc.front_id_url ? (
                <img src={kyc.front_id_url} alt="Front ID" className="w-full h-full object-contain rounded-lg" />
              ) : activeTab === 'address' && kyc.back_id_url ? (
                <img src={kyc.back_id_url} alt="Proof of Address" className="w-full h-full object-contain rounded-lg" />
              ) : activeTab === 'face' && kyc.selfie_url ? (
                <img src={kyc.selfie_url} alt="Selfie" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="w-full h-full border border-outline-variant/50 rounded-lg shadow-2xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-6xl">no_documents</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-surface-container/50 border-t border-outline-variant/30 flex justify-between items-center">
              <div>
                <p className="font-label-md text-label-md text-on-surface">
                  {activeTab === 'passport' ? 'Government ID / Passport' : activeTab === 'address' ? 'Proof of Address' : 'Face Match / Selfie'}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {activeTab === 'passport' && kyc.front_id_url ? 'Document uploaded' : 'No document uploaded'}
                </p>
              </div>
              {(activeTab === 'passport' && kyc.front_id_url) || (activeTab === 'address' && kyc.back_id_url) || (activeTab === 'face' && kyc.selfie_url) ? (
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-outline">cancel</span>
              )}
            </div>
          </div>

          {/* Secondary Document Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-primary transition-colors group ${activeTab === 'address' ? 'border-primary' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                {kyc.back_id_url ? (
                  <img src={kyc.back_id_url} alt="Proof of Address" className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="material-symbols-outlined text-outline">receipt_long</span>
                )}
              </div>
              <div>
                <p className="font-label-md text-label-md">Proof of Address</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Utility bill, bank statement, etc.</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
            </div>
            <div
              className={`glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-primary transition-colors group ${activeTab === 'face' ? 'border-primary' : ''}`}
              onClick={() => setActiveTab('face')}
            >
              <div className="w-16 h-16 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                {kyc.selfie_url ? (
                  <img src={kyc.selfie_url} alt="Selfie" className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="material-symbols-outlined text-outline">face</span>
                )}
              </div>
              <div>
                <p className="font-label-md text-label-md">Selfie (Live)</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Liveness Check</p>
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
                  <p className="font-body-md text-body-md font-medium text-on-surface">{kyc.first_name}</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Last Name</label>
                  <p className="font-body-md text-body-md font-medium text-on-surface">{kyc.last_name}</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Date of Birth</label>
                  <p className="font-tabular-nums text-tabular-nums text-on-surface">{kyc.date_of_birth}</p>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Country</label>
                  <p className="font-body-md text-body-md text-on-surface">{kyc.country}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Address</label>
                <p className="font-body-md text-body-md mb-2 text-on-surface">{kyc.address}, {kyc.city}, {kyc.postal_code}</p>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Submitted At</label>
                <p className="font-body-md text-body-md text-on-surface">{new Date(kyc.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Verified Wallet Addresses */}
          <div className="glass-card rounded-xl overflow-hidden mt-2 border border-outline-variant/20">
            <div className="px-6 py-4 bg-surface-container-highest/20 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined">account_balance_wallet</span> Verified Wallets
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded">{walletAddresses.length} total</span>
            </div>
            <div className="p-6">
              {walletAddresses.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center">No wallet addresses added yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {walletAddresses.map((w) => {
                    const statusColor = w.status === 'verified' ? 'text-tertiary' : w.status === 'rejected' ? 'text-error' : 'text-primary';
                    const statusBg = w.status === 'verified' ? 'bg-tertiary/10' : w.status === 'rejected' ? 'bg-error/10' : 'bg-primary/10';
                    return (
                      <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-on-surface text-sm capitalize">{w.network}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${statusBg} ${statusColor}`}>{w.status}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant truncate">{w.label}</p>
                          <code className="text-[11px] font-tabular-nums text-primary bg-surface-container px-1 py-0.5 rounded border border-outline-variant/20">{w.address}</code>
                        </div>
                        {w.status === 'pending' && (
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            <button
                              onClick={() => handleWalletStatus(w.id, 'verified')}
                              className="w-7 h-7 flex items-center justify-center rounded border border-tertiary/40 text-tertiary hover:bg-tertiary/10 transition-all"
                              title="Verify"
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </button>
                            <button
                              onClick={() => handleWalletStatus(w.id, 'rejected')}
                              className="w-7 h-7 flex items-center justify-center rounded border border-error/40 text-error hover:bg-error/10 transition-all"
                              title="Reject"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Account Management Actions */}
          <div className="glass-card rounded-xl overflow-hidden mt-2 border border-error/20">
            <div className="px-6 py-4 bg-error/10 border-b border-error/20 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-error flex items-center gap-2">
                <span className="material-symbols-outlined">gpp_maybe</span> Danger Zone
              </h3>
              <div className="flex items-center gap-2">
                {profile?.is_admin && (
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary">
                    ADMIN
                  </span>
                )}
                {profile?.account_status && (
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${profile.account_status === 'active' ? 'bg-tertiary/20 text-tertiary' : 'bg-error/20 text-error'}`}>
                    {profile.account_status}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <p className="text-xs text-on-surface-variant font-medium">Use these actions cautiously. Suspending/Blocking will prevent the user from logging in. Admins cannot be suspended, blocked, or deleted.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button
                  onClick={handleToggleAdmin}
                  disabled={isSuperAdmin}
                  className={`py-2.5 rounded-lg border font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    profile?.is_admin
                      ? 'border-primary/50 text-primary hover:bg-primary/10'
                      : 'border-secondary/50 text-secondary hover:bg-secondary/10'
                  }`}
                >
                  {isSuperAdmin ? 'Super Admin' : profile?.is_admin ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button 
                  onClick={handleSuspend}
                  disabled={profile?.account_status === 'suspended' || profile?.is_admin}
                  className="py-2.5 rounded-lg border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Suspend User
                </button>
                <button 
                  onClick={handleBlock}
                  disabled={profile?.account_status === 'blocked' || profile?.is_admin}
                  className="py-2.5 rounded-lg border border-error/50 text-error hover:bg-error/10 font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Block User
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={profile?.is_admin}
                  className="py-2.5 rounded-lg bg-error text-on-error hover:brightness-110 font-bold text-[11px] uppercase tracking-widest transition-all shadow-md shadow-error/20 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Management (Replaced Review Checklist) */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-surface-container-highest/20 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="text-xs md:text-sm font-bold text-on-surface flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>Wallet Management</h3>
            </div>
            <div className="p-3 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Wallet Type</label>
                  <select 
                    id="walletType"
                    className="bg-surface-container-lowest border border-outline-variant/50 rounded-md px-2 py-1.5 text-xs text-on-surface focus:border-primary outline-none"
                  >
                    <option value="main_balance">Main Wallet</option>
                    <option value="profit_balance">Profit Wallet</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Action</label>
                  <select 
                    id="walletAction"
                    className="bg-surface-container-lowest border border-outline-variant/50 rounded-md px-2 py-1.5 text-xs text-on-surface focus:border-primary outline-none"
                  >
                    <option value="deposit">Credit (Deposit)</option>
                    <option value="withdrawal">Debit (Withdrawal)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Amount ($)</label>
                  <input 
                    id="walletAmount"
                    type="text" 
                    value={walletAmountStr}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="bg-surface-container-lowest border border-outline-variant/50 rounded-md px-2 py-1.5 text-xs text-on-surface focus:border-primary outline-none font-tabular-nums"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Reason (History)</label>
                  <select 
                    id="walletReason"
                    className="bg-surface-container-lowest border border-outline-variant/50 rounded-md px-2 py-1.5 text-xs text-on-surface focus:border-primary outline-none"
                  >
                    <option value="Approved Deposit">Approved Deposit</option>
                    <option value="Approved Withdrawal">Approved Withdrawal</option>
                    <option value="Bonus Credit">Bonus Credit</option>
                    <option value="Account Adjustment">Account Adjustment</option>
                    <option value="Refund">Refund</option>
                    <option value="Penalty/Fee">Penalty / Fee</option>
                  </select>
                </div>
              </div>

              <button
                onClick={async () => {
                  const typeEl = document.getElementById('walletType') as HTMLSelectElement;
                  const actionEl = document.getElementById('walletAction') as HTMLSelectElement;
                  const reasonEl = document.getElementById('walletReason') as HTMLSelectElement;
                  
                  const amount = parseFloat(walletAmountStr.replace(/,/g, ''));
                  if (!amount || amount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                  }

                  const confirmAction = window.confirm(`Are you sure you want to ${actionEl.value} $${amount} to this user's ${typeEl.value.replace('_', ' ')}?`);
                  if (!confirmAction) return;

                  try {
                    // Get current wallet balance
                    const { data: walletData, error: walletError } = await supabase
                      .from('wallets')
                      .select(typeEl.value)
                      .eq('user_id', kyc.user_id)
                      .single();

                    if (walletError) throw walletError;

                    const currentBalance = Number(walletData[typeEl.value as keyof typeof walletData]);
                    const newBalance = actionEl.value === 'deposit' 
                      ? currentBalance + amount 
                      : currentBalance - amount;

                    if (newBalance < 0) {
                      alert('Insufficient funds for this debit action');
                      return;
                    }

                    // Update wallet
                    const { error: updateError } = await supabase
                      .from('wallets')
                      .update({ [typeEl.value]: newBalance })
                      .eq('user_id', kyc.user_id);

                    if (updateError) throw updateError;

                    // Insert transaction record using destination_address for the reason so it doesn't break DB schema
                    const { error: txError } = await supabase
                      .from('transactions')
                      .insert({
                        user_id: kyc.user_id,
                        type: actionEl.value,
                        amount: amount,
                        status: 'completed',
                        asset: 'USD',
                        destination_address: `Admin: ${reasonEl.value}`
                      });

                    if (txError) throw txError;

                    alert(`Successfully processed ${actionEl.value} of $${amount.toLocaleString('en-US')}`);
                    setWalletAmountStr('');
                  } catch (err: any) {
                    alert('Error updating wallet: ' + err.message);
                  }
                }}
                className="mt-1 w-full bg-primary text-on-primary py-2 rounded-md text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-95"
              >
                Process Transaction
              </button>
            </div>
          </div>

          {/* Decision Panel */}
          <div className="glass-card rounded-xl overflow-hidden mt-auto">
            <div className="p-6 flex flex-col gap-4">
              {error && (
                <div className="text-error text-xs font-medium bg-error/10 border border-error/20 p-2 rounded-lg">{error}</div>
              )}
              {kyc.status === 'rejected' && kyc.rejection_reason && (
                <div className="text-error text-xs font-medium bg-error/10 border border-error/20 p-2 rounded-lg">
                  <p className="font-bold mb-1">Rejection Reason:</p>
                  <p>{kyc.rejection_reason}</p>
                </div>
              )}
              <label className="block font-label-md text-label-md text-on-surface-variant">Reviewer Comments</label>
              <textarea
                className="w-full h-24 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none placeholder:text-on-surface-variant/30"
                placeholder="State reason for approval or document rejection..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={kyc.status !== 'pending' || processing}
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleReject}
                  disabled={kyc.status !== 'pending' || processing}
                  className="flex items-center justify-center gap-2 py-3 bg-surface-container-highest border border-error/50 text-error rounded-xl font-label-md text-label-md hover:bg-error/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">block</span>
                  {processing ? 'Processing...' : 'Reject Case'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={kyc.status !== 'pending' || processing}
                  className="flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">task_alt</span>
                  {processing ? 'Processing...' : 'Approve KYC'}
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
