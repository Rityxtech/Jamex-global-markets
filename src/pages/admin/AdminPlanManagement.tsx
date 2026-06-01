import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface PlanRow {
  id: string;
  name: string;
  tier: string;
  daily_yield: number;
  duration_days: number;
  min_amount: number;
  max_amount: number | null;
  is_active: boolean;
}

export default function AdminPlanManagement() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: '',
    name: '',
    daily_yield: '',
    duration_days: '',
    min_amount: '',
    max_amount: '',
    tier: 'Standard',
    is_active: true,
  });

  const fetchPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from('investment_plans').select('*').order('created_at', { ascending: false });
    if (data) setPlans(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggle = async (plan: PlanRow) => {
    const { error } = await supabase.from('investment_plans').update({ is_active: !plan.is_active }).eq('id', plan.id);
    if (!error) {
      setPlans(plans.map(p => p.id === plan.id ? { ...p, is_active: !p.is_active } : p));
    }
  };

  const handleEdit = (plan: PlanRow) => {
    setForm({
      id: plan.id,
      name: plan.name,
      daily_yield: plan.daily_yield.toString(),
      duration_days: plan.duration_days.toString(),
      min_amount: plan.min_amount.toString(),
      max_amount: plan.max_amount ? plan.max_amount.toString() : '',
      tier: plan.tier,
      is_active: plan.is_active
    });
    setEditMode(true);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan? This action cannot be undone.")) return;
    const { error } = await supabase.from('investment_plans').delete().eq('id', id);
    if (error) {
      alert("Error deleting plan: " + error.message);
    } else {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleSave = async () => {
    console.log('handleSave called', { form, editMode });
    
    if (!form.name || !form.daily_yield || !form.duration_days) {
      alert("Please fill in the required fields");
      return;
    }
    
    const payload = {
      name: form.name,
      tier: form.tier,
      daily_yield: parseFloat(form.daily_yield),
      duration_days: parseInt(form.duration_days, 10),
      min_amount: form.min_amount ? parseFloat(form.min_amount) : 0,
      max_amount: form.max_amount ? parseFloat(form.max_amount) : null,
      is_active: form.is_active
    };
    
    console.log('Payload to save:', payload);

    if (editMode && form.id) {
      console.log('Updating plan with ID:', form.id);
      const { error, data } = await supabase.from('investment_plans').update(payload).eq('id', form.id).select();
      console.log('Update result:', { error, data });
      if (error) alert(error.message);
      else {
        setPanelOpen(false);
        fetchPlans();
      }
    } else {
      console.log('Inserting new plan');
      const { error, data } = await supabase.from('investment_plans').insert([payload]).select();
      console.log('Insert result:', { error, data });
      if (error) alert(error.message);
      else {
        setPanelOpen(false);
        fetchPlans();
      }
    }
  };

  const openNew = () => {
    setForm({
      id: '',
      name: '',
      daily_yield: '',
      duration_days: '',
      min_amount: '',
      max_amount: '',
      tier: 'Standard',
      is_active: true,
    });
    setEditMode(false);
    setPanelOpen(true);
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return 'No Limit';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <>
      {/* Side Panel Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Create Plan Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-surface-container-lowest/95 backdrop-blur-2xl shadow-2xl z-[60] transform transition-transform duration-500 ease-in-out border-l border-outline-variant/20 flex flex-col ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">{editMode ? 'Edit Plan' : 'Create Investment Plan'}</h3>
            <p className="text-on-surface-variant font-label-sm text-label-sm">Deploy new institutional contract parameters.</p>
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Plan Name</label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Omega Frontier"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Daily ROI %</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={form.daily_yield}
                    onChange={(e) => setForm({ ...form, daily_yield: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-label-md text-label-md">%</span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Duration (Days)</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="90"
                  type="number"
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Min Deposit ($)</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="5000"
                  type="number"
                  value={form.min_amount}
                  onChange={(e) => setForm({ ...form, min_amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Max Deposit ($) [Leave blank for unlimited]</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="100000"
                  type="number"
                  value={form.max_amount}
                  onChange={(e) => setForm({ ...form, max_amount: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Plan Tier</label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary outline-none transition-all"
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
              >
                <option value="Starter">Starter</option>
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
                <option value="Executive">Executive</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          {/* Preview Banner */}
          <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl text-primary">insights</span>
            </div>
            <h4 className="font-label-md text-label-md text-primary mb-1 uppercase tracking-widest">Plan Deployment Preview</h4>
            <p className="text-on-surface text-body-md">New plans are subject to a 24-hour liquidity verification period before appearing in the client terminal.</p>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex gap-4 shrink-0">
          <button
            onClick={() => setPanelOpen(false)}
            className="flex-1 border border-outline-variant/30 text-on-surface-variant py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest/30 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer">
            {editMode ? 'Update Plan' : 'Deploy Plan'}
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-8 pb-20 md:pb-0">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm mb-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">verified_user</span>
              Administrator Console
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Investment Plan Management</h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-1">Configure, monitor, and deploy institutional-grade trading contracts.</p>
          </div>
          <button
            onClick={openNew}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            Create New Plan
          </button>
        </header>

        {/* Active Plan Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Contracts</h2>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold animate-pulse">{plans.filter(p => p.is_active).length} LIVE</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`glass-card rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${!plan.is_active ? 'opacity-80 border-dashed border-error/30' : ''}`}
                >
                  {/* Card Header */}
                  <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
                    <span className={`font-label-md text-label-md font-bold ${!plan.is_active ? 'text-on-surface-variant' : 'text-primary'}`}>
                      {plan.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter`}>
                        {plan.tier}
                      </span>
                      {/* Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={plan.is_active}
                          onChange={() => handleToggle(plan)}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container relative"></div>
                      </label>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-card-padding space-y-4 flex-1">
                    {!plan.is_active ? (
                      <>
                        <div className={`grid grid-cols-2 gap-4 filter grayscale`}>
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Daily Yield</p>
                            <p className="text-on-surface-variant font-tabular-nums text-headline-md">{plan.daily_yield}%</p>
                          </div>
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Duration</p>
                            <p className="text-on-surface-variant font-tabular-nums text-headline-md">{plan.duration_days} <span className="text-sm font-normal">Days</span></p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-outline-variant/10 text-center py-6 flex flex-col items-center">
                          <span className="material-symbols-outlined text-error text-3xl mb-2">lock_clock</span>
                          <p className="text-error font-label-md text-label-md">New Investments Halted</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Daily Yield</p>
                            <p className="text-tertiary font-tabular-nums text-headline-md">{plan.daily_yield}%</p>
                          </div>
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Duration</p>
                            <p className="text-on-surface font-tabular-nums text-headline-md">
                              {plan.duration_days} <span className="text-sm font-normal">Days</span>
                            </p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Min Deposit</p>
                            <p className="text-primary font-tabular-nums text-lg font-bold">{formatCurrency(plan.min_amount)}</p>
                          </div>
                          <div>
                            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Max Deposit</p>
                            <p className="text-primary font-tabular-nums text-lg font-bold">{formatCurrency(plan.max_amount)}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="border-t border-outline-variant/20 bg-surface-container-lowest/50 p-2 flex justify-end gap-2">
                    <button onClick={() => handleEdit(plan)} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Edit Plan">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="p-2 text-error hover:bg-error/10 rounded transition-colors" title="Delete Plan">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
