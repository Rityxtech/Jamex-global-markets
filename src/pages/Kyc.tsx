import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useKycStore } from '../store/kycStore';
import { useAuthStore } from '../store/authStore';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin',
  'Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
  'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia',
  'Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini',
  'Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada',
  'Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
  'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
  'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru',
  'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
  'Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
  'Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone',
  'Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan',
  'Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu',
  'Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

export default function Kyc() {
  const { user } = useAuthStore();
  const { kyc, loading, uploading, uploadProgress, error, fetchKyc, submitKyc, subscribeToKyc } = useKycStore();

  // Form state
  const [form, setForm] = useState({
    first_name: '', last_name: '', date_of_birth: '',
    country: '', address: '', city: '', postal_code: ''
  });

  // File states
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Submit state
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // On mount: fetch existing KYC and subscribe to real-time updates
  useEffect(() => {
    if (!user) return;
    fetchKyc(user.id);
    const unsub = subscribeToKyc(user.id);
    return () => unsub();
  }, [user]);

  // Pre-fill form if existing KYC data found
  useEffect(() => {
    if (kyc) {
      setForm({
        first_name: kyc.first_name || '',
        last_name: kyc.last_name || '',
        date_of_birth: kyc.date_of_birth || '',
        country: kyc.country || '',
        address: kyc.address || '',
        city: kyc.city || '',
        postal_code: kyc.postal_code || '',
      });
      // Only set preview from DB if user hasn't already selected a new local file
      if (kyc.front_id_url && !frontId) setFrontPreview(kyc.front_id_url);
      if (kyc.back_id_url && !backId) setBackPreview(kyc.back_id_url);
      if (kyc.selfie_url && !selfieBlob) setSelfiePreview(kyc.selfie_url);
    }
  }, [kyc]);

  // Camera logic
  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not supported in your browser. Please use Chrome, Firefox, or Safari.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOpen(true);
    } catch (err: any) {
      console.error('Camera access denied:', err);
      alert(`Could not access camera: ${err.message || 'Please allow camera permissions in your browser settings.'}`);
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setSelfieBlob(blob);
      setSelfiePreview(canvas.toDataURL('image/jpeg'));
      closeCamera();
    }, 'image/jpeg', 0.9);
  };

  useEffect(() => {
    console.log('Kyc Component Mounted. User:', user?.id);
    return () => console.log('Kyc Component Unmounted.');
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    console.log(`[DEBUG] handleFileChange called for side: ${side}`);
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    console.log(`[DEBUG] File object:`, file ? `${file.name} (${file.size} bytes)` : 'null/undefined');
    
    if (!file) {
      console.log('[DEBUG] Exiting handleFileChange early because file is missing');
      return;
    }
    
    try {
      const previewUrl = URL.createObjectURL(file);
      console.log(`[DEBUG] Generated preview URL: ${previewUrl}`);
      
      if (side === 'front') {
        if (frontPreview && frontPreview.startsWith('blob:')) {
          URL.revokeObjectURL(frontPreview);
        }
        setFrontId(file);
        setFrontPreview(previewUrl);
        console.log('[DEBUG] front state updated');
      } else {
        if (backPreview && backPreview.startsWith('blob:')) {
          URL.revokeObjectURL(backPreview);
        }
        setBackId(file);
        setBackPreview(previewUrl);
        console.log('[DEBUG] back state updated');
      }
    } catch (err) {
      console.error('[DEBUG] Error in handleFileChange:', err);
    }
  };

  const isFormComplete = form.first_name && form.last_name && form.date_of_birth &&
    form.country && form.address && form.city && form.postal_code;

  const canSubmit = isFormComplete && !uploading;

  // Read-only only if approved (allow resubmission when pending or rejected)
  const isReadOnly = kyc?.status === 'approved';

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const success = await submitKyc(user.id, form, { front: frontId, back: backId, selfie: selfieBlob });
    if (success) {
      setSubmitSuccess(true);
      // Auto hide success message after 5 seconds to show the standard status banner
      setTimeout(() => setSubmitSuccess(false), 5000);
    }
  };

  const statusConfig = {
    pending: {
      icon: 'pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20',
      label: 'Under Review', message: 'Your documents have been submitted and are currently being reviewed by our compliance team. This usually takes 1–3 business days.'
    },
    approved: {
      icon: 'verified', color: 'text-tertiary', bg: 'bg-tertiary/10 border-tertiary/20',
      label: 'Verified', message: 'Your identity has been successfully verified. You now have full access to all Jamex Global Markets features.'
    },
    rejected: {
      icon: 'cancel', color: 'text-error', bg: 'bg-error/10 border-error/20',
      label: 'Rejected', message: kyc?.rejection_reason || 'Your submission was rejected. Please re-submit with correct documents.'
    }
  };

  const inputClass = `bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2 md:p-3 text-xs md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-medium disabled:opacity-60 disabled:cursor-not-allowed`;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="p-2.5 md:p-margin-desktop pt-4 md:pt-8 pb-6 md:pb-12 max-w-[1400px] mx-auto w-full">

      {/* Success Banner */}
      {submitSuccess && (
        <div className="mb-4 md:mb-6 rounded-xl border bg-tertiary/10 border-tertiary/20 p-3 md:p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p className="font-bold text-xs md:text-sm uppercase tracking-wider mb-0.5 text-tertiary">Submitted Successfully</p>
            <p className="text-[10px] md:text-xs text-on-surface-variant">Your KYC documents have been submitted and are now under review.</p>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {kyc && !submitSuccess && (
        <div className={`mb-4 md:mb-6 rounded-xl border p-3 md:p-4 flex items-start gap-3 ${statusConfig[kyc.status].bg}`}>
          <span className={`material-symbols-outlined text-[22px] md:text-[28px] shrink-0 ${statusConfig[kyc.status].color}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {statusConfig[kyc.status].icon}
          </span>
          <div>
            <p className={`font-bold text-xs md:text-sm uppercase tracking-wider mb-0.5 ${statusConfig[kyc.status].color}`}>
              KYC Status: {statusConfig[kyc.status].label}
            </p>
            <p className="text-[10px] md:text-xs text-on-surface-variant leading-relaxed">{statusConfig[kyc.status].message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-6 flex-grow">

        {/* Left Column: Personal Form */}
        <section className="lg:col-span-7 space-y-2.5 md:space-y-6">
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 border-b border-outline-variant/10">
              <h3 className="text-[10px] md:text-label-md font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] md:text-[20px]">person</span>
                Personal Details
              </h3>
            </div>
            <div className="p-2.5 md:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Legal First Name</label>
                  <input className={inputClass} placeholder="John" type="text" value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} disabled={isReadOnly} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Legal Last Name</label>
                  <input className={inputClass} placeholder="Doe" type="text" value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} disabled={isReadOnly} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Date of Birth</label>
                  <input className={`${inputClass} [color-scheme:dark]`} type="date" value={form.date_of_birth}
                    onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} disabled={isReadOnly} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Country of Residence</label>
                  <select className={inputClass} value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))} disabled={isReadOnly}>
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Residential Address</label>
                  <input className={inputClass} placeholder="Street name, Building No." type="text" value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))} disabled={isReadOnly} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">City</label>
                  <input className={inputClass} placeholder="London" type="text" value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))} disabled={isReadOnly} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider">Postal Code</label>
                  <input className={inputClass} placeholder="EC1A 1BB" type="text" value={form.postal_code}
                    onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} disabled={isReadOnly} />
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="glass-card border border-outline-variant/20 rounded-xl p-2.5 md:p-5 flex items-start gap-2 md:gap-4 bg-primary/5">
            <div className="bg-primary/10 border border-primary/20 p-1.5 md:p-3 rounded-lg shrink-0">
              <span className="material-symbols-outlined text-primary text-[16px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span>
            </div>
            <div>
              <h4 className="text-[10px] md:text-sm font-bold text-on-surface mb-0.5 uppercase tracking-wide">Institutional Security Standards</h4>
              <p className="text-[8px] md:text-xs text-on-surface-variant leading-relaxed font-medium">Your sensitive information is encrypted via AES-256 and stored in vault-isolated environments. We comply with global GDPR and CCPA regulations.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Document Upload */}
        <section className="lg:col-span-5 space-y-2.5 md:space-y-6">
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 border-b border-outline-variant/10">
              <h3 className="text-[10px] md:text-label-md font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] md:text-[20px]">upload_file</span>
                Document Upload
              </h3>
            </div>
            <div className="p-2.5 md:p-5 space-y-2.5 md:space-y-4">

              {/* Front of ID */}
              <div>
                <p className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Front of Government ID</p>
                {frontPreview && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary h-28 md:h-36 mb-2">
                    <img src={frontPreview} alt="Front ID" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-white text-[10px] font-bold">ID Front Ready</span>
                      {!isReadOnly && (
                        <button type="button" onClick={() => { 
                          if (frontPreview && frontPreview.startsWith('blob:')) URL.revokeObjectURL(frontPreview);
                          setFrontPreview(null); 
                          setFrontId(null); 
                        }}
                          className="ml-auto bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors">
                          Change
                        </button>
                      )}
                    </div>
                    {uploading && uploadProgress.front > 0 && uploadProgress.front < 100 && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20">
                        <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress.front}%` }} />
                      </div>
                    )}
                  </div>
                )}
                {!isReadOnly && !frontPreview && (
                  <input
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="block w-full text-xs text-on-surface-variant cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest p-3
                      file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                      file:text-xs file:font-bold file:uppercase file:tracking-wider
                      file:bg-primary file:text-on-primary file:cursor-pointer
                      hover:file:brightness-110 hover:border-primary/60"
                  />
                )}
              </div>

              {/* Proof of Address */}
              <div>
                <p className="text-[8px] md:text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Proof of Address</p>
                {backPreview && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary h-28 md:h-36 mb-2">
                    <img src={backPreview} alt="Proof of Address" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-white text-[10px] font-bold">Address Doc Ready</span>
                      {!isReadOnly && (
                        <button type="button" onClick={() => { 
                          if (backPreview && backPreview.startsWith('blob:')) URL.revokeObjectURL(backPreview);
                          setBackPreview(null); 
                          setBackId(null); 
                        }}
                          className="ml-auto bg-white/20 hover:bg-white/40 text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors">
                          Change
                        </button>
                      )}
                    </div>
                    {uploading && uploadProgress.back > 0 && uploadProgress.back < 100 && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20">
                        <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress.back}%` }} />
                      </div>
                    )}
                  </div>
                )}
                {!isReadOnly && !backPreview && (
                  <input
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="block w-full text-xs text-on-surface-variant cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest p-3
                      file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                      file:text-xs file:font-bold file:uppercase file:tracking-wider
                      file:bg-primary file:text-on-primary file:cursor-pointer
                      hover:file:brightness-110 hover:border-primary/60"
                  />
                )}
              </div>

              {/* Liveness / Selfie */}
              <div className="bg-surface-container-low rounded-xl p-2.5 md:p-4 border border-outline-variant/30">
                <div className="flex items-center justify-between mb-2.5 md:mb-4">
                  <div>
                    <p className="text-[10px] md:text-sm font-bold uppercase tracking-wide">Liveness Check</p>
                    <p className="text-[8px] md:text-xs text-on-surface-variant mt-0.5 font-medium">Live facial verification required</p>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={isCameraOpen ? closeCamera : openCamera}
                      className={`px-2.5 py-1 md:px-4 md:py-2 rounded-lg text-[8px] md:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${isCameraOpen ? 'bg-error/10 text-error border-error/20 hover:bg-error/20' : 'bg-primary border-primary text-on-primary hover:brightness-110 active:scale-95 shadow-sm'}`}
                    >
                      {isCameraOpen ? 'Close Cam' : selfiePreview ? 'Retake' : 'Open Cam'}
                    </button>
                  )}
                </div>

                {/* Video stream */}
                {isCameraOpen && (
                  <div className="relative mb-2">
                    <video ref={videoRef} className="w-full rounded-lg border border-primary/30 aspect-video object-cover" playsInline muted />
                    <div className="absolute bottom-2 inset-x-0 flex justify-center">
                      <button onClick={captureSelfie} className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all">
                        Capture
                      </button>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/50 shadow-[0_0_8px_#2563EB] animate-[scan_3s_infinite]"></div>
                  </div>
                )}

                {/* Selfie preview / placeholder */}
                {!isCameraOpen && (
                  <div className={`aspect-square w-14 md:w-24 mx-auto rounded-full bg-surface-container-lowest border flex items-center justify-center relative overflow-hidden ${selfiePreview ? 'border-primary' : 'border-outline-variant/50'}`}>
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[24px] md:text-4xl text-outline/30">face</span>
                    )}
                    {selfiePreview && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                      </div>
                    )}
                    {uploading && uploadProgress.selfie > 0 && uploadProgress.selfie < 100 && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                        <div className="h-full bg-primary" style={{ width: `${uploadProgress.selfie}%` }}></div>
                      </div>
                    )}
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1 md:pt-0">
            {error && (
              <div className="mb-2 text-xs font-medium text-error bg-error/10 border border-error/20 p-2 rounded-lg">{error}</div>
            )}
            <button
              disabled={!canSubmit || isReadOnly}
              onClick={handleSubmit}
              className={`w-full py-2 md:py-4 rounded-lg text-[10px] md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer mb-2.5 md:mb-4 shadow-sm ${
                isReadOnly
                  ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
                  : canSubmit
                  ? 'bg-primary text-on-primary shadow-primary/20 hover:brightness-110 active:scale-[0.98]'
                  : 'bg-surface-container-high text-outline/50 cursor-not-allowed'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Uploading Documents...
                </span>
              ) : isReadOnly ? (
                kyc?.status === 'approved' ? '✓ KYC Verified' : 'Awaiting Review'
              ) : (
                'Submit Verification'
              )}
            </button>
            <p className="text-center text-[8px] md:text-[10px] text-on-surface-variant px-1 md:px-4 leading-snug font-medium">
              By clicking submit, you agree to our <Link className="text-primary hover:underline font-bold" to="#">Terms of Service</Link> and acknowledge the processing of your biometric data.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
