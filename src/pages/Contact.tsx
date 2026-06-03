import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'motion/react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const variants: Variants = { visible: { transition: { staggerChildren: 0.07 } }, hidden: {} };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  const v: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
  return <motion.div variants={v} className={className}>{children}</motion.div>;
}

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Name, email, and message are required.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);

    const payload: Record<string, any> = {
      subject: `${formData.subject}: ${formData.name}`,
      message: formData.message.trim(),
      category: formData.subject,
      priority: 'normal',
      status: 'open',
    };

    if (user) {
      payload.user_id = user.id;
    } else {
      payload.guest_name = formData.name.trim();
      payload.guest_email = formData.email.trim();
    }

    const { error } = await supabase.from('support_tickets').insert(payload);
    if (!error) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setSubmitError(error.message);
    }
    setSubmitting(false);
  };

  const channels = [
    { icon: 'chat', title: 'Live Chat', detail: 'Avg. 2 min response', action: 'Start Chat' },
    { icon: 'mail', title: 'Email', detail: 'support@jamexglobal.com', action: 'Send Email' },
    { icon: 'phone', title: 'Phone', detail: '+1 (800) 555-0199', action: 'Call Now' },
  ];

  const offices = [
    { city: 'New York', tz: 'EST', addr: '350 Fifth Avenue, Suite 5400', hours: 'Mon–Fri 9am–6pm' },
    { city: 'London', tz: 'GMT', addr: '1 Canada Square, Canary Wharf', hours: 'Mon–Fri 9am–5:30pm' },
    { city: 'Singapore', tz: 'SGT', addr: '1 Raffles Place, Tower 2', hours: 'Mon–Fri 9am–6pm' },
  ];

  const faqs = [
    { q: 'How do I recover my account if I forgot my password?', a: 'Use the "Forgot Password" link on the login page. You will receive a secure reset link via email within 60 seconds.' },
    { q: 'What is the typical KYC verification timeline?', a: 'Most applications are reviewed within 24–48 hours. You will receive an email notification once your documents are approved.' },
    { q: 'Why is my withdrawal still pending?', a: 'Withdrawals are processed in batches every 4 hours. If your request exceeds 8 hours, please submit a ticket with your transaction ID.' },
    { q: 'Can I change my investment plan after depositing?', a: 'Plan commitments are fixed for the duration. However, you can open a new plan at any time with a fresh deposit.' },
  ];

  const badges = [
    { icon: 'encrypted', label: 'AES-256 Encryption' },
    { icon: 'verified_user', label: 'SOC 2 Type II' },
    { icon: 'gavel', label: 'GDPR Compliant' },
    { icon: 'cloud_done', label: '99.99% Uptime' },
  ];

  return (
    <div className="text-on-surface font-body-md selection:bg-primary/30 min-h-screen">
      <main className="pt-14 md:pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden py-8 md:py-14 px-4 sm:px-margin-desktop text-center">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-tertiary/5 rounded-full blur-[60px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block text-label-sm font-label-sm text-primary uppercase tracking-widest mb-2 border border-primary/20 px-3 py-1 rounded-full bg-primary/5">24/7 Support</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-display-lg text-display-lg text-on-surface mb-3 leading-tight">We're Here to Help</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-body-md font-body-md text-on-surface-variant max-w-lg mx-auto mb-5">Our global support team is available around the clock. Reach out however works best for you.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto cursor-pointer bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">Send a Message</button>
              <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">Browse FAQ</button>
            </motion.div>
          </div>
        </section>

        {/* CONTACT CHANNELS */}
        <section className="bg-surface-container py-6 md:py-10 px-4 sm:px-margin-desktop relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto relative z-10">
            <Reveal className="text-center mb-4 md:mb-6">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Get in Touch</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Choose Your Channel</h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {channels.map((c) => (
                <StaggerItem key={c.title}>
                  <div className="glass-card rounded-xl p-5 md:p-6 text-center h-full hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[24px] text-primary">{c.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{c.title}</h3>
                    <p className="text-body-md font-body-md text-on-surface-variant mb-3">{c.detail}</p>
                    <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider group-hover:underline">{c.action} →</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CONTACT FORM + OFFICES */}
        <section id="contact-form" className="py-6 md:py-10 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Reveal>
                <div className="glass-card rounded-xl p-4 md:p-6 border border-outline-variant/20 h-full">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Send us a Message</h2>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-4">Fill out the form below and we'll get back to you within 4 hours.</p>
                  {submitted && (
                    <div className="mb-4 p-3 bg-tertiary/10 border border-tertiary/30 rounded-lg text-tertiary text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Message sent! Our team will respond shortly.
                    </div>
                  )}
                  {submitError && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm font-bold">
                      {submitError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" placeholder="Your full name" type="text" />
                      </div>
                      <div>
                        <label className="block text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
                        <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" placeholder="you@example.com" type="email" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subject</label>
                      <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium">
                        <option>General Inquiry</option>
                        <option>Account Recovery</option>
                        <option>Investment Question</option>
                        <option>Technical Support</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Message</label>
                      <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium resize-none" placeholder="How can we help you?" />
                    </div>
                    <button disabled={submitting} type="submit" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm uppercase tracking-wider shadow-sm shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting ? (
                        <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Sending...</>
                      ) : (
                        <><span className="material-symbols-outlined text-[18px]">send</span> Send Message</>
                      )}
                    </button>
                  </form>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="space-y-3 md:space-y-4">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Our Offices</h2>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-2">Global presence, local expertise.</p>
                  {offices.map((o) => (
                    <div key={o.city} className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-primary/30 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{o.city}</h3>
                        <p className="text-xs text-on-surface-variant">{o.addr}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">{o.tz}</span>
                          <span className="text-[10px] text-on-surface-variant">{o.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="glass-card rounded-xl p-4 border border-tertiary/20 bg-tertiary/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
                      <span className="text-label-sm font-bold text-on-surface uppercase tracking-wider">Response Guarantee</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">All inquiries receive a human response within 4 hours during business days, and 8 hours on weekends.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* GLOBAL PRESENCE BANNER */}
        <section className="relative overflow-hidden">
          <Reveal>
            <div className="relative h-48 md:h-64 mx-4 sm:mx-margin-desktop rounded-2xl overflow-hidden border border-outline-variant/20">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80" alt="Global Office" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 md:px-10">
                <div className="max-w-md">
                  <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Global Reach</span>
                  <h2 className="font-headline-lg text-headline-lg text-white mb-2">Headquartered in New York</h2>
                  <p className="text-body-md font-body-md text-white/70">Supporting investors across 50+ jurisdictions with local teams in London, Singapore, and Dubai.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-6 md:py-10 px-4 sm:px-margin-desktop">
          <div className="max-w-3xl xl:max-w-5xl mx-auto">
            <Reveal className="text-center mb-4 md:mb-6">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Common Questions</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Frequently Asked</h2>
            </Reveal>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className={`glass-card rounded-xl border border-outline-variant/20 overflow-hidden transition-all ${openFaq === i ? 'border-primary/30' : ''}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3 md:p-4 text-left hover:bg-white/5 transition-colors">
                      <span className="text-sm md:text-body-md font-bold text-on-surface pr-4">{f.q}</span>
                      <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="material-symbols-outlined text-primary shrink-0 text-[20px]">expand_more</motion.span>
                    </button>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-3 md:px-4 pb-3 md:pb-4 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-2">{f.a}</div>
                      </motion.div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="bg-surface-container py-6 md:py-10 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
            <Reveal className="text-center mb-4 md:mb-6">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Trust & Safety</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Your Security is Our Priority</h2>
            </Reveal>
            <StaggerContainer className="flex flex-wrap justify-center gap-2.5 md:gap-3">
              {badges.map((b) => (
                <StaggerItem key={b.label}>
                  <div className="glass-card rounded-xl px-4 py-2.5 md:px-5 md:py-3 flex items-center gap-2 hover:border-primary/30 transition-all">
                    <span className="material-symbols-outlined text-[18px] md:text-[20px] text-primary">{b.icon}</span>
                    <span className="text-label-md font-label-md text-on-surface">{b.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-6 md:py-10 px-4 sm:px-margin-desktop">
          <div className="max-w-4xl xl:max-w-6xl mx-auto">
            <Reveal>
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-5 md:p-8 text-center border border-outline-variant/20">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 md:mb-2">Not sure where to start?</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mb-4 md:mb-5 max-w-md mx-auto">Explore our investment plans and see how Jamex Global Markets can grow your wealth.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
                  <button onClick={() => navigate('/plans')} className="w-full sm:w-auto cursor-pointer bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">View Investment Plans</button>
                  {!user && (
                    <button onClick={() => navigate('/register')} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">Create Account</button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
